import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validateOrderCreate } from '../middlewares/validateOrder';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController';

const router = Router();

router.post('/', authenticate, validateOrderCreate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, updateOrderStatus);

export default router;