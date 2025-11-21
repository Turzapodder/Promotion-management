import { Request, Response, NextFunction } from 'express';

export const validateOrderCreate = (req: Request, res: Response, next: NextFunction) => {
  const { customer_name, items } = req.body;
  if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length === 0) {
    return res.status(400).json({ error: 'customer_name is required' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }
  for (const it of items) {
    if (typeof it.product_id !== 'number' || typeof it.unit_price !== 'number' || typeof it.quantity !== 'number' || typeof it.unit_weight !== 'number') {
      return res.status(400).json({ error: 'invalid item payload' });
    }
  }
  next();
};