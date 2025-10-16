const fs = require('fs');
const path = require('path');

const apiRoutes = [
  'app/api/auth/login/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/auth/check/route.ts',
  'app/api/categories/route.ts',
  'app/api/categories/[id]/route.ts',
  'app/api/dishes/route.ts',
  'app/api/dishes/[id]/route.ts',
  'app/api/dishes/[id]/toggle-availability/route.ts',
  'app/api/ingredients/route.ts',
  'app/api/ingredients/[id]/route.ts',
];

const runtimeConfig = `export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

`;

apiRoutes.forEach(routePath => {
  const fullPath = path.join(process.cwd(), routePath);

  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Check if runtime config already exists
    if (!content.includes("export const runtime")) {
      // Find the first export function line
      const lines = content.split('\n');
      let insertIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('export async function') || lines[i].includes('export function')) {
          insertIndex = i;
          break;
        }
      }

      if (insertIndex !== -1) {
        lines.splice(insertIndex, 0, runtimeConfig);
        content = lines.join('\n');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Fixed: ${routePath}`);
      }
    } else {
      console.log(`⏭️  Skipped (already has runtime config): ${routePath}`);
    }
  } else {
    console.log(`❌ Not found: ${routePath}`);
  }
});

console.log('\n✅ All API routes fixed!');
