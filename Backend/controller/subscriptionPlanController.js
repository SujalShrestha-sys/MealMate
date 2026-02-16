import prisma from "../db/dbConfig.js";

/**
 * Create a new subscription plan (Admin only)
 */
export const createPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      durationDays,
      period,
      meals,
      features,
      popular,
    } = req.body;

    // Validations
    if (
      !name ||
      price === undefined ||
      !durationDays ||
      !period ||
      meals === undefined ||
      !features
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, price, durationDays, period, meals, features",
      });
    }

    // Validation: price should be positive
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    // Validation: durationDays should be positive
    if (durationDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration days must be greater than 0",
      });
    }

    // Validation: period should be valid
    if (!["week", "month"].includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Period must be either 'week' or 'month'",
      });
    }

    // Validation: meals should be positive
    if (meals <= 0) {
      return res.status(400).json({
        success: false,
        message: "Meals count must be greater than 0",
      });
    }

    // Validation: features should be an array
    if (!Array.isArray(features) || features.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Features must be a non-empty array",
      });
    }

    // Check if plan already exists
    const planExists = await prisma.subscriptionPlan.findUnique({
      where: { name },
    });

    if (planExists) {
      return res.status(409).json({
        success: false,
        message: "Plan with this name already exists",
      });
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        description: description || null,
        price,
        durationDays,
        period,
        meals,
        features,
        popular: popular || false,
      },
    });

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error creating plan",
      error: error.message,
    });
  }
};

/**
 * Get all subscription plans
 */
export const getPlan = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: [{ popular: "desc" }, { createdAt: "desc" }],
    });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching plans",
    });
  }
};

/**
 * Get a single plan by ID
 */
export const getPlanById = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching plan",
      error: error.message,
    });
  }
};

/**
 * Update a subscription plan (Admin only)
 */
export const updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const {
      name,
      description,
      price,
      durationDays,
      period,
      meals,
      features,
      popular,
      isActive,
    } = req.body;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    // Check if plan exists
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    // Validations for provided fields
    if (price !== undefined && price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
    }

    if (durationDays !== undefined && durationDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Duration days must be greater than 0",
      });
    }

    if (period && !["week", "month"].includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Period must be either 'week' or 'month'",
      });
    }

    if (meals !== undefined && meals <= 0) {
      return res.status(400).json({
        success: false,
        message: "Meals count must be greater than 0",
      });
    }

    if (features && (!Array.isArray(features) || features.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Features must be a non-empty array",
      });
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (durationDays !== undefined) updateData.durationDays = durationDays;
    if (period !== undefined) updateData.period = period;
    if (meals !== undefined) updateData.meals = meals;
    if (features !== undefined) updateData.features = features;
    if (popular !== undefined) updateData.popular = popular;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id: planId },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Plan name already exists",
      });
    }
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error updating plan",
      error: error.message,
    });
  }
};

/**
 * Delete a subscription plan (Admin only)
 */
export const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    await prisma.subscriptionPlan.delete({
      where: { id: planId },
    });

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting plan",
      error: error.message,
    });
  }
};

/**
 * Purchase a subscription plan
 */
export const purchasePlan = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { planId } = req.body;

    // Validation
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required",
      });
    }

    // Check if plan exists and is active
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    if (!plan.isActive) {
      return res.status(400).json({
        success: false,
        message: "This plan is no longer available",
      });
    }

    // Check for active subscription
    const activeSub = await prisma.userSubscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (activeSub) {
      return res.status(400).json({
        success: false,
        message:
          "You already have an active subscription. Please cancel it first.",
      });
    }

    // Create subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const subscription = await prisma.userSubscription.create({
      data: {
        userId,
        planId,
        startDate,
        endDate,
        status: "ACTIVE",
      },
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Subscription activated successfully",
      data: subscription,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error purchasing plan",
      error: error.message,
    });
  }
};

/**
 * Get user's active subscription
 */
export const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "No active subscription found",
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription",
      error: error.message,
    });
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { subscriptionId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required",
      });
    }

    const subscription = await prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // Check if subscription belongs to the user
    if (subscription.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: This subscription does not belong to you",
      });
    }

    const cancelled = await prisma.userSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: "CANCELLED",
      },
    });

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: cancelled,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error cancelling subscription",
      error: error.message,
    });
  }
};

/**
 * Get subscription history for a user
 */
export const getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const subscriptions = await prisma.userSubscription.findMany({
      where: { userId },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription history",
      error: error.message,
    });
  }
};
