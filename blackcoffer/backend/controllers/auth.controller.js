import User from '../models/User.model.js';
import { generateToken } from '../utils/jwt.utils.js';

export class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
        return;
      }

      // Create new user
      const user = new User({
        email,
        password,
        name
      });

      await user.save();

      // Generate JWT token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email
      });

// ✅ Set cookie (no token exposed to frontend)
      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });  

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }

      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error.message
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
        return;
      }

      // Generate JWT token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email
      });

      // ✅ Set cookie (no token exposed to frontend)
      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error logging in',
        error: error.message
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user?.userId;

      const user = await User.findById(userId).select('-password');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user profile',
        error: error.message
      });
    }
  }

  // Logout (client-side should remove token)
  static async logout(req, res) {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  }
}