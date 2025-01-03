const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'TOKEN_MISSING', message: 'No token provided' });
  }

  // Validate 'Bearer' token format
  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'TOKEN_FORMAT_ERROR', message: 'Invalid token format' });
  }

  const actualToken = tokenParts[1];
  console.log("Received Token: ", `${actualToken.slice(0, 5)}...${actualToken.slice(-5)}`); // Log first/last 5 chars of token

  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const message = process.env.NODE_ENV === 'development' ? err.message : 'Invalid or expired token';
      console.log("JWT Verification Error: ", err); // Only in development mode
      return res.status(401).json({ error: 'TOKEN_VERIFICATION_ERROR', message });
    }
    req.userId = decoded.userId; // Set user ID in request object
    next();
  });
};

module.exports = authMiddleware;
