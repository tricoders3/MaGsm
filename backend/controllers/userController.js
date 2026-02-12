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
    const userId = req.user.id;

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
    const { name, email, role } = req.body;

    const dataToUpdate = { name, email };

    //  Allow role update only for admins
    if (req.user?.role === "admin" && role) {
      dataToUpdate.role = role;
    }

    const user = await updateUser(req.params.id, dataToUpdate);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


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
/**
 * GET /api/admin/pending-requests
 * Retourne toutes les demandes en attente
 */
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await User.find({ isApproved: false, pendingRequest: true });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};