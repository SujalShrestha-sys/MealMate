import prisma from "../db/dbConfig.js";

export const getAllDishes = async (request, response) => {
    try {
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 8;
        const skip = (page - 1) * limit;

        const dishes = await prisma.dish.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        console.log("Dishes: ", dishes);

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
        console.log(error.message);
        return response.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSingleDish = async (request, response) => {
    try {
        const id = request.params.id;

        const dish = await prisma.dish.findUnique({
            where: { id },
        });

        if (!dish) {
            return response.status(404).json({
                success: false,
                message: "Dish not found!",
            });
        }

        console.log("Dish: ", dish);

        return response.status(200).json({
            success: true,
            message: "dish fetched successfully!",
            data: dish,
        });
    } catch (error) {
        console.log(error);
        return response.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getByCategory = async (request, response) => {
    try {
        const category = request.params.category;
        const limit = parseInt(request.query.limit) || 10;
        const page = parseInt(request.query.page) || 1;
        const skip = (page - 1) * limit;

        // Count only category-based dishes
        const totalDishes = await prisma.dish.count({
            where: {
                category: {
                    contains: category,
                    mode: "insensitive",
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
                    contains: category,
                    mode: "insensitive",
                },
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
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
        console.log(error);
        return response.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const searchDishes = async (request, response) => {
    try {
        const { q } = request.query;
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!q) {
            return response.status(400).json({
                success: false,
                message: "Search term required",
            });
        }

        // Count total matching dishes
        const totalDishes = await prisma.dish.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });

        // Fetch paginated matching dishes
        const dishes = await prisma.dish.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        const totalPages = Math.ceil(totalDishes / limit);

        return response.status(200).json({
            success: true,
            count: totalDishes,
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
        console.log(error.message);
        return response.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

