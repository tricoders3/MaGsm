import {
  addToFavorites,
  removeFromFavorites,
  getMyFavorites
} from '../services/favoriteService.js'

// CLIENT
export const addFavorite = async (req, res) => {
  try {
    const favorites = await addToFavorites(
      req.user.id,
      req.params.productId
    )
    res.status(200).json(favorites)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// CLIENT
export const removeFavorite = async (req, res) => {
  try {
    const favorites = await removeFromFavorites(
      req.user.id,
      req.params.productId
    )
    res.status(200).json(favorites)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// CLIENT
export const getFavorites = async (req, res) => {
  try {
    const favorites = await getMyFavorites(req.user.id)
    res.status(200).json(favorites)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
