import User from "../models/userModel.js";

/**
 * Récupérer le profil de l’utilisateur connecté
 * CLIENT ou ADMIN
 */
export const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select('-password')
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

/**
 * Récupérer tous les utilisateurs
 * ADMIN uniquement
 */
export const getAllUsers = async () => {
  return await User.find().select('-password')
}

/**
 * Récupérer un utilisateur par ID
 * ADMIN uniquement
 */
export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password')
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

/**
 * Mettre à jour un utilisateur
 * ADMIN uniquement
 */
export const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).select('-password')

  if (!user) {
    throw new Error('User not found')
  }
  return user
}

/**
 * Supprimer un utilisateur
 * ADMIN uniquement
 */
export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id)
  if (!user) {
    throw new Error('User not found')
  }
  return true
}
