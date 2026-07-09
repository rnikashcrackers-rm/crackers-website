export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name_en: string;
          name_ta: string;
          slug: string;
          category: string;
          price: number;
          mrp: number;
          discount_percent: number | null;
          badge_text: string | null;
          image_url: string | null;
          images: Json;
          description_en: string | null;
          description_ta: string | null;
          in_stock: boolean;
          is_featured: boolean;
          is_eco_friendly: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_en: string;
          name_ta: string;
          slug: string;
          category: string;
          price: number;
          mrp: number;
          discount_percent?: number | null;
          badge_text?: string | null;
          image_url?: string | null;
          images?: Json;
          description_en?: string | null;
          description_ta?: string | null;
          in_stock?: boolean;
          is_featured?: boolean;
          is_eco_friendly?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_en?: string;
          name_ta?: string;
          slug?: string;
          category?: string;
          price?: number;
          mrp?: number;
          discount_percent?: number | null;
          badge_text?: string | null;
          image_url?: string | null;
          images?: Json;
          description_en?: string | null;
          description_ta?: string | null;
          in_stock?: boolean;
          is_featured?: boolean;
          is_eco_friendly?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      combo_packs: {
        Row: {
          id: string;
          combo_name: string;
          total_items: number;
          original_price: number;
          offer_price: number;
          combo_type: string;
          description: string | null;
          image_url: string | null;
          products: Json;
          featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          combo_name: string;
          total_items: number;
          original_price: number;
          offer_price: number;
          combo_type: string;
          description?: string | null;
          image_url?: string | null;
          products?: Json;
          featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          combo_name?: string;
          total_items?: number;
          original_price?: number;
          offer_price?: number;
          combo_type?: string;
          description?: string | null;
          image_url?: string | null;
          products?: Json;
          featured?: boolean;
          created_at?: string;
        };
      };
      enquiries: {
        Row: {
          id: string;
          customer_name: string | null;
          customer_phone: string;
          customer_city: string | null;
          items: Json;
          total_amount: number | null;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name?: string | null;
          customer_phone: string;
          customer_city?: string | null;
          items: Json;
          total_amount?: number | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string | null;
          customer_phone?: string;
          customer_city?: string | null;
          items?: Json;
          total_amount?: number | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_address: string | null;
          customer_city: string | null;
          customer_pincode: string | null;
          items: Json;
          subtotal: number;
          discount_total: number;
          total_amount: number;
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_method: string;
          payment_status: 'pending' | 'paid' | 'refunded';
          notes: string | null;
          confirmed_at: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          customer_address?: string | null;
          customer_city?: string | null;
          customer_pincode?: string | null;
          items: Json;
          subtotal: number;
          discount_total: number;
          total_amount: number;
          status?: string;
          payment_method?: string;
          payment_status?: string;
          notes?: string | null;
          confirmed_at?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          customer_address?: string | null;
          customer_city?: string | null;
          customer_pincode?: string | null;
          items?: Json;
          subtotal?: number;
          discount_total?: number;
          total_amount?: number;
          status?: string;
          payment_method?: string;
          payment_status?: string;
          notes?: string | null;
          confirmed_at?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          subscribed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          subscribed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          subscribed?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type ComboPack = Database['public']['Tables']['combo_packs']['Row'];
export type Enquiry = Database['public']['Tables']['enquiries']['Row'];
export type EnquiryInsert = Database['public']['Tables']['enquiries']['Insert'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];
export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row'];
