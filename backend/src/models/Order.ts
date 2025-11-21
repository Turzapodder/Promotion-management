import pool from '../config/database';

export interface OrderItemInput {
  product_id: number;
  name: string;
  unit_price: number;
  quantity: number;
  unit_weight: number; // grams
}

export interface OrderInput {
  customer_name: string;
  customer_address?: string;
  customer_phone?: string;
  notes?: string;
  promotion_id?: number; // optional, apply selected promotion
  shipping_cost?: number;
  items: OrderItemInput[];
}

export interface Order extends OrderInput {
  id: number;
  subtotal: number;
  total_discount: number;
  grand_total: number;
  created_at: Date;
  status?: string;
}

export interface OrderItem extends OrderItemInput {
  id: number;
  order_id: number;
  line_subtotal: number;
  line_discount: number;
  line_total: number;
}

export const OrderModel = {
  async create(order: OrderInput, computed: { subtotal: number; total_discount: number; grand_total: number; items: Array<{ line_subtotal: number; line_discount: number; line_total: number }> }): Promise<{ order: Order; items: OrderItem[] }> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const r = await client.query(
        `INSERT INTO orders (customer_name, customer_address, customer_phone, notes, promotion_id, shipping_cost, subtotal, total_discount, grand_total)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         RETURNING *`,
        [order.customer_name, order.customer_address ?? null, order.customer_phone ?? null, order.notes ?? null, order.promotion_id ?? null, order.shipping_cost ?? 0, computed.subtotal, computed.total_discount, computed.grand_total]
      );
      const created = r.rows[0];
      const itemsOut: OrderItem[] = [];
      for (let i = 0; i < order.items.length; i++) {
        const it = order.items[i];
        const c = computed.items[i];
        const ri = await client.query(
          `INSERT INTO order_items (order_id, product_id, name, unit_price, quantity, unit_weight, line_subtotal, line_discount, line_total)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           RETURNING *`,
          [created.id, it.product_id, it.name, it.unit_price, it.quantity, it.unit_weight, c.line_subtotal, c.line_discount, c.line_total]
        );
        itemsOut.push(ri.rows[0]);
      }
      await client.query('COMMIT');
      return { order: created, items: itemsOut };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
  async findAll(): Promise<Order[]> {
    const r = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    return r.rows;
  },
  async findById(id: number): Promise<{ order: Order; items: OrderItem[] } | null> {
    const ro = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (ro.rowCount === 0) return null;
    const ri = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    return { order: ro.rows[0], items: ri.rows };
  },
  async setStatus(id: number, status: 'Created' | 'Shipped' | 'Delivered' | 'Complete'): Promise<Order | null> {
    const r = await pool.query('UPDATE orders SET status = $2 WHERE id = $1 RETURNING *', [id, status]);
    if (r.rowCount === 0) return null;
    return r.rows[0];
  },
};