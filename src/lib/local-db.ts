import fs from 'fs';
import path from 'path';
import { products as staticProducts } from './data/products';

const productsFilePath = path.join(process.cwd(), 'src/lib/data/products.json');
const settingsFilePath = path.join(process.cwd(), 'src/lib/data/settings.json');
const bankAccountsFilePath = path.join(process.cwd(), 'src/lib/data/bank_accounts.json');

export function getLocalProducts(): any[] {
  try {
    if (fs.existsSync(productsFilePath)) {
      const content = fs.readFileSync(productsFilePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading local products:', e);
  }
  return staticProducts;
}

export function saveLocalProducts(products: any[]) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving local products:', e);
  }
}

export function getLocalSettings(defaultSettings: any): any {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const content = fs.readFileSync(settingsFilePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading local settings:', e);
  }
  return defaultSettings;
}

export function saveLocalSettings(settings: any) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving local settings:', e);
  }
}

export function getLocalBankAccounts(defaultAccounts: any[]): any[] {
  try {
    if (fs.existsSync(bankAccountsFilePath)) {
      const content = fs.readFileSync(bankAccountsFilePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading local bank accounts:', e);
  }
  return defaultAccounts;
}

export function saveLocalBankAccounts(accounts: any[]) {
  try {
    fs.writeFileSync(bankAccountsFilePath, JSON.stringify(accounts, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving local bank accounts:', e);
  }
}
