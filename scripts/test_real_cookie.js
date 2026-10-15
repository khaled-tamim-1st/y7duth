async function run() {
  const loginRes = await fetch('http://[::1]:4321/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'kuwait@admin2026' })
  });
  const cookie = loginRes.headers.get('set-cookie');
  console.log('Login status:', loginRes.status);
  
  const pageRes = await fetch('http://[::1]:4321/dashboard/articles', {
    headers: { 'Cookie': cookie }
  });
  const html = await pageRes.text();
  console.log('Dashboard HTML length:', html.length);
  const rows = (html.match(/class="article-row/g) || []).length;
  console.log('Article rows in HTML:', rows);
  console.log('Includes gates:', html.includes('بوابات سور الكويت القديم'));
  console.log('Includes scheduled:', html.includes('مجدول'));
}
run();
