const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('../ba/page-list.md', 'utf8');
const lines = content.split('\n');
const screens = [];

for (const line of lines) {
  const parts = line.split('|').map(p => p.trim());
  if (parts.length >= 7 && /^[A-Z]+-\d+[a-z]?$/.test(parts[1])) {
    const id = parts[1];
    const rawRoute = parts[2].replace(/`/g, '');
    const titleAndType = parts[3];
    const desc = parts[4];
    const api = parts[5].replace(/`/g, '');
    const permission = parts[6].replace(/`/g, '');
    screens.push({ id, rawRoute, titleAndType, desc, api, permission });
  }
}

let existing = 0;
let missing = 0;
const missingScreens = [];
const existingScreens = [];

screens.forEach(s => {
  const routes = s.rawRoute.split(',').map(r => r.trim());
  let found = false;
  let matchedPath = '';
  for (const r of routes) {
    let cleanRoute = r.split('?')[0].trim();
    cleanRoute = cleanRoute.replace(/^\//, '');
    let appPath = cleanRoute.replace(/:([a-zA-Z0-9_]+)/g, '[$1]');
    
    const candidates = [
      path.join(process.cwd(), 'src/app', appPath, 'page.tsx'),
      path.join(process.cwd(), 'src/app/(dashboard)', appPath, 'page.tsx'),
      path.join(process.cwd(), 'src/app/(auth)', appPath, 'page.tsx')
    ];
    
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        found = true;
        matchedPath = c;
        break;
      }
    }
  }
  if (found) {
    existing++;
    existingScreens.push({ id: s.id, route: s.rawRoute, path: matchedPath });
  } else {
    missing++;
    missingScreens.push(s);
  }
});

console.log('Total extracted screens from page-list.md:', screens.length);
console.log('Existing screens matched:', existing);
console.log('Missing screens to create:', missing);
fs.writeFileSync('missing_screens.json', JSON.stringify(missingScreens, null, 2));
fs.writeFileSync('all_screens.json', JSON.stringify(screens, null, 2));
