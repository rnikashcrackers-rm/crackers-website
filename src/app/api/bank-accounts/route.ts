import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const DEFAULT_ACCOUNTS = [
  {
    id: 'boi-default',
    bank_name: 'Bank of India',
    branch: 'Salvarpatti',
    holder_name: 'M. Raja Pandian',
    account_number: '815710510003669',
    ifsc_code: 'BKID0008157',
    gpay_number: '7867955841',
    phonepe_number: '7867955841',
    created_at: new Date('2026-01-01').toISOString()
  }
];

// GET — List bank accounts
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      const { getLocalBankAccounts } = await import('@/lib/local-db');
      return NextResponse.json(getLocalBankAccounts(DEFAULT_ACCOUNTS));
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data && data.length > 0 ? data : DEFAULT_ACCOUNTS);
  } catch (error: any) {
    console.error('Error getting bank accounts:', error);
    return NextResponse.json(DEFAULT_ACCOUNTS);
  }
}

// POST — Add new bank account
export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const body = await req.json();

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      const { getLocalBankAccounts, saveLocalBankAccounts } = await import('@/lib/local-db');
      const accounts = getLocalBankAccounts(DEFAULT_ACCOUNTS);
      const newAccount = {
        id: Date.now().toString(),
        bank_name: body.bank_name,
        branch: body.branch,
        holder_name: body.holder_name,
        account_number: body.account_number,
        ifsc_code: body.ifsc_code,
        gpay_number: body.gpay_number || null,
        phonepe_number: body.phonepe_number || null,
        created_at: new Date().toISOString()
      };
      accounts.push(newAccount);
      saveLocalBankAccounts(accounts);
      return NextResponse.json(newAccount, { status: 201 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('bank_accounts')
      .insert({
        bank_name: body.bank_name,
        branch: body.branch,
        holder_name: body.holder_name,
        account_number: body.account_number,
        ifsc_code: body.ifsc_code,
        gpay_number: body.gpay_number || null,
        phonepe_number: body.phonepe_number || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating bank account:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — Update existing bank account
export async function PUT(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing account ID' }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      const { getLocalBankAccounts, saveLocalBankAccounts } = await import('@/lib/local-db');
      const accounts = getLocalBankAccounts(DEFAULT_ACCOUNTS);
      const idx = accounts.findIndex(a => String(a.id) === String(id));
      if (idx === -1) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }
      const updated = {
        ...accounts[idx],
        bank_name: updateData.bank_name,
        branch: updateData.branch,
        holder_name: updateData.holder_name,
        account_number: updateData.account_number,
        ifsc_code: updateData.ifsc_code,
        gpay_number: updateData.gpay_number || null,
        phonepe_number: updateData.phonepe_number || null,
      };
      accounts[idx] = updated;
      saveLocalBankAccounts(accounts);
      return NextResponse.json(updated);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('bank_accounts')
      .update({
        bank_name: updateData.bank_name,
        branch: updateData.branch,
        holder_name: updateData.holder_name,
        account_number: updateData.account_number,
        ifsc_code: updateData.ifsc_code,
        gpay_number: updateData.gpay_number || null,
        phonepe_number: updateData.phonepe_number || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating bank account:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — Delete bank account
export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing account ID' }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
      const { getLocalBankAccounts, saveLocalBankAccounts } = await import('@/lib/local-db');
      const accounts = getLocalBankAccounts(DEFAULT_ACCOUNTS);
      const filtered = accounts.filter(a => String(a.id) !== String(id));
      saveLocalBankAccounts(filtered);
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('bank_accounts').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting bank account:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
