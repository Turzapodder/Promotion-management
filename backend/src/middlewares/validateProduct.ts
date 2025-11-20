import { Request, Response, NextFunction } from 'express';

export const validateProductCreate = (req: Request, res: Response, next: NextFunction) => {
  const { name, price } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }
  
  next();
};

export const validateProductUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, price, stock, is_enabled } = req.body;
  
  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  
  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    return res.status(400).json({ error: 'Invalid price' });
  }
  
  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    return res.status(400).json({ error: 'Invalid stock' });
  }
  
  if (is_enabled !== undefined && typeof is_enabled !== 'boolean') {
    return res.status(400).json({ error: 'Invalid is_enabled value' });
  }
  
  next();
};
