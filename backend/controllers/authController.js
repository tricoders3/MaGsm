import { registerUser, loginUser, googleLogin } from "../services/authService.js";

/**
 * Inscription
 */
export const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);
    res.status(201).json({ message: "Utilisateur créé avec succès", userId: newUser._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Connexion
 */
export const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .json({
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * Google OAuth login
 */
export const googleLoginSuccess = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { accessToken, refreshToken } = await googleLogin(req.user);

    res
      .cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" })
      .redirect(`${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Déconnexion
 */
export const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    res.clearCookie("refreshToken");
    res.redirect(process.env.CLIENT_URL);
  });
};
