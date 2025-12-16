import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res) => {
  try {
    await registerUser(req.body);
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(
      req.body.email,
      req.body.password
    );

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
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
