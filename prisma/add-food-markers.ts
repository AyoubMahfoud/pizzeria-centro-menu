import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📝 Aggiungendo marker c/f ai piatti...\n')

  // Prendi tutti i piatti
  const dishes = await prisma.dish.findMany()

  let updated = 0

  for (const dish of dishes) {
    let allergens: string[] = []

    try {
      allergens = dish.allergens ? JSON.parse(dish.allergens) : []
    } catch (e) {
      allergens = []
    }

    // Se non ha già 'c' o 'f', aggiungi 'f' (fresco) come default
    if (!allergens.includes('c') && !allergens.includes('f')) {
      allergens.push('f')

      await prisma.dish.update({
        where: { id: dish.id },
        data: { allergens: JSON.stringify(allergens) }
      })

      updated++
      console.log(`✅ ${dish.name} → aggiunto 'f'`)
    }
  }

  console.log(`\n✨ Completato! ${updated} piatti aggiornati con marker 'f'`)
  console.log('\n💡 Suggerimento: Usa Prisma Studio per cambiare da "f" a "c" i piatti surgelati')
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
