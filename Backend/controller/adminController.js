import prisma from "../db/dbConfig.js";

// Helper
const calculateChange = (current, previous) => {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

//Dashboard Stat Cards
export const getDashboardStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // Today's orders
    const todayOrders = await prisma.order.count({
      where: { createdAt: { gte: startOfToday } },
    });

    const yesterdayOrders = await prisma.order.count({
      where: { createdAt: { gte: startOfYesterday, lt: startOfToday } },
    });

    // Today's sales
    const todaySalesData = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED", paidAt: { gte: startOfToday } },
    });
    const todaySales = todaySalesData._sum.amount || 0;

    const yesterdaySalesData = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "COMPLETED",
        paidAt: { gte: startOfYesterday, lt: startOfToday },
      },
    });
    const yesterdaySales = yesterdaySalesData._sum.amount || 0;

    // Active pickup slots
    const totalPickupSlots = await prisma.pickupSlot.count({
      where: { startTime: { gte: startOfToday } },
    });

    const activePickupSlots = await prisma.pickupSlot.count({
      where: { startTime: { gte: startOfToday }, maxOrders: { gt: 0 } },
    });

    // Top selling item today
    const topSellingItems = await prisma.orderItem.groupBy({
      by: ["dishId"],
      _sum: { quantity: true },
      where: { order: { createdAt: { gte: startOfToday } } },
      orderBy: { _sum: { quantity: "desc" } },
      take: 1,
    });

    let topSellingItem = { name: "N/A", unitsSold: 0 };
    if (topSellingItems.length > 0) {
      const dish = await prisma.dish.findUnique({
        where: { id: topSellingItems[0].dishId },
      });
      topSellingItem = {
        name: dish?.name || "N/A",
        unitsSold: topSellingItems[0]._sum.quantity,
      };
    }

    res.json({
      success: true,
      data: {
        todayOrders,
        todayOrdersChange: calculateChange(todayOrders, yesterdayOrders),
        todaySales,
        todaySalesChange: calculateChange(todaySales, yesterdaySales),
        activePickupSlots,
        totalPickupSlots,
        topSellingItem,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Sales Trend Chart (Revenue by Day)
export const getSalesTrend = async (req, res) => {
  try {
    const revenueByDay = [
      { date: "Mon", revenue: 0 },
      { date: "Tue", revenue: 0 },
      { date: "Wed", revenue: 0 },
      { date: "Thu", revenue: 0 },
      { date: "Fri", revenue: 0 },
      { date: "Sat", revenue: 0 },
      { date: "Sun", revenue: 0 },
    ];

    const allOrders = await prisma.order.findMany({
      include: { payment: true },
    });

    let totalWeekRevenue = 0;

    allOrders.forEach((order) => {
      if (order.payment?.status === "COMPLETED") {
        const day = new Date(order.createdAt).getDay();
        const index = day === 0 ? 6 : day - 1;
        revenueByDay[index].revenue += order.totalAmount;
        totalWeekRevenue += order.totalAmount;
      }
    });

    // Weekly change
    const today = new Date();
    const thisWeekStart = new Date();
    thisWeekStart.setDate(today.getDate() - 7);
    const lastWeekStart = new Date();
    lastWeekStart.setDate(today.getDate() - 14);

    const thisWeekRevenueData = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED", paidAt: { gte: thisWeekStart } },
    });

    const lastWeekRevenueData = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "COMPLETED",
        paidAt: { gte: lastWeekStart, lt: thisWeekStart },
      },
    });

    const thisWeekRevenue = thisWeekRevenueData._sum.amount || 0;
    const lastWeekRevenue = lastWeekRevenueData._sum.amount || 0;

    res.json({
      success: true,
      data: {
        revenueByDay,
        totalWeekRevenue: thisWeekRevenue,
        revenueChange: calculateChange(thisWeekRevenue, lastWeekRevenue),
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Busiest Pickup Hours
export const getBusiestHours = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayAllOrders = await prisma.order.findMany({
      where: { createdAt: { gte: startOfToday } },
      select: { createdAt: true },
    });

    const hourlyOrders = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: 0,
    }));

    todayAllOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      hourlyOrders[hour].orders += 1;
    });

    // Business hours only (9am - 5pm)
    const busiestHours = hourlyOrders.filter(
      (h) => h.hour >= 9 && h.hour <= 17,
    );

    // Find peak hour
    const peakHour = busiestHours.reduce(
      (max, h) => (h.orders > max.orders ? h : max),
      busiestHours[0],
    );

    res.json({
      success: true,
      data: {
        busiestHours,
        peakHour: peakHour?.hour || 12,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Live / Recent Orders
export const getRecentOrders = async (req, res) => {
  try {
    const recentOrdersRaw = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        items: { include: { dish: true } },
        pickupSlot: true,
      },
    });

    const recentOrders = recentOrdersRaw.map((order, index) => ({
      _id: `ORD-${1000 + index}`,
      user: { name: order.user.name },
      items: order.items.map((item) => ({
        dish: { name: item.dish.name },
        quantity: item.quantity,
      })),
      totalAmount: order.totalAmount,
      status: order.status.toLowerCase(),
      createdAt: order.createdAt,
      pickupTime: order.pickupSlot?.startTime || null,
    }));

    res.json({
      success: true,
      data: { recentOrders },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Overview Stats (total counts + weekly changes)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();

    const revenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    });
    const totalRevenue = revenueResult._sum.amount || 0;

    const activeOrders = await prisma.order.count({
      where: {
        status: {
          in: ["PENDING", "CONFIRMED", "PREPARING", "READY_FOR_PICKUP"],
        },
      },
    });

    const today = new Date();
    const thisWeekStart = new Date();
    thisWeekStart.setDate(today.getDate() - 7);
    const lastWeekStart = new Date();
    lastWeekStart.setDate(today.getDate() - 14);

    const thisWeekOrders = await prisma.order.count({
      where: { createdAt: { gte: thisWeekStart } },
    });

    const lastWeekOrders = await prisma.order.count({
      where: { createdAt: { gte: lastWeekStart, lt: thisWeekStart } },
    });

    const thisWeekUsers = await prisma.user.count({
      where: { createdAt: { gte: thisWeekStart } },
    });

    const lastWeekUsers = await prisma.user.count({
      where: { createdAt: { gte: lastWeekStart, lt: thisWeekStart } },
    });

    const thisWeekRevenueData = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED", paidAt: { gte: thisWeekStart } },
    });

    const lastWeekRevenueData = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "COMPLETED",
        paidAt: { gte: lastWeekStart, lt: thisWeekStart },
      },
    });

    const thisWeekRevenue = thisWeekRevenueData._sum.amount || 0;
    const lastWeekRevenue = lastWeekRevenueData._sum.amount || 0;

    // Category distribution
    const items = await prisma.orderItem.findMany({
      include: { dish: { include: { category: true } } },
    });

    const categoryMap = {};
    items.forEach((item) => {
      const name = item.dish.category.name;
      if (!categoryMap[name]) categoryMap[name] = 0;
      categoryMap[name] += item.quantity;
    });

    const categoryDistribution = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        activeOrders,
        revenueChange: calculateChange(thisWeekRevenue, lastWeekRevenue),
        ordersChange: calculateChange(thisWeekOrders, lastWeekOrders),
        usersChange: calculateChange(thisWeekUsers, lastWeekUsers),
        categoryDistribution,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
