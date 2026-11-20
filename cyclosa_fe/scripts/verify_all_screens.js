const fs = require('fs');
const path = require('path');

const mdContent = fs.readFileSync(path.join(__dirname, '../../ba/page-list.md'), 'utf8');
const lines = mdContent.split('\n');

const screens = [];
for (const line of lines) {
  const parts = line.split('|').map(p => p.trim());
  if (parts.length >= 7 && /^[A-Z]+-\d+[a-z]?$/.test(parts[1])) {
    const id = parts[1];
    let rawRoute = parts[2].replace(/`/g, '');
    const titleAndType = parts[3].replace(/`/g, '');
    screens.push({ id, rawRoute, titleAndType });
  }
}

console.log('Total screens defined in page-list.md:', screens.length);

let passed = 0;
let missingList = [];

for (const s of screens) {
  const matches = [...s.rawRoute.matchAll(/(\/[a-zA-Z0-9_\-\:\/]+)/g)].map(m => m[1].replace(/\/+$/, ''));
  const subRoutes = matches.length > 0 ? matches : [s.rawRoute];
  
  let screenFound = false;
  for (const r of subRoutes) {
    let cleanRoute = r.split('?')[0].trim().replace(/^\//, '');
    let appPath = cleanRoute.replace(/:([a-zA-Z0-9_]+)/g, '[$1]');
    
    const candidates = [
      path.join(process.cwd(), 'src/app', appPath, 'page.tsx'),
      path.join(process.cwd(), 'src/app/(dashboard)', appPath, 'page.tsx'),
      path.join(process.cwd(), 'src/app/(auth)', appPath, 'page.tsx')
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) {
        screenFound = true;
        break;
      }
    }
    if (screenFound) break;
  }

  if (screenFound) {
    passed++;
  } else {
    missingList.push(s);
  }
}

console.log('RESULT: ' + passed + ' / ' + screens.length + ' screens covered (' + ((passed / screens.length) * 100).toFixed(1) + '%)');
if (missingList.length > 0) {
  console.log('Missing screens:', JSON.stringify(missingList, null, 2));
}
