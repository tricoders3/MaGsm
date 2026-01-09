import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../services/cartService.js'

// CLIENT
export const getMyCart = async (req, res) => {
  try {
    const cart = await getUserCart(req.user.id);

    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    res.status(200).json({
      cart,
      totalPrice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// CLIENT
export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' })
    }

    const cart = await addToCart(
      req.user.id,
      productId,
      quantity || 1
    )

    res.status(200).json(cart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// CLIENT
export const updateItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: 'Quantity must be at least 1' })
    }

    const cart = await updateCartItem(
      req.user.id,
      req.params.productId,
      quantity
    )

    res.status(200).json(cart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// CLIENT
export const removeItemFromCart = async (req, res) => {
  try {
    const cart = await removeFromCart(
      req.user.id,
      req.params.productId
    )

    res.status(200).json(cart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// CLIENT
export const clearMyCart = async (req, res) => {
  try {
    const cart = await clearCart(req.user.id)
    res.status(200).json(cart)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
