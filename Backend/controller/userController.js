import prisma from "../db/dbConfig.js";

// GET ALL USERS (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// GET USER BY ID (Users can view their own profile, admins can view any)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Check authorization: user can only view own profile, admins can view any
    if (userId !== id && userRole?.toUpperCase() !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this user",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// UPDATE USER (Users can update own profile, admins can update any)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { name, email, roleId } = req.body;

    // Check authorization: user can only update own profile, admins can update any
    if (userId !== id && userRole?.toUpperCase() !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    // Input validation
    if (!name && !email && !roleId) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name, email, or roleId) is required",
      });
    }

    if (name && typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a string",
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent non-admin users from changing roleId
    if (roleId && userRole?.toUpperCase() !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can change user roles",
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (roleId && userRole?.toUpperCase() === "ADMIN")
      updateData.roleId = roleId;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// DELETE USER (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists before attempting to delete
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

export const getAdminUser = async (req, res, next) => {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: { name: "ADMIN" } },
      select: { id: true, name: true, email: true },
    });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "No admin found" });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

// GET ALL ROLES (Admin)
export const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" },
    });

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
    });
  }
};
