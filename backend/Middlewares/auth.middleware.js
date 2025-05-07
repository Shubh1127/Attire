const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from cookies instead of Authorization header
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Clear the invalid token cookie
    res.clearCookie('token');
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;