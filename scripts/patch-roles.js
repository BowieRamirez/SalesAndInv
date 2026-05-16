const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}
const files = walk('apps/admin/app/api');
let changed = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/!\[\s*"SALES"\s*,\s*"ADMIN_MANAGEMENT"\s*\]\.includes\(currentUser\.role\)/g, '!["SALES", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)');
  content = content.replace(/!\[\s*"OPERATIONS_DESIGN"\s*,\s*"ADMIN_MANAGEMENT"\s*\]\.includes\(currentUser\.role\)/g, '!["OPERATIONS_DESIGN", "ADMIN_MANAGEMENT", "CUSTOM"].includes(currentUser.role)');
  if (content !== original) {
    fs.writeFileSync(file, content);
    changed++;
    console.log('Patched: ' + file);
  }
});
console.log('Total changed: ' + changed);
