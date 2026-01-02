import User from '../models/userModel.js'

// CLIENT + ADMIN
export const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select('-password')
  if (!user) throw new Error('User not found')
  return user
}

// ADMIN
export const getAllUsers = async () => {
  return await User.find().select('-password')
}

// ADMIN
export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password')
  if (!user) throw new Error('User not found')
  return user
}

// ADMIN
export const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  }).select('-password')

  if (!user) throw new Error('User not found')
  return user
}

// ADMIN
export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id)
  if (!user) throw new Error('User not found')
  return true
}
