import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'kuwait-happening-secret-admin-session-key-2026';
const session = { username: 'admin', name: 'المشرف العام', role: 'admin', loggedInAt: Date.now() };
const payload = Buffer.from(JSON.stringify(session)).toString('base64');
const signature = Buffer.from(payload + ':' + SECRET_KEY).toString('base64');
const token = payload + '.' + signature;

async function check() {
  try {
    const res = await fetch('http://[::1]:4321/dashboard/articles', {
      headers: { 'Cookie': 'kuwait_admin_session=' + token }
    });
    const html = await res.text();
    console.log('Response status:', res.status);
    console.log('HTML length:', html.length);
    const rowMatches = html.match(/class="article-row/g) || [];
    console.log('Number of article rows found in HTML:', rowMatches.length);
    console.log('Includes gates article?', html.includes('بوابات سور الكويت القديم'));
    console.log('Includes scheduled status text?', html.includes('مجدول'));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

check();
