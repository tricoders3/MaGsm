
import express from 'express'
import {
  getProfile,
  getUsers,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  updateMe ,  getLoyaltyPoints
} from '../controllers/userController.js'

import {protect,isAdmin} from '../middlewares/authMiddleware.js'


const router = express.Router()

/**
 * CLIENT + ADMIN
 * @route   GET /api/users/me

 */
router.get('/me',  getProfile)
router.put("/me",  updateMe);
router.get("/",  getUsers);
/**
 * ADMIN uniquement
 * @route   GET /api/users
 */
router.get('/', protect, isAdmin, getUsers)
router.get("/loyalty-points", protect, getLoyaltyPoints);
router.get('/',  getUsers)

/**
 * ADMIN uniquement
 * @route   GET /api/users/:id
 */
router.get('/:id',  getUserByIdController)

/**
 * ADMIN uniquement
 * @route   PUT /api/users/:id
 */
router.put('/:id',  updateUserController)

/**
 * ADMIN uniquement
 * @route   DELETE /api/users/:id
 */
router.delete('/:id',  deleteUserController)

export default router
