import { createClient } from '@supabase/supabase-js';

const DEFAULT_SETTINGS = {
  global_discount: '80',
  min_order_value: '2000',
  company_name: 'Nikash Crackers',
  company_address: 'Nikash Crackers, Sivakasi, Tamil Nadu - 626123.',
  mobile_number_1: '7867955841',
  mobile_number_2: '7867955841',
  whatsapp_number: '7867955841',
  email_address: 'rnikashcrackers@gmail.com',
  marquee: 'Welcome to Nikash Crackers Sivakasi - Direct Factory Price Quality Fireworks! We Give Special Festive Discounts! Buy More Save More!',
  whatsapp_provider: 'whatsapp_business',
  whatsapp_business_phone_number_id: '',
  whatsapp_business_access_token: '',
  whatsapp_ultramsg_instance_id: '',
  whatsapp_ultramsg_token: '',
  whatsapp_template_name: 'order_status_update',
  whatsapp_msg_pending: 'Hello {{customer_name}}, your order {{order_number}} is received and is pending verification. We will contact you shortly to confirm!',
  whatsapp_msg_confirmed: 'Hello {{customer_name}}, your order {{order_number}} is confirmed! We are packaging your crackers now.',
  whatsapp_msg_processing: 'Hello {{customer_name}}, your order {{order_number}} is being processed at our Sivakasi factory.',
  whatsapp_msg_shipped: 'Hello {{customer_name}}, your order {{order_number}} has been shipped! Transport tracking details: {{tracking_info}}',
  whatsapp_msg_delivered: 'Hello {{customer_name}}, your order {{order_number}} has been successfully delivered. Happy and safe celebrating! 🎆',
  whatsapp_msg_cancelled: 'Hello {{customer_name}}, your order {{order_number}} has been cancelled. Please contact support if you have questions.',
};

export async function getSiteSettings() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
    const { getLocalSettings } = await import('./local-db');
    return getLocalSettings(DEFAULT_SETTINGS);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Fetch settings directly from site_settings table
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) throw error;

    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
    if (data) {
      data.forEach((row: { key: string; value: string }) => {
        settings[row.key] = row.value;
      });
    }
    return settings;
  } catch {
    // Silently return defaults when Supabase is unreachable or table doesn't exist
    return DEFAULT_SETTINGS;
  }
}
