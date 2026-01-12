import Cart from '../models/cartModel.js'
import Product from '../models/productModel.js'

// Récupérer le panier de l'utilisateur ou le créer
export const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: []
    });
  }

  return cart;
};


// Ajouter un produit au panier
export const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId)
  if (!product) throw new Error('Product not found')

  if (product.countInStock < quantity) {
    throw new Error('Not enough stock')
  }

  const cart = await getUserCart(userId)

  const itemIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === productId
  )

  if (itemIndex > -1) {
    const newQuantity = cart.items[itemIndex].quantity + quantity

    if (product.countInStock < newQuantity) {
      throw new Error('Not enough stock')
    }

    cart.items[itemIndex].quantity = newQuantity
  } else {
    cart.items.push({
      product: productId,
      quantity
    })
  }

  await cart.save()
  return await cart.populate('items.product')
}

// Modifier la quantité d’un produit
export const updateCartItem = async (userId, productId, quantity) => {
  if (quantity < 1) throw new Error('Quantity must be at least 1')

  const product = await Product.findById(productId)
  if (!product) throw new Error('Product not found')

  if (product.countInStock < quantity) {
    throw new Error('Not enough stock')
  }

  const cart = await getUserCart(userId)

  const item = cart.items.find(
    (item) => item.product._id.toString() === productId
  )

  if (!item) throw new Error('Product not in cart')

  item.quantity = quantity
  await cart.save()

  return await cart.populate('items.product')
}

// Supprimer un produit du panier
export const removeFromCart = async (userId, productId) => {
  const cart = await getUserCart(userId)

  cart.items = cart.items.filter(
    (item) => item.product._id.toString() !== productId
  )

  await cart.save()
  return await cart.populate('items.product')
}

// Vider le panier
export const clearCart = async (userId) => {
  const cart = await getUserCart(userId)

  cart.items = []
  await cart.save()

  return cart
}
