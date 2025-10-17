import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping ESATTO basato sui PDF forniti
// 'c' = congelato/surgelato (frozen)
// 'f' = fresco (fresh)
// 'cf' = può essere sia congelato che fresco (nel PDF mostrato come "c f")

const dishMarkers: { [key: string]: 'c' | 'f' | 'cf' } = {
  // === ANTIPASTI (dal Menu Ristorante) ===
  'Insalata di Mare': 'cf',
  'Insalata di Polipo': 'cf',
  'Cocktail Gamberi': 'cf',
  'Gamberetti su insalatina di Radicchio': 'cf',
  'Seppie, Sedano e Grana': 'cf',
  'Polipo alla contadina': 'cf',
  'Polipo alla trevisana': 'cf',

  // === SECONDI DI PESCE (dal Menu Ristorante) ===
  'Misto alla griglia': 'cf',
  'Spiedini gamberoni': 'c',
  'Orate a piacere': 'cf',
  'Sogliola a piacere': 'cf',
  'Zuppette di pesce': 'cf',
  'Frittura di gamberi': 'c',
  'Fritto di calamaretti Patagonia su letto di rucola': 'c',
  'Fritto misto': 'c',
  'Fritto calamari': 'c',
  'Soutè di vongole': 'f', // non ha marker nel PDF
  'Pesce spada alla griglia': 'c',
  'Pesce spada alla messinese': 'c',
  'Filetto di orata con patate': 'f', // non ha marker nel PDF
  'Filetto di sogliola alla marinara': 'c',

  // === CONTORNI ===
  'Patate fritte': 'c',

  // === PIZZE (dal Menu Pizze) ===
  'Calamari': 'c', // Pizza con calamari (seafood = frozen)

  // Tutte le altre pizze sono fresche (ingredienti freschi)
  'Marinara': 'f',
  'Margherita': 'f',
  'Margherita la VERACE': 'f',
  'Napoli': 'f',
  'Siciliana': 'f',
  'Romana': 'f',
  'Scamorza': 'f',
  'Rucola': 'f',
  'Prosciutto': 'f',
  'Bufala': 'f',
  'Pugliese': 'f',
  'Bufala e Pomodoro Fresco': 'f',
  'Bufala e Salame Piccante': 'f',
  'Bufala e Prosciutto Cotto': 'f',
  'Funghi': 'f',
  'Diavola': 'f',
  'Tonno': 'f',
  'Salsiccia': 'f',
  '4 Formaggi': 'f',
  'Prosciutto e Funghi': 'f',
  '4 Stagioni': 'f',
  'Capricciosa': 'f',
  'Prosciutto e Cipolle': 'f',
  'In Amore': 'f',
  'Funghi Porcini': 'f',
  'Pomodoro Fresco': 'f',
  'Susanna': 'f',
  'Verdure': 'f',
  'Wurstel': 'f',
  'Americana': 'f',
  'Wurstel e Patatine': 'f',
  'Dongiovanni': 'f',
  'Prosciutto Funghi Salsiccia': 'f',
  'Tonno e Peperoni': 'f',
  'Peperoni e Pancetta': 'f',
  'Calzone Normale': 'f',
  'Calzone Farcito': 'f',
  'Calzone Alla Norma': 'f',
  'Panciotto Siciliano': 'f',
  'Nuares': 'f',
  'Flegreo': 'f',
  'Focaccia Bianca con Olio Evo': 'f',
  'Focaccia con Olio Evo e Pomodoro': 'f',
  'Focaccia con cipolle': 'f',
  'Focaccia + verdure miste': 'f',
  'Focaccia tonno e cipolle': 'f',
  'Capricetta': 'f',
  'Caprese': 'f',
  'Schiacciata': 'f',
  'Schiacciata con grana': 'f',
  'Schiacciata scamorza affumicata': 'f',
  'Carbonara': 'f',
  'Norma': 'f',
  'Parmigiana': 'f',
  'Fumo': 'f',
  'Pizza dell\'Avvocato': 'f',
  'Maialona': 'f',
  'Cafoncella': 'f',
  'Tramonti': 'f',
  'Selvaggia': 'f',
  'La Pizza dello ZIO': 'f',
  'L\'altra pizza dello ZIO': 'f',
  'Salsiccia e Friarielli': 'f',
  'Pizza Calabrese': 'f',
  'Speciale': 'f',
  'Baguette': 'f',
  'Gorgonzola': 'f',
  'Zola e Cipolle': 'f',
  'Zola e Rucola': 'f',
  'Pizza Arianna': 'f',
  'Gustosa': 'f',
  'Novarese': 'f',
  'Contadina': 'f',
  'Prosciutto Crudo': 'f',
  'Bresaola Rucola e Grana': 'f',
  'Zola e Salame Piccante': 'f',
}

async function main() {
  console.log('📝 Aggiornando marker c/f in base ai PDF forniti...\n')

  const dishes = await prisma.dish.findMany()

  let updated = 0
  let notFound = 0

  for (const dish of dishes) {
    // Cerca il marker corrispondente
    const marker = dishMarkers[dish.name]

    if (!marker) {
      // Se non è nei PDF, lascia 'f' come default
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
    if (marker === 'cf') {
      // Per 'cf' aggiungiamo entrambi i marker
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
  }

  console.log(`\n✨ Completato!`)
  console.log(`   ${updated} piatti aggiornati`)
  console.log(`   ${notFound} piatti non trovati nei PDF (mantenuti con 'f' di default)`)
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
