import { PrismaClient } from '@prisma/client'
import { handleDishOrder, handleCategoryOrder } from './lib/orderUtils'

const prisma = new PrismaClient()

async function testCategoryOrdering() {
  console.log('\n=== TEST CATEGORY ORDERING ===\n')

  // Test 1: Creare categoria senza order (dovrebbe andare alla fine)
  console.log('Test 1: Categoria senza order specificato')
  const order1 = await handleCategoryOrder(undefined)
  console.log(`Order assegnato: ${order1}`)

  // Test 2: Creare categoria con order = 5
  console.log('\nTest 2: Categoria con order = 5')
  const order2 = await handleCategoryOrder(5)
  console.log(`Order assegnato: ${order2}`)

  // Test 3: Creare un'altra categoria con order = 5 (dovrebbe spostare la precedente a 6)
  console.log('\nTest 3: Altra categoria con order = 5 (conflitto)')
  const order3 = await handleCategoryOrder(5)
  console.log(`Order assegnato: ${order3}`)

  // Verifica finale
  console.log('\nStato finale delle categorie:')
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    select: { name: true, order: true }
  })
  categories.forEach(cat => {
    console.log(`  - ${cat.name}: order ${cat.order}`)
  })
}

async function testDishOrdering() {
  console.log('\n=== TEST DISH ORDERING ===\n')

  // Prendi la prima categoria
  const category = await prisma.category.findFirst()

  if (!category) {
    console.log('Nessuna categoria trovata, skip test piatti')
    return
  }

  console.log(`Testando con categoria: ${category.name} (${category.id})\n`)

  // Test 1: Piatto senza order (dovrebbe andare alla fine della categoria)
  console.log('Test 1: Piatto senza order specificato')
  const order1 = await handleDishOrder(category.id, undefined)
  console.log(`Order assegnato: ${order1}`)

  // Test 2: Piatto con order = 3
  console.log('\nTest 2: Piatto con order = 3')
  const order2 = await handleDishOrder(category.id, 3)
  console.log(`Order assegnato: ${order2}`)

  // Test 3: Altro piatto con order = 3 (dovrebbe spostare il precedente a 4)
  console.log('\nTest 3: Altro piatto con order = 3 (conflitto)')
  const order3 = await handleDishOrder(category.id, 3)
  console.log(`Order assegnato: ${order3}`)

  // Verifica finale
  console.log(`\nStato finale dei piatti nella categoria ${category.name}:`)
  const dishes = await prisma.dish.findMany({
    where: { categoryId: category.id },
    orderBy: { order: 'asc' },
    select: { name: true, order: true }
  })
  dishes.forEach(dish => {
    console.log(`  - ${dish.name}: order ${dish.order}`)
  })
}

async function main() {
  try {
    await testCategoryOrdering()
    await testDishOrdering()

    console.log('\n✓ Tutti i test completati!')
  } catch (error) {
    console.error('Errore durante i test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
