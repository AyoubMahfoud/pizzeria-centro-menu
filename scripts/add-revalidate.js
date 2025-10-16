const fs = require('fs');
const path = require('path');

const apiRoutes = [
  'app/api/auth/login/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/auth/check/route.ts',
  'app/api/categories/route.ts',
  'app/api/categories/[id]/route.ts',
  'app/api/dishes/[id]/route.ts',
  'app/api/dishes/[id]/toggle-availability/route.ts',
  'app/api/ingredients/route.ts',
  'app/api/ingredients/[id]/route.ts',
  'app/api/ingredients/[id]/toggle-availability/route.ts',
];

apiRoutes.forEach(routePath => {
  const fullPath = path.join(process.cwd(), routePath);

  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    if (!content.includes('export const revalidate')) {
      // Aggiungi revalidate dopo dynamic
      content = content.replace(
        "export const dynamic = 'force-dynamic'",
        "export const dynamic = 'force-dynamic'\nexport const revalidate = 0"
      );

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Added revalidate to: ${routePath}`);
    } else {
      console.log(`⏭️  Already has revalidate: ${routePath}`);
    }
  }
});

console.log('\n✅ All routes updated!');
