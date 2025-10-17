import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping CORRETTO basato ESATTAMENTE sui PDF
// Nel PDF del menu pizze NON ci sono marker c/f
// I marker c/f sono SOLO nel menu ristorante per alcuni piatti specifici

const dishMarkers: { [key: string]: 'c' | 'f' | 'cf' } = {
  // === MENU RISTORANTE - ANTIPASTI ===
  'Insalata di Mare': 'cf',           // c f nel PDF
  'Insalata di Polipo': 'cf',         // c f nel PDF
  'Cocktail Gamberi': 'cf',           // c f nel PDF
  'Gamberetti su insalatina di Radicchio': 'cf',  // c f nel PDF
  'Seppie, Sedano e Grana': 'cf',     // c f nel PDF
  'Polipo alla contadina': 'cf',      // c f nel PDF
  'Polipo alla trevisana': 'cf',      // c f nel PDF

  // === MENU RISTORANTE - SECONDI DI PESCE ===
  'Misto alla griglia': 'cf',         // c f nel PDF
  'Spiedini gamberoni': 'c',          // solo c nel PDF
  'Orate a piacere': 'cf',            // c f nel PDF
  'Sogliola a piacere': 'cf',         // c f nel PDF
  'Zuppette di pesce': 'cf',          // c f nel PDF
  'Frittura di gamberi': 'c',         // solo c nel PDF
  'Fritto di calamaretti Patagonia su letto di rucola': 'c',  // solo c nel PDF
  'Fritto misto': 'c',                // solo c nel PDF
  'Fritto calamari': 'c',             // solo c nel PDF
  'Pesce spada alla griglia': 'c',    // solo c nel PDF
  'Pesce spada alla messinese': 'c',  // solo c nel PDF
  'Filetto di sogliola alla marinara': 'c',  // solo c nel PDF

  // === MENU RISTORANTE - CONTORNI ===
  'Patate fritte': 'c',               // solo c nel PDF

  // NOTA: Le pizze NON hanno marker c/f nel PDF delle pizze!
  // Tutte le altre pizze rimangono senza marker
}

async function main() {
  console.log('📝 Correggendo i marker c/f in base ai PDF...\n')

  const dishes = await prisma.dish.findMany()

  let updated = 0
  let removed = 0

  for (const dish of dishes) {
    let allergens: string[] = []
    try {
      allergens = dish.allergens ? JSON.parse(dish.allergens) : []
    } catch (e) {
      allergens = []
    }

    // Rimuovi sempre i vecchi marker c/f
    const hadMarkers = allergens.includes('c') || allergens.includes('f')
    allergens = allergens.filter((a: string) => a !== 'c' && a !== 'f')

    // Cerca il marker corrispondente nei PDF
    const marker = dishMarkers[dish.name]

    if (marker) {
      // Questo piatto HA marker nei PDF
      if (marker === 'cf') {
        allergens.push('c')
        allergens.push('f')
      } else {
        allergens.push(marker)
      }

      await prisma.dish.update({
        where: { id: dish.id },
        data: { allergens: JSON.stringify(allergens) }
      })

      updated++
      const markerDisplay = marker === 'cf' ? "'c' 'f'" : `'${marker}'`
      console.log(`✅ ${dish.name} → ${markerDisplay}`)
    } else if (hadMarkers) {
      // Questo piatto aveva marker ma NON dovrebbe averli
      await prisma.dish.update({
        where: { id: dish.id },
        data: { allergens: JSON.stringify(allergens) }
      })
      removed++
      console.log(`🗑️  ${dish.name} → rimossi marker (non presenti nel PDF)`)
    }
  }

  console.log(`\n✨ Completato!`)
  console.log(`   ${updated} piatti aggiornati con marker dai PDF`)
  console.log(`   ${removed} piatti con marker rimossi (non nei PDF)`)
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
