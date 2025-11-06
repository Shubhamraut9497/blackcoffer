import { Request, Response, NextFunction } from "express";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, name } = req.body;
  const errors: string[] = [];

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('Please enter a valid email');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  // Name validation
  if (!name) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;
  
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
    return;
  }

  next();
};
