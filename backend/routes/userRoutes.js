import express from 'express'
import {
  getProfile,
  getUsers,
  getUserByIdController,
  updateUserController,
  deleteUserController
} from '../controllers/userController.js'

import {protect,isAdmin} from '../../middlewares/auth.middleware.js'


const router = express.Router()

/**
 * CLIENT + ADMIN
 * @route   GET /api/users/me
 */
router.get('/me', protect, getProfile)

/**
 * ADMIN uniquement
 * @route   GET /api/users
 */
router.get('/', protect, isAdmin, getUsers)

/**
 * ADMIN uniquement
 * @route   GET /api/users/:id
 */
router.get('/:id', protect, isAdmin, getUserByIdController)

/**
 * ADMIN uniquement
 * @route   PUT /api/users/:id
 */
router.put('/:id', protect,isAdmin, updateUserController)

/**
 * ADMIN uniquement
 * @route   DELETE /api/users/:id
 */
router.delete('/:id', protect, isAdmin, deleteUserController)

export default router
