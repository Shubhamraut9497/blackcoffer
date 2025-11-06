
import { Request, Response } from "express";
import User, { type IUserDocument } from '../models/User.model.js';
import { generateToken } from '../utils/jwt.utils.js';
import type { AuthResponse } from "../types/auth.type.js";


export class AuthController {
  // Register new user
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        } as AuthResponse);
        return;
      }

      // Create new user
      const user: IUserDocument = new User({
        email,
        password,
        name
      });

      await user.save();

      // Generate JWT token
      const token = generateToken({
        userId: user._id.toString() ,
        email: user.email
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      } as AuthResponse);
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error.message
      });
    }
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        } as AuthResponse);
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        } as AuthResponse);
        return;
      }

      // Generate JWT token
      const token = generateToken({
        userId: user._id.toString(),
        email: user.email
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      } as AuthResponse);
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error logging in',
        error: error.message
      });
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user profile',
        error: error.message
      });
    }
  }

  // Logout (client-side should remove token)
  static async logout(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  }
}