import User from '../models/userModel.js'


export const updateUserByHimself = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");

  // Champs simples autorisés
  const allowedFields = ["name", "email", "phone"];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  });

  // 🔹 Gestion de l'adresse (objet)
  if (data.address) {
    if (!user.address) {
      user.address = {};
    }

    const addressFields = [
      "street",
      "postalCode",
      "city",
      "country",
    ];

    addressFields.forEach((field) => {
      if (data.address[field] !== undefined) {
        user.address[field] = data.address[field];
      }
    });
  }

  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    provider: user.provider,
    role: user.role,
    passwordCreated: user.passwordCreated,
  };
};




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
