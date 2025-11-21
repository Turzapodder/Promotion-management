import { Request, Response, NextFunction } from 'express';

export const validatePromotionCreate = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, start_date, end_date, banner_url, enabled, discount_type, percentage_rate, fixed_amount } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Invalid description' });
  }

  if (!start_date || isNaN(Date.parse(start_date))) {
    return res.status(400).json({ error: 'Valid start_date is required' });
  }

  if (!end_date || isNaN(Date.parse(end_date))) {
    return res.status(400).json({ error: 'Valid end_date is required' });
  }

  if (banner_url !== undefined && typeof banner_url !== 'string') {
    return res.status(400).json({ error: 'Invalid banner_url' });
  }
  if (typeof banner_url === 'string' && banner_url.trim().length === 0) {
    req.body.banner_url = null;
  }

  if (enabled !== undefined && typeof enabled !== 'boolean') {
    return res.status(400).json({ error: 'Invalid enabled flag' });
  }

  if (discount_type !== undefined) {
    if (typeof discount_type !== 'string' || !['percentage', 'fixed', 'weighted'].includes(discount_type)) {
      return res.status(400).json({ error: 'Invalid discount_type' });
    }
    if (discount_type === 'percentage') {
      if (percentage_rate === undefined || typeof percentage_rate !== 'number' || percentage_rate < 0) {
        return res.status(400).json({ error: 'percentage_rate must be a non-negative number' });
      }
    }
    if (discount_type === 'fixed') {
      if (fixed_amount === undefined || typeof fixed_amount !== 'number' || fixed_amount < 0) {
        return res.status(400).json({ error: 'fixed_amount must be a non-negative number' });
      }
    }
  }

  next();
};

export const validatePromotionUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { title, start_date, end_date } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'Invalid title' });
  }

  if (start_date !== undefined && isNaN(Date.parse(start_date))) {
    return res.status(400).json({ error: 'Invalid start_date' });
  }

  if (end_date !== undefined && isNaN(Date.parse(end_date))) {
    return res.status(400).json({ error: 'Invalid end_date' });
  }

  next();
};