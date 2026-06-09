const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'BANNU9';
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '30d' }
  );
};

module.exports = {
  generateToken
};
