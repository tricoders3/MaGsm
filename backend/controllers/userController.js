import {
  getMyProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,updateUserByHimself
} from '../services/userService.js';
import User from '../models/userModel.js';

// CLIENT – user himself
export const updateMe = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await updateUserByHimself(userId, req.body);

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


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
    const users = await getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des utilisateurs'
    })
  }
}

// ADMIN
export const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id)
    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// ADMIN
export const updateUserController = async (req, res) => {
  try {
    // Sécurité : interdire la modification du rôle
    if ('role' in req.body) delete req.body.role

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
    res.status(404).json({ message: error.message })
  }
}
export const getLoyaltyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // tu récupères l'user via le token
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json({
      loyaltyPoints: user.loyaltyPoints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};