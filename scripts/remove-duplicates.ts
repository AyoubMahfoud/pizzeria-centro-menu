import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeDuplicates() {
  console.log('🧹 Inizio pulizia duplicati...\n')

  // 1. Rimuovere piatti duplicati (mantenere solo il primo di ogni nome)
  console.log('📝 Rimozione piatti duplicati...')
  const dishes = await prisma.dish.findMany({
    orderBy: { createdAt: 'asc' }
  })

  const dishNamesSeen = new Set<string>()
  const dishesToDelete: string[] = []

  for (const dish of dishes) {
    const key = `${dish.name}-${dish.categoryId}`
    if (dishNamesSeen.has(key)) {
      dishesToDelete.push(dish.id)
    } else {
      dishNamesSeen.add(key)
    }
  }

  console.log(`   Trovati ${dishesToDelete.length} piatti duplicati`)
  if (dishesToDelete.length > 0) {
    // Prima elimina le relazioni
    await prisma.dishIngredient.deleteMany({
      where: { dishId: { in: dishesToDelete } }
    })
    // Poi elimina i piatti
    await prisma.dish.deleteMany({
      where: { id: { in: dishesToDelete } }
    })
    console.log(`   ✅ ${dishesToDelete.length} piatti duplicati rimossi`)
  }

  // 2. Rimuovere categorie duplicate
  console.log('\n📂 Rimozione categorie duplicate...')
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'asc' }
  })

  const categoryNamesSeen = new Set<string>()
  const categoriesToDelete: string[] = []

  for (const category of categories) {
    if (categoryNamesSeen.has(category.name)) {
      categoriesToDelete.push(category.id)
    } else {
      categoryNamesSeen.add(category.name)
    }
  }

  console.log(`   Trovate ${categoriesToDelete.length} categorie duplicate`)
  if (categoriesToDelete.length > 0) {
    // Sposta i piatti delle categorie duplicate alla categoria originale
    for (const categoryId of categoriesToDelete) {
      const category = categories.find(c => c.id === categoryId)
      if (category) {
        const originalCategory = categories.find(c => c.name === category.name && c.id !== categoryId)
        if (originalCategory) {
          await prisma.dish.updateMany({
            where: { categoryId },
            data: { categoryId: originalCategory.id }
          })
        }
      }
    }

    await prisma.category.deleteMany({
      where: { id: { in: categoriesToDelete } }
    })
    console.log(`   ✅ ${categoriesToDelete.length} categorie duplicate rimosse`)
  }

  // 3. Conteggio finale
  console.log('\n📊 Conteggio finale:')
  const finalDishes = await prisma.dish.count()
  const finalCategories = await prisma.category.count()
  const finalIngredients = await prisma.ingredient.count()

  console.log(`   🍽️  Piatti: ${finalDishes}`)
  console.log(`   📂 Categorie: ${finalCategories}`)
  console.log(`   🧾 Ingredienti: ${finalIngredients}`)

  console.log('\n✅ Pulizia completata!')
}

removeDuplicates()
  .catch((e) => {
    console.error('❌ Errore:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
