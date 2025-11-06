import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  try {
    // Try Authorization header first
    let token = req.headers.authorization?.split(' ')[1];

    // If not present, try cookie 'token'
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').map(c => c.trim());
      for (const c of cookies) {
        if (c.startsWith('token=')) {
          token = decodeURIComponent(c.split('=')[1]);
          break;
        }
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};