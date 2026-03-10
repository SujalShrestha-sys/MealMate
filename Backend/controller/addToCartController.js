import prisma from "../db/dbConfig.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { dishId, quantity } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    if (!dishId || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Dish ID and quantity are required" });
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // Verify dish exists
    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
    });

    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        dishId,
      },
      include: { dish: true },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: { dish: true },
      });

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated",
        data: updatedItem,
      });
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        dishId,
        quantity,
      },
      include: { dish: true },
    });

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: cartItem,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to add item to cart" });
  }
};

// GET USER CART
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
      },
    });

    if (!cart) {
      return res.json({
        success: true,
        data: {
          items: [],
          totalPrice: 0,
          itemCount: 0,
        },
      });
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.dish.price * item.quantity;
    }, 0);

    res.json({
      success: true,
      data: {
        ...cart,
        totalPrice,
        itemCount: cart.items.length,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
};

// UPDATE CART ITEM
export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    if (!quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity is required" });
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // Verify cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true, dish: true },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }

    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this cart item",
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { dish: true },
    });

    res.json({
      success: true,
      message: "Cart item updated",
      data: updatedItem,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update cart item" });
  }
};

// REMOVE CART ITEM
export const removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Verify cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }

    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove this cart item",
      });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    res.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove cart item" });
  }
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Delete all items in cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
};
