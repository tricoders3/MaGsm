import {
  registerUser,
  loginUser,
  googleLogin,
} from "../services/authService.js";

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
