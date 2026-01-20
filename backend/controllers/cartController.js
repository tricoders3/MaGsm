import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,  updateCartLoyaltyPoints
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
// Ajouter un produit
export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const cart = await addToCart(req.user.id, productId, quantity || 1)

    // 🔹 Mettre à jour les points fidélité
    const loyaltyPoints = await updateCartLoyaltyPoints(req.user.id)

    res.status(200).json({ cart, loyaltyPoints })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Modifier quantité
export const updateItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body

    const cart = await updateCartItem(req.user.id, req.params.productId, quantity)

    // 🔹 Mettre à jour les points fidélité
    const loyaltyPoints = await updateCartLoyaltyPoints(req.user.id)

    res.status(200).json({ cart, loyaltyPoints })
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
