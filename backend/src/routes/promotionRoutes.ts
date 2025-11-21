import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validatePromotionCreate, validatePromotionUpdate } from '../middlewares/validatePromotion';
import { createPromotion, getPromotions, getEnabledPromotions, updatePromotion, setPromotionEnabled, deletePromotion, getPromotionSlabs } from '../controllers/promotionController';

const router = Router();

router.post('/', authenticate, validatePromotionCreate, createPromotion);
router.get('/', authenticate, getPromotions);
router.get('/enabled', authenticate, getEnabledPromotions);
router.put('/:id', authenticate, validatePromotionUpdate, updatePromotion);
router.patch('/:id/enabled', authenticate, setPromotionEnabled);
router.delete('/:id', authenticate, deletePromotion);
router.get('/:id/slabs', authenticate, getPromotionSlabs);

export default router;