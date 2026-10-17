const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'dist', 'server');
const imports = new Set();

function scan(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) scan(p);
    else if (f.name.endsWith('.mjs')) {
      const txt = fs.readFileSync(p, 'utf8');
      const matches = txt.matchAll(/(?:import|from)\s+['"]([^'".\/][^'"]*)['"]/g);
      for (const m of matches) imports.add(m[1]);
    }
  }
}

scan(dir);
console.log('Runtime packages:', Array.from(imports));
