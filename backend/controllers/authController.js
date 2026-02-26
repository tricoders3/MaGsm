import {
  registerUser,
  loginUser, googleLogin, facebookLogin,
approveUser,getPendingRequestsService,
   updateUserPassword, generatePasswordResetToken, resetUserPassword, createPasswordForSocialUser
} from "../services/authService.js";
import { sendEmail,sendAdminRequestEmail, sendApprovalEmail }
   from "../utils/sendEmail.js"; 
import userModel from "../models/userModel.js";



/**
 * Register (email / password)
 */
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body); // Appelle le service
    res.status(201).json({
      message: "Inscription réussie, un email de vérification a été envoyé.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



export const approveUserByAdmin = async (req, res) => {
  try {
   
    const user = await approveUser(req.params.id);

   
    await sendAdminRequestEmail(user); 

    await sendApprovalEmail(user.email, user.name);

    res.json({ message: "Utilisateur approuvé avec succès et email envoyé", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
/**
 * GET /api/admin/pending-requests
 * Retourne toutes les demandes en attente
 */
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await getPendingRequestsService();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
        isApproved: user.isApproved,
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

    // Normaliser l'email
    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier si l'utilisateur existe
    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Générer token de réinitialisation
    const resetToken = await generatePasswordResetToken(normalizedEmail);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Envoyer l'email via nodemailer
    await sendEmail({
      to: normalizedEmail,
      subject: "Réinitialisation du mot de passe",
      html: `
        <h2>Réinitialisation du mot de passe</h2>
        <p>Bonjour ${user.name},</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ce lien expire dans 10 minutes.</p>
        <br/>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.</p>
      `,
    });

    res.status(200).json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Erreur serveur, veuillez réessayer plus tard" });
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
