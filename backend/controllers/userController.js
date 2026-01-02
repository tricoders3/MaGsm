import {
  getMyProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../services/userService.js'

import User from '../models/userModel.js'

// CLIENT + ADMIN
export const getProfile = async (req, res) => {
  try {
    const user = await getMyProfile(req.user.id)
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (admin)
 */
export const getUsers = async (req, res) => {
  try {
    // Fetch all users, exclude passwords
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

// ADMIN
export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// ADMIN
export const updateUserController = async (req, res) => {
  try {
    // Sécurité : bloquer le changement de rôle
    if (req.body.role) delete req.body.role

    const user = await updateUser(req.params.id, req.body)
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// ADMIN
export const deleteUserController = async (req, res) => {
  try {
    await deleteUser(req.params.id)
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
