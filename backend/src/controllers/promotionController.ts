import { Request, Response } from 'express';
import { PromotionModel } from '../models/Promotion';
import { PromotionSlabModel } from '../models/PromotionSlab';

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await PromotionModel.create(req.body);
    if (promotion.discount_type === 'weighted' && promotion.id) {
      const defaultMax = 1000000000; // grams (~unlimited)
      const slabs = [
        { min_weight: 1000, max_weight: 5500, unit_weight: 500, unit_discount: 2 },
        { min_weight: 6000, max_weight: 8500, unit_weight: 500, unit_discount: 3 },
        { min_weight: 9000, max_weight: 11500, unit_weight: 500, unit_discount: 4 },
        { min_weight: 12000, max_weight: defaultMax, unit_weight: 500, unit_discount: 5 },
      ];
      await PromotionSlabModel.createMany(promotion.id, slabs);
    }
    res.status(201).json({ success: true, message: 'Promotion created', data: promotion });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create promotion';
    res.status(500).json({ success: false, message });
  }
};

export const getPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await PromotionModel.findAll();
    res.json({ success: true, message: 'Promotions fetched', data: promotions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch promotions';
    res.status(500).json({ success: false, message });
  }
};

export const getEnabledPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await PromotionModel.findAllEnabled();
    res.json({ success: true, message: 'Promotions fetched', data: promotions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch promotions';
    res.status(500).json({ success: false, message });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const promotion = await PromotionModel.update(id, req.body);
    if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });
    res.json({ success: true, message: 'Promotion updated', data: promotion });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update promotion';
    res.status(500).json({ success: false, message });
  }
};

export const setPromotionEnabled = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { enabled } = req.body as { enabled: boolean };
    const promotion = await PromotionModel.setEnabled(id, !!enabled);
    if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });
    res.json({ success: true, message: 'Promotion toggled', data: promotion });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to toggle promotion';
    res.status(500).json({ success: false, message });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await PromotionModel.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Promotion not found' });
    res.status(200).json({ success: true, message: 'Promotion deleted' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete promotion';
    res.status(500).json({ success: false, message });
  }
};

export const getPromotionSlabs = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const slabs = await PromotionSlabModel.findByPromotion(id);
    res.json({ success: true, message: 'Promotion slabs fetched', data: slabs });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch promotion slabs';
    res.status(500).json({ success: false, message });
  }
};