const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Authorization header is missing or invalid.',
      errors: [{ message: 'Missing or malformed Authorization header' }],
    });
  }

  const token = authHeader.split(' ')[1];

  // Validate the static admin session token
  if (token !== 'vitto-admin-session-token-2026') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Admin session token is invalid or has expired.',
      errors: [{ message: 'Invalid session token' }],
    });
  }

  next();
};

module.exports = authMiddleware;
