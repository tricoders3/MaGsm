import express from 'express'
import {
  getMyCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearMyCart
} from '../controllers/cartController.js'
import {protect} from '../middlewares/authMiddleware.js'

const router = express.Router()

// Récupérer le panier de l'utilisateur connecté
router.get('/', protect, getMyCart)

// Ajouter un produit au panier
router.post('/',  addItemToCart)

// Modifier la quantité d’un produit
router.put('/:productId', protect, updateItemQuantity)

// Supprimer un produit du panier
router.delete('/:productId', protect, removeItemFromCart)

// Vider le panier
router.delete('/', protect, clearMyCart)

export default router
