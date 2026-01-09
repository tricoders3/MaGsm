import {
  registerUser,
  loginUser,
  googleLogin,
  facebookLogin,
   updateUserPassword, generatePasswordResetToken, resetUserPassword 
} from "../services/authService.js";
import { sendEmail } from "../utils/sendEmail.js"; // Ton utils pour envoyer mail

/**
 * Register (email / password)
 */
export const register = async (req, res) => {
  try {
    await registerUser(req.body);
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Login (email / password)
 */
export const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * Google OAuth success
 * (called AFTER passport authentication)
 */
export const googleLoginSuccess = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { accessToken, refreshToken } = await googleLogin(req.user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.redirect(
    `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`
  );
};

/**
 * Facebook OAuth success
 * (same logic as Google)
 */
export const facebookLoginSuccess = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { accessToken, refreshToken } = await facebookLogin(req.user);

  // Mettre le refresh token dans cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  // Redirection vers frontend avec token
   res.redirect(
    `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`
  );

};

/**
 * Logout
 */
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la déconnexion" });
    }

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Déconnecté avec succès" });
  });
};
// 🔹 Utilisateur connecté change mot de passe
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Les deux champs sont requis" });

    await updateUserPassword(req.user.id, currentPassword, newPassword);

    res.status(200).json({ message: "Mot de passe mis à jour ✅" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requis" });

    const resetToken = await generatePasswordResetToken(email);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Réinitialisation de mot de passe",
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`,
    });

    res.status(200).json({ message: "Email de réinitialisation envoyé ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: "Nouveau mot de passe requis" });

    await resetUserPassword(token, newPassword);

    res.status(200).json({ message: "Mot de passe réinitialisé ✅" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

