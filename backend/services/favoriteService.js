import User from '../models/userModel.js'
import Product from '../models/productModel.js'

// Ajouter aux favoris
export const addToFavorites = async (userId, productId) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  const product = await Product.findById(productId)
  if (!product) throw new Error('Product not found')

  if (user.favorites.includes(productId)) {
    throw new Error('Product already in favorites')
  }

  user.favorites.push(productId)
  await user.save()

  return await user.populate('favorites')
}

// Supprimer des favoris
export const removeFromFavorites = async (userId, productId) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')

  user.favorites = user.favorites.filter(
    (id) => id.toString() !== productId
  )

  await user.save()
  return await user.populate('favorites')
}

// Récupérer mes favoris
export const getMyFavorites = async (userId) => {
  const user = await User.findById(userId)
    .populate('favorites')

  if (!user) throw new Error('User not found')

  return user.favorites
}
