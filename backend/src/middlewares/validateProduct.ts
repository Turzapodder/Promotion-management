import { Request, Response, NextFunction } from 'express';

export const validateProductCreate = (req: Request, res: Response, next: NextFunction) => {
  const { name, price, image_url, status, weight, weight_unit } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  if (image_url !== undefined && typeof image_url !== 'string') {
    return res.status(400).json({ error: 'Invalid image_url' });
  }
  if (typeof image_url === 'string' && image_url.trim().length === 0) {
    req.body.image_url = null;
  }

  if (status !== undefined && !['new', 'active', 'deactive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  if (weight === undefined || typeof weight !== 'number' || weight <= 0) {
    return res.status(400).json({ error: 'Valid weight is required' });
  }

  if (weight_unit !== undefined && !['gm', 'kg'].includes(weight_unit)) {
    return res.status(400).json({ error: 'Invalid weight_unit' });
  }
  
  next();
};

export const validateProductUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, price, stock, is_enabled, image_url, status, weight, weight_unit } = req.body;
  
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

  if (image_url !== undefined && typeof image_url !== 'string') {
    return res.status(400).json({ error: 'Invalid image_url' });
  }
  if (typeof image_url === 'string' && image_url.trim().length === 0) {
    req.body.image_url = null;
  }

  if (status !== undefined && !['new', 'active', 'deactive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  if (weight !== undefined && (typeof weight !== 'number' || weight <= 0)) {
    return res.status(400).json({ error: 'Invalid weight' });
  }

  if (weight_unit !== undefined && !['gm', 'kg'].includes(weight_unit)) {
    return res.status(400).json({ error: 'Invalid weight_unit' });
  }
  
  next();
};
