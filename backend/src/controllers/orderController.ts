import { Request, Response } from 'express';
import { OrderModel, OrderInput } from '../models/Order';
import { PromotionModel } from '../models/Promotion';
import { PromotionSlabModel } from '../models/PromotionSlab';

function computeDiscountForItem(item: { unit_price: number; quantity: number; unit_weight: number }, promotion: any): { line_subtotal: number; line_discount: number; line_total: number } {
  const line_subtotal = item.unit_price * item.quantity;
  let line_discount = 0;
  if (!promotion) return { line_subtotal, line_discount, line_total: line_subtotal };

  const type = promotion.discount_type as 'percentage' | 'fixed' | 'weighted' | undefined;
  if (type === 'percentage') {
    const rate = Number(promotion.percentage_rate);
    if (!Number.isNaN(rate) && rate > 0) {
      line_discount = (line_subtotal * rate) / 100;
    }
  } else if (type === 'fixed') {
    const amt = Number(promotion.fixed_amount);
    if (!Number.isNaN(amt) && amt > 0) {
      line_discount = amt * item.quantity;
    }
  }
  line_discount = Math.min(line_discount, line_subtotal);
  const line_total = Math.max(0, line_subtotal - line_discount);
  return { line_subtotal, line_discount, line_total };
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const payload = req.body as OrderInput;
    let promotion: any = null;
    if (payload.promotion_id) {
      const promos = await PromotionModel.findAllEnabled();
      const p = promos.find((x) => x.id === payload.promotion_id);
      if (p) {
        promotion = p;
        if (p.discount_type === 'weighted') {
          const slabs = await PromotionSlabModel.findByPromotion(p.id!);
          promotion = { ...p, slabs };
        }
      }
    }
    let computedItems: Array<{ line_subtotal: number; line_discount: number; line_total: number }> = [];
    const lineSubtotals = payload.items.map((it) => it.unit_price * it.quantity);
    const subtotal = lineSubtotals.reduce((sum, v) => sum + v, 0);

    if (promotion?.discount_type === 'weighted' && Array.isArray(promotion.slabs)) {
      const weights = payload.items.map((it) => it.unit_weight * it.quantity);
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      const slab = promotion.slabs.find((s: any) => totalWeight >= Number(s.min_weight) && totalWeight <= Number(s.max_weight));
      let orderDiscount = 0;
      if (slab) {
        const unitWeight = Number(slab.unit_weight);
        const unitDiscount = Number(slab.unit_discount);
        if (!Number.isNaN(unitWeight) && unitWeight > 0 && !Number.isNaN(unitDiscount) && unitDiscount > 0) {
          const discountUnits = Math.max(1, Math.floor(totalWeight / unitWeight));
          orderDiscount = unitDiscount * discountUnits;
        }
      }
      const allocations = weights.map((w) => (totalWeight > 0 ? (orderDiscount * (w / totalWeight)) : 0));
      computedItems = payload.items.map((it, idx) => {
        const line_subtotal = lineSubtotals[idx];
        const raw = allocations[idx];
        const line_discount = Math.min(raw, line_subtotal);
        const line_total = Math.max(0, line_subtotal - line_discount);
        return { line_subtotal, line_discount, line_total };
      });
    } else {
      computedItems = payload.items.map((it) => computeDiscountForItem(it, promotion));
    }

    const total_discount = Math.min(computedItems.reduce((sum, c) => sum + c.line_discount, 0), subtotal);
    const shipping = Math.max(0, payload.shipping_cost ?? 0);
    const grand_total = Math.max(0, subtotal - total_discount + shipping);
    const created = await OrderModel.create(payload, { subtotal, total_discount, grand_total, items: computedItems });
    res.status(201).json({ success: true, message: 'Order created', data: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    res.status(500).json({ success: false, message });
  }
};

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await OrderModel.findAll();
    res.json({ success: true, message: 'Orders fetched', data: orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    res.status(500).json({ success: false, message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const order = await OrderModel.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order fetched', data: order });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch order';
    res.status(500).json({ success: false, message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body as { status: 'Created' | 'Shipped' | 'Delivered' | 'Complete' };
    if (!['Created', 'Shipped', 'Delivered', 'Complete'].includes(String(status))) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const updated = await OrderModel.setStatus(id, status);
    if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order status updated', data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update order status';
    res.status(500).json({ success: false, message });
  }
};