import {
  registerUser,
  loginUser, googleLogin, facebookLogin,
 requestAccess, approveUser,
   updateUserPassword, generatePasswordResetToken, resetUserPassword, createPasswordForSocialUser
} from "../services/authService.js";
import { sendEmail } from "../utils/sendEmail.js"; // Ton utils pour envoyer mail

/**
 * Register (email / password)
 */
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "Inscription réussie, en attente de validation.", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const requestPriceAccess = async (req, res) => {
  try {
    const user = await requestAccess(req.user.id);
    res.json({ message: "Demande envoyée à l'admin.", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const approveUserByLink = async (req, res) => {
  try {
    const user = await approveUser(req.params.userId);
    res.send("Utilisateur approuvé avec succès !");
  } catch (err) {
    res.status(400).send(err.message);
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
 * GOOGLE OAuth SUCCESS
 * appelé après passport.authenticate("google")
 */
export const googleLoginSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { user, accessToken, refreshToken } = await googleLogin(req.user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`
    );
  } catch (error) {
    // ⛔ compte non approuvé
    if (error.message === "ACCOUNT_NOT_APPROVED") {
      return res.redirect(
        `${process.env.CLIENT_URL}/waiting-approval`
      );
    }

    console.error("Google login error:", error);
    res.redirect(`${process.env.CLIENT_URL}/oauth-error`);
  }
};

/**
 * FACEBOOK OAuth SUCCESS
 * appelé après passport.authenticate("facebook")
 */
export const facebookLoginSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { user, accessToken, refreshToken } = await facebookLogin(req.user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`
    );
  } catch (error) {
    if (error.message === "ACCOUNT_NOT_APPROVED") {
      return res.redirect(
        `${process.env.CLIENT_URL}/waiting-approval`
      );
    }

    console.error("Facebook login error:", error);
    res.redirect(`${process.env.CLIENT_URL}/oauth-error`);
  }
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

/**
 * 🔹 Update password (local user)
 */
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id || req.user._id; // 🔹 works for both
    await updateUserPassword(userId, currentPassword, newPassword);

    res.status(200).json({
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



/**
 * 🔹 Create password (social user)
 */
export const createPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    await createPasswordForSocialUser(req.user._id, newPassword);

    res.status(200).json({
      message: "Mot de passe créé avec succès",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * 🔹 Forgot password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = await generatePasswordResetToken(email);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `
        <h2>Réinitialisation du mot de passe</h2>
        <p>Cliquez sur le lien ci-dessous :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Expire dans 10 minutes</p>
      `,
    });

    res.status(200).json({
      message: "Email de réinitialisation envoyé",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * 🔹 Reset password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    await resetUserPassword(token, newPassword);

    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

