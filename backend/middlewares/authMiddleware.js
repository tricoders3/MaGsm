import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  try {
    const token = auth.split(" ")[1];
    // utilise la bonne variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.sendStatus(403);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
};
