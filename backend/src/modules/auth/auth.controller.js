const User = require('./auth.model');
const { generateToken } = require('./auth.service');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ firstName, lastName, email, password });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const resetPasswordDirect = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    // If user doesn't exist, return success anyway (security)
    if (!user) {
      return res.json({ success: true, message: 'Password updated' });
    }
    
    // Check if same password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.json({ success: true, message: 'Password updated' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Reset failed' });
  }
};

module.exports = {
  register,
  login,
  resetPasswordDirect
};
