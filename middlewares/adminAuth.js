const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header is in the correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ msg: 'Invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ msg: 'Failed to authenticate token' });
    }

    // Check if the decoded token has the necessary fields
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(403).json({ msg: 'Invalid token' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    req.user = { id: decoded.id, role: decoded.role };

    next();
  });
};

module.exports = adminAuth;