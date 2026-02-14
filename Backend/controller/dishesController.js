import prisma from "../db/dbConfig.js";

export const createDish = async (req, res) => {
  try {
    let { name, description, price, imageUrl, categoryName, badge } = req.body;

    // Trim string inputs
    name = name?.trim();
    categoryName = categoryName?.trim();
    description = description?.trim();
    imageUrl = imageUrl?.trim();
    badge = badge?.trim();

    // Validate required fields
    if (!name || !price || !categoryName) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    // Validate price is a positive number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: {
        name: {
          equals: categoryName,
          mode: "insensitive",
        },
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
        },
      });
    }

    // Check if dish with same name already exists in this category
    const existingDish = await prisma.dish.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        categoryId: category.id,
      },
    });

    if (existingDish) {
      return res.status(400).json({
        success: false,
        message: "This dish already exists in this category",
      });
    }

    // Create dish
    const newDish = await prisma.dish.create({
      data: {
        name,
        description: description || null,
        price: parsedPrice,
        imageUrl: imageUrl || null,
        badge: badge || null,
        categoryId: category.id,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Dish created successfully",
      data: {
        id: newDish.id,
        name: newDish.name,
        description: newDish.description,
        price: newDish.price,
        imageUrl: newDish.imageUrl,
        category: newDish.category.name,
        badge: newDish.badge,
      },
    });
  } catch (err) {
    console.error("Error creating dish:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create dish",
    });
  }
};

export const getAllDishes = async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 8;
    const skip = (page - 1) * limit;

    const dishes = await prisma.dish.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    const totalDishes = await prisma.dish.count();
    const totalPages = Math.ceil(totalDishes / limit);

    response.status(200).json({
      success: true,
      data: dishes,
      pagination: {
        totalDishes,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching dishes:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to fetch dishes",
    });
  }
};

export const getSingleDish = async (request, response) => {
  try {
    const { id } = request.params;

    const dish = await prisma.dish.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!dish) {
      return response.status(404).json({
        success: false,
        message: "Dish not found",
      });
    }

    return response.status(200).json({
      success: true,
      message: "Dish fetched successfully",
      data: dish,
    });
  } catch (error) {
    console.error("Error fetching dish:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to fetch dish",
    });
  }
};

export const getByCategory = async (request, response) => {
  try {
    const { category } = request.params;
    const limit = parseInt(request.query.limit) || 10;
    const page = parseInt(request.query.page) || 1;
    const skip = (page - 1) * limit;

    // Count dishes in this category
    const totalDishes = await prisma.dish.count({
      where: {
        category: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      },
    });

    if (totalDishes === 0) {
      return response.status(404).json({
        success: false,
        message: "No dishes found for this category",
      });
    }

    const totalPages = Math.ceil(totalDishes / limit);

    // Fetch dishes with pagination
    const dishes = await prisma.dish.findMany({
      where: {
        category: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    return response.status(200).json({
      success: true,
      data: dishes,
      pagination: {
        totalDishes,
        page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching dishes by category:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to fetch dishes",
    });
  }
};

export const searchDishes = async (request, response) => {
  try {
    const { item } = request.query;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!item || !item.trim()) {
      return response.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    // Count total matching dishes
    const totalDishes = await prisma.dish.count({
      where: {
        OR: [
          {
            name: {
              contains: item,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: item,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (totalDishes === 0) {
      return response.status(404).json({
        success: false,
        message: "No dishes found matching your search",
        data: [],
      });
    }

    // Fetch paginated matching dishes
    const dishes = await prisma.dish.findMany({
      where: {
        OR: [
          {
            name: {
              contains: item,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: item,
              mode: "insensitive",
            },
          },
        ],
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });

    const totalPages = Math.ceil(totalDishes / limit);

    return response.status(200).json({
      success: true,
      data: dishes,
      pagination: {
        totalDishes,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error searching dishes:", error.message);
    return response.status(500).json({
      success: false,
      message: "Failed to search dishes",
    });
  }
};

export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, price, imageUrl, categoryName, badge } = req.body;

    // Check if dish exists
    const dish = await prisma.dish.findUnique({
      where: { id },
    });

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found",
      });
    }

    // Trim string inputs
    name = name?.trim();
    description = description?.trim();
    imageUrl = imageUrl?.trim();
    categoryName = categoryName?.trim();
    badge = badge?.trim();

    // Validate price if provided
    if (price !== undefined) {
      price = parseFloat(price);
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid positive number",
        });
      }
    }

    // Build update data object
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (badge) updateData.badge = badge;

    // Handle category update
    if (categoryName) {
      let category = await prisma.category.findFirst({
        where: {
          name: {
            equals: categoryName,
            mode: "insensitive",
          },
        },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
          },
        });
      }

      updateData.categoryId = category.id;
    }

    // Update dish
    const updatedDish = await prisma.dish.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Dish updated successfully",
      data: updatedDish,
    });
  } catch (error) {
    console.error("Error updating dish:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update dish",
    });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate dish exists
    const dish = await prisma.dish.findUnique({
      where: { id },
    });

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found",
      });
    }

    // Delete dish
    await prisma.dish.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Dish deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting dish:", error.message);

    // Handle foreign key constraint errors
    if (error.code === "P2014") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete dish. It may be referenced in orders or cart items",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete dish",
    });
  }
};
