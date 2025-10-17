import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mappa degli allergeni per ingrediente
const allergenMap: Record<string, string[]> = {
  // Latticini
  'mozzarella': ['1', '7'],
  'mozzarella di bufala': ['1', '7'],
  'bufala': ['1', '7'],
  'fior di latte': ['1', '7'],
  'scamorza': ['1', '7'],
  'scamorza affumicata': ['1', '7'],
  'provola': ['1', '7'],
  'gorgonzola': ['1', '7'],
  'fontina': ['1', '7'],
  'taleggio': ['1', '7'],
  'grana': ['1', '7'],
  'parmigiano': ['1', '7'],
  'pecorino': ['1', '7'],
  'ricotta': ['1', '7'],

  // Glutine (tutti gli impasti)
  'impasto': ['1'],
  'pizza': ['1'],
  'focaccia': ['1'],
  'calzone': ['1'],

  // Uova
  'uovo': ['3'],
  'uova': ['3'],
  'pancetta': ['3'], // spesso contiene uova nella lavorazione

  // Pesce e crostacei
  'acciughe': ['4'],
  'tonno': ['4'],
  'salmone': ['4'],
  'gamberetti': ['2', '4'],
  'gamberi': ['2', '4'],
  'gamberoni': ['2', '4'],
  'calamari': ['4', '14'],
  'cozze': ['4', '14'],
  'vongole': ['4', '14'],
  'polpo': ['4', '14'],
  'frutti di mare': ['2', '4', '14'],

  // Frutta a guscio
  'noci': ['8'],

  // Sedano
  'sedano': ['9'],

  // Senape (in alcuni salumi)
  'wurstel': ['1', '3', '10', '12'],
  'salsiccia': ['12'],
  'salame': ['12'],
  'prosciutto cotto': ['12'],
  'speck': ['12'],

  // Soia (in alcuni prodotti industriali)
  'salsa di soia': ['6'],
}

// Lista completa allergeni EU (Regolamento UE 1169/2011)
const allergenLabels: Record<string, string> = {
  '1': 'Glutine',
  '2': 'Crostacei',
  '3': 'Uova',
  '4': 'Pesce',
  '5': 'Arachidi',
  '6': 'Soia',
  '7': 'Latte',
  '8': 'Frutta a guscio',
  '9': 'Sedano',
  '10': 'Senape',
  '11': 'Semi di sesamo',
  '12': 'Anidride solforosa',
  '13': 'Lupini',
  '14': 'Molluschi',
}

function getAllergensForDish(
  dishName: string,
  description: string | null,
  ingredients: { ingredient: { name: string } }[]
): string[] {
  const allergenSet = new Set<string>()

  // Tutte le pizze contengono glutine e latte (per la mozzarella)
  allergenSet.add('1') // Glutine

  // Se contiene qualsiasi formaggio, aggiungi latte
  const dishText = `${dishName} ${description || ''}`.toLowerCase()
  if (
    dishText.includes('mozzarella') ||
    dishText.includes('formaggio') ||
    dishText.includes('cheese')
  ) {
    allergenSet.add('7') // Latte
  }

  // Analizza gli ingredienti
  ingredients.forEach(({ ingredient }) => {
    const ingName = ingredient.name.toLowerCase()

    // Cerca corrispondenze esatte
    if (allergenMap[ingName]) {
      allergenMap[ingName].forEach(code => allergenSet.add(code))
    }

    // Cerca corrispondenze parziali
    Object.entries(allergenMap).forEach(([key, codes]) => {
      if (ingName.includes(key) || key.includes(ingName)) {
        codes.forEach(code => allergenSet.add(code))
      }
    })
  })

  // Analizza la descrizione per ingredienti aggiuntivi
  if (description) {
    const descLower = description.toLowerCase()
    Object.entries(allergenMap).forEach(([ingredient, codes]) => {
      if (descLower.includes(ingredient)) {
        codes.forEach(code => allergenSet.add(code))
      }
    })
  }

  return Array.from(allergenSet).sort()
}

async function main() {
  console.log('🔄 Aggiornamento allergeni...')

  const dishes = await prisma.dish.findMany({
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
  })

  console.log(`📊 Trovati ${dishes.length} piatti`)

  for (const dish of dishes) {
    const allergenCodes = getAllergensForDish(
      dish.name,
      dish.description,
      dish.ingredients
    )

    const allergenNames = allergenCodes.map(code => allergenLabels[code])

    await prisma.dish.update({
      where: { id: dish.id },
      data: {
        allergens: JSON.stringify(allergenNames),
      },
    })

    console.log(`✅ ${dish.name}: ${allergenNames.join(', ')}`)
  }

  console.log('✨ Completato!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
