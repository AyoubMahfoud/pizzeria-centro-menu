import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeRecentDishes() {
  console.log('🧹 Rimozione piatti aggiunti nella seconda esecuzione...\n')

  // Prendi tutti i piatti ordinati per data creazione
  const allDishes = await prisma.dish.findMany({
    orderBy: { createdAt: 'asc' }
  })

  console.log(`📊 Totale piatti attuali: ${allDishes.length}`)

  // Assumiamo che i primi 165 piatti siano corretti
  // e gli ultimi 163 siano duplicati della seconda esecuzione
  const targetCount = 165

  if (allDishes.length <= targetCount) {
    console.log('✅ Numero di piatti già corretto!')
    return
  }

  // Prendi gli ultimi piatti da rimuovere
  const dishesToKeep = allDishes.slice(0, targetCount)
  const dishesToRemove = allDishes.slice(targetCount)

  console.log(`✅ Piatti da mantenere: ${dishesToKeep.length}`)
  console.log(`❌ Piatti da rimuovere: ${dishesToRemove.length}`)

  const dishIdsToRemove = dishesToRemove.map(d => d.id)

  // Prima rimuovi le relazioni piatto-ingrediente
  console.log('\n🔗 Rimozione relazioni piatto-ingrediente...')
  const deletedRelations = await prisma.dishIngredient.deleteMany({
    where: { dishId: { in: dishIdsToRemove } }
  })
  console.log(`   ✅ ${deletedRelations.count} relazioni rimosse`)

  // Poi rimuovi i piatti
  console.log('\n🍽️  Rimozione piatti...')
  const deletedDishes = await prisma.dish.deleteMany({
    where: { id: { in: dishIdsToRemove } }
  })
  console.log(`   ✅ ${deletedDishes.count} piatti rimossi`)

  // Conteggio finale
  console.log('\n📊 Conteggio finale:')
  const finalDishes = await prisma.dish.count()
  const finalCategories = await prisma.category.count()
  const finalIngredients = await prisma.ingredient.count()

  console.log(`   🍽️  Piatti: ${finalDishes}`)
  console.log(`   📂 Categorie: ${finalCategories}`)
  console.log(`   🧾 Ingredienti: ${finalIngredients}`)

  console.log('\n✅ Database ripristinato ai valori originali!')
}

removeRecentDishes()
  .catch((e) => {
    console.error('❌ Errore:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
