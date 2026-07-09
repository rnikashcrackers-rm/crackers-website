import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

// Helper to load env vars from .env.local manually for node script execution
function getEnvVars() {
  const envVars = {};
  try {
    const envPath = path.resolve('.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let val = match[2] || '';
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1);
          } else if (val.startsWith("'") && val.endsWith("'")) {
            val = val.substring(1, val.length - 1);
          }
          envVars[key] = val.trim();
        }
      });
    }
  } catch (error) {
    console.warn('Could not read .env.local file:', error.message);
  }
  return envVars;
}

const envVars = getEnvVars();

// Check .env.local key, otherwise fallback to the hardcoded placeholder
const apiKey = envVars.RESEND_API_KEY || 're_xxxxxxxxx';

if (!apiKey || apiKey === 're_xxxxxxxxx') {
  console.error('Error: Resend API key is not configured.');
  console.error('Please configure RESEND_API_KEY in .env.local or replace "re_xxxxxxxxx" in the script.');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function sendTestEmail() {
  try {
    console.log('Sending email using Resend API...');
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'rnikashcrackers@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
    
    if (response.error) {
      console.error('Resend API returned an error:', response.error);
    } else {
      console.log('Email sent successfully!', response);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendTestEmail();
