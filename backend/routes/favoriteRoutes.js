import express from 'express'
import {
  addFavorite,
  removeFavorite,
  getFavorites
} from '../controllers/favoriteController.js'
import {protect} from '../middlewares/authMiddleware.js'


const router = express.Router()

// Récupérer mes favoris
router.get('/', protect, getFavorites)

// Ajouter un produit aux favoris
router.post('/:productId', protect, addFavorite)

// Supprimer un produit des favoris
router.delete('/:productId', protect, removeFavorite)

export default router
