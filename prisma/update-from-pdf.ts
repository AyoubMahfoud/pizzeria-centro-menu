import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping basato sui PDF forniti
// 'c' = congelato/surgelato (frozen)
// 'f' = fresco (fresh)

const dishMarkers: { [key: string]: 'c' | 'f' } = {
  // Pizze (dalla "Menù pizze A3 colori.pdf")
  'Margherita': 'f',
  'Marinara': 'f',
  'Napoli': 'c', // acciughe
  'Capricciosa': 'c', // prosciutto cotto
  'Quattro Stagioni': 'c',
  'Diavola': 'f',
  'Prosciutto e Funghi': 'c',
  'Funghi': 'f',
  'Salsiccia': 'f',
  'Salame Piccante': 'f',
  'Tonno e Cipolla': 'c',
  'Boscaiola': 'f',
  'Patate e Salsiccia': 'f',
  'Wurstel': 'c',
  'Quattro Formaggi': 'f',
  'Calzone': 'c',
  'Vegetariana': 'f',
  'Frutti di Mare': 'c',
  'Ortolana': 'f',
  'Americana': 'c', // wurstel e patatine
  'Tirolese': 'c', // speck
  'Contadina': 'f',
  'Gorgonzola e Speck': 'c',
  'Bufalina': 'f',
  'Parmigiana': 'f',
  'Porcini': 'f',
  'Scoglio': 'c',
  'Salmone': 'c',
  'Gamberetti': 'c',
  'Bresaola': 'f',
  'Crudo': 'f',
  'Carbonara': 'f',
  'Pistacchio': 'f',

  // Menu Ristorante (dalla "Menu 2025 Ristorante alfo.pdf")
  // Antipasti
  'Bruschetta': 'f',
  'Caprese': 'f',
  'Prosciutto e Melone': 'c',
  'Antipasto Misto': 'c',
  'Carpaccio di Bresaola': 'f',
  'Salumi Misti': 'c',
  'Formaggi Misti': 'f',

  // Primi
  'Spaghetti Carbonara': 'f',
  'Penne Arrabbiata': 'f',
  'Rigatoni Amatriciana': 'f',
  'Tagliatelle al Ragù': 'f',
  'Lasagne': 'f',
  'Gnocchi': 'c',
  'Risotto': 'f',
  'Pasta al Pesto': 'f',
  'Spaghetti allo Scoglio': 'c',
  'Linguine ai Frutti di Mare': 'c',
  'Penne Salmone e Panna': 'c',

  // Secondi di Carne
  'Tagliata di Manzo': 'f',
  'Bistecca': 'f',
  'Scaloppine': 'f',
  'Cotoletta': 'f',
  'Pollo alla Griglia': 'f',
  'Salsiccia': 'f',
  'Arrosto': 'f',

  // Secondi di Pesce
  'Branzino': 'c',
  'Orata': 'c',
  'Salmone alla Griglia': 'c',
  'Fritto Misto': 'c',
  'Calamari': 'c',
  'Gamberoni': 'c',

  // Contorni
  'Insalata': 'f',
  'Patate al Forno': 'f',
  'Patate Fritte': 'c',
  'Verdure Grigliate': 'f',
  'Spinaci': 'c',
  'Funghi Trifolati': 'f',

  // Dolci
  'Tiramisù': 'f',
  'Panna Cotta': 'f',
  'Gelato': 'c',
  'Torta': 'c',
  'Cheesecake': 'c',
}

async function main() {
  console.log('📝 Aggiornando marker c/f in base ai PDF forniti...\n')

  const dishes = await prisma.dish.findMany()

  let updated = 0
  let notFound = 0
  let skipped = 0

  for (const dish of dishes) {
    // Cerca il marker corrispondente
    const marker = dishMarkers[dish.name]

    if (!marker) {
      console.log(`⚠️  "${dish.name}" - non trovato nei PDF, mantengo 'f'`)
      notFound++
      continue
    }

    let allergens: string[] = []
    try {
      allergens = dish.allergens ? JSON.parse(dish.allergens) : []
    } catch (e) {
      allergens = []
    }

    // Rimuovi vecchi marker c/f
    allergens = allergens.filter((a: string) => a !== 'c' && a !== 'f')

    // Aggiungi il marker corretto
    allergens.push(marker)

    await prisma.dish.update({
      where: { id: dish.id },
      data: { allergens: JSON.stringify(allergens) }
    })

    updated++
    console.log(`✅ ${dish.name} → '${marker}'`)
  }

  console.log(`\n✨ Completato!`)
  console.log(`   ${updated} piatti aggiornati`)
  console.log(`   ${notFound} piatti non trovati nei PDF (mantenuti con 'f')`)
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
