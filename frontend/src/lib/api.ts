/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_verified: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

class ApiClient {
  private baseURL: string;
  private refreshPromise: Promise<TokenResponse> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private async refreshAccessToken(): Promise<TokenResponse> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data: ApiResponse<TokenResponse> = await response.json();
        const tokens = data.data!;
        this.setTokens(tokens.accessToken, tokens.refreshToken);
        return tokens;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = this.getAccessToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      let response = await fetch(url, config);

      // If unauthorized, try to refresh token
      if (response.status === 401 && this.getRefreshToken()) {
        try {
          const tokens = await this.refreshAccessToken();
          
          // Retry original request with new token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${tokens.accessToken}`,
          };
          response = await fetch(url, config);
        } catch (refreshError) {
          this.clearTokens();
          throw new Error('Session expired. Please login again.');
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response.data!;
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response.data!;
  }

  async getProfile(): Promise<User> {
    const response = await this.request<{ user: User }>('/api/auth/profile');
    return response.data!.user;
  }

  async updateProfile(updates: Partial<Pick<User, 'first_name' | 'last_name'>>): Promise<User> {
    const response = await this.request<{ user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data!.user;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        await this.request('/api/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Products API
  async getProducts(): Promise<Array<{ id: number; name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight?: number; weight_unit?: 'gm' | 'kg' }>> {
    const response = await this.request<Array<{ id: number; name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight?: number; weight_unit?: 'gm' | 'kg' }>>('/api/products');
    return response.data!;
  }
  async getEnabledProducts(): Promise<Array<{ id: number; name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight?: number; weight_unit?: 'gm' | 'kg' }>> {
    const response = await this.request<Array<{ id: number; name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight?: number; weight_unit?: 'gm' | 'kg' }>>('/api/products/enabled');
    return response.data!;
  }

  async createProduct(input: { name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight: number; weight_unit?: 'gm' | 'kg' }): Promise<{ id: number; name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight?: number; weight_unit?: 'gm' | 'kg' }> {
    const response = await this.request<{ id: number; name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight?: number; weight_unit?: 'gm' | 'kg' }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return response.data!;
  }

  async updateProduct(id: number, updates: Partial<{ name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight?: number; weight_unit?: 'gm' | 'kg' }>): Promise<{ id: number; name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight?: number; weight_unit?: 'gm' | 'kg' } | null> {
    const response = await this.request<{ id: number; name: string; description?: string; price: number; stock?: number; is_enabled?: boolean; image_url?: string; status?: string; weight?: number; weight_unit?: 'gm' | 'kg' } | null>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data!;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request<void>(`/api/products/${id}`, { method: 'DELETE' });
  }

  // Promotions API
  async getPromotions(): Promise<Array<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean; discount_type?: 'percentage' | 'fixed' | 'weighted'; percentage_rate?: number; fixed_amount?: number }>> {
    const response = await this.request<Array<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean; discount_type?: 'percentage' | 'fixed' | 'weighted'; percentage_rate?: number; fixed_amount?: number }>>('/api/promotions');
    return response.data!;
  }

  async getEnabledPromotions(): Promise<Array<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean; discount_type?: 'percentage' | 'fixed' | 'weighted'; percentage_rate?: number; fixed_amount?: number }>> {
    const response = await this.request<Array<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean; discount_type?: 'percentage' | 'fixed' | 'weighted'; percentage_rate?: number; fixed_amount?: number }>>('/api/promotions/enabled');
    return response.data!;
  }

  async createPromotion(input: { title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled?: boolean; discount_type?: 'percentage' | 'fixed' | 'weighted'; percentage_rate?: number; fixed_amount?: number }): Promise<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean; discount_type?: 'percentage' | 'fixed' | 'weighted'; percentage_rate?: number; fixed_amount?: number }> {
    const response = await this.request<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean; discount_type?: 'percentage' | 'fixed' | 'weighted'; percentage_rate?: number; fixed_amount?: number }>('/api/promotions', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return response.data!;
  }

  async updatePromotion(id: number, updates: { title?: string; start_date?: string; end_date?: string }): Promise<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean } | null> {
    const response = await this.request<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean } | null>(`/api/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data!;
  }

  async setPromotionEnabled(id: number, enabled: boolean): Promise<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean } | null> {
    const response = await this.request<{ id: number; title: string; description?: string; start_date: string; end_date: string; banner_url?: string; enabled: boolean } | null>(`/api/promotions/${id}/enabled`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    });
    return response.data!;
  }

  async deletePromotion(id: number): Promise<void> {
    await this.request<void>(`/api/promotions/${id}`, { method: 'DELETE' });
  }

  async getPromotionSlabs(id: number): Promise<Array<{ id: number; promotion_id: number; min_weight: number; max_weight: number; unit_weight: number; unit_discount: number }>> {
    const response = await this.request<Array<{ id: number; promotion_id: number; min_weight: number; max_weight: number; unit_weight: number; unit_discount: number }>>(`/api/promotions/${id}/slabs`);
    return response.data!;
  }

  // Orders API
  async getOrders(): Promise<Array<{ id: number; customer_name: string; subtotal: number; total_discount: number; grand_total: number; created_at: string }>> {
    const response = await this.request<Array<{ id: number; customer_name: string; subtotal: number; total_discount: number; grand_total: number; created_at: string }>>('/api/orders');
    return response.data!;
  }
  async getOrderById(id: number): Promise<{ order: any; items: any[] } | null> {
    const response = await this.request<{ order: any; items: any[] } | null>(`/api/orders/${id}`);
    return response.data!;
  }
  async updateOrderStatus(id: number, status: 'Created' | 'Shipped' | 'Delivered' | 'Complete'): Promise<any> {
    const response = await this.request<any>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.data!;
  }
  async createOrder(input: { customer_name: string; customer_address?: string; customer_phone?: string; notes?: string; promotion_id?: number; shipping_cost?: number; items: Array<{ product_id: number; name: string; unit_price: number; quantity: number; unit_weight: number }> }): Promise<{ order: any; items: any[] }> {
    const response = await this.request<{ order: any; items: any[] }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return response.data!;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
