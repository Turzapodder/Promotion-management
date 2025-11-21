import pool from '../config/database';

export interface PromotionSlab {
  id?: number;
  promotion_id: number;
  min_weight: number; // in grams
  max_weight: number; // in grams
  unit_weight: number; // base unit in grams for discount
  unit_discount: number; // discount amount per unit_weight
}

export const PromotionSlabModel = {
  async createMany(promotion_id: number, slabs: Omit<PromotionSlab, 'id' | 'promotion_id'>[]): Promise<PromotionSlab[]> {
    const results: PromotionSlab[] = [];
    for (const s of slabs) {
      const r = await pool.query(
        `INSERT INTO promotion_slabs (promotion_id, min_weight, max_weight, unit_weight, unit_discount)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [promotion_id, s.min_weight, s.max_weight, s.unit_weight, s.unit_discount]
      );
      results.push(r.rows[0]);
    }
    return results;
  },
  async findByPromotion(promotion_id: number): Promise<PromotionSlab[]> {
    const r = await pool.query('SELECT * FROM promotion_slabs WHERE promotion_id = $1 ORDER BY min_weight ASC', [promotion_id]);
    return r.rows;
  },
};