import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper per collegare ingredienti ai piatti
async function linkIngredientsToDishe(dishId: string, ingredientNames: string[]) {
  for (const ingredientName of ingredientNames) {
    const ingredient = await prisma.ingredient.findFirst({
      where: { name: ingredientName }
    })

    if (ingredient) {
      try {
        await prisma.dishIngredient.create({
          data: {
            dishId,
            ingredientId: ingredient.id,
          },
        })
      } catch (e) {
        // Ignora duplicati
      }
    }
  }
}

// Funzione per estrarre automaticamente ingredienti dalla descrizione
function extractIngredients(description?: string): string[] {
  if (!description) return []

  const ingredients: string[] = []
  const desc = description.toLowerCase()

  // Mappa ingredienti con le loro varianti nel testo (SOLO dai PDF)
  const ingredientMap: { [key: string]: string[] } = {
    'Pomodoro': ['pomodoro', 'pom.', 'pom', 'ciliegino'],
    'Mozzarella': ['mozzarella', 'mozz', 'fior di latte'],
    'Bufala': ['bufala', 'mozzarella di bufala'],
    'Gorgonzola': ['gorgonzola', 'zola'],
    'Scamorza Affumicata': ['scamorza affumicata', 'scamorza'],
    'Grana': ['grana', 'parmigiano', 'parmesan', 'grattugiato'],
    'Taleggio': ['taleggio'],
    'Fontina': ['fontina'],
    'Provola': ['provola'],
    'Pecorino': ['pecorino'],
    'Bocconcini': ['bocconcini', 'bocconcino'],
    'Prosciutto Crudo': ['prosciutto crudo', 'crudo'],
    'Prosciutto Cotto': ['prosciutto cotto', 'prosciutto'],
    'Salame Piccante': ['salame piccante', 'piccante'],
    'Salsiccia': ['salsiccia'],
    'Speck': ['speck'],
    'Bresaola': ['bresaola'],
    'Pancetta': ['pancetta'],
    'Wurstel': ['wurstel'],
    'Nduja': ['nduja', "'nduja"],
    'Funghi': ['funghi'],
    'Funghi Porcini': ['funghi porcini', 'porcini'],
    'Rucola': ['rucola'],
    'Insalata': ['insalata', 'insalatina', 'insalatone', 'insalatona', 'verde'],
    'Radicchio': ['radicchio', 'trevisana'],
    'Cipolle': ['cipolle', 'cipolla'],
    'Melanzane': ['melanzane', 'melanzana', 'parmigiana'],
    'Zucchine': ['zucchine', 'zucchina'],
    'Peperoni': ['peperoni', 'peperone'],
    'Patate': ['patate', 'patatine'],
    'Carciofi': ['carciofi', 'carciofini'],
    'Olive': ['olive'],
    'Capperi': ['capperi'],
    'Aglio': ['aglio'],
    'Basilico': ['basilico'],
    'Origano': ['origano'],
    'Friarielli': ['friarielli'],
    'Spinaci': ['spinaci'],
    'Sedano': ['sedano'],
    'Carote': ['carote', 'carota'],
    'Tonno': ['tonno'],
    'Acciughe': ['acciughe'],
    'Gamberetti': ['gamberetti'],
    'Gamberi': ['gamberi', 'gamberone', 'gamberoni'],
    'Calamari': ['calamari', 'calamaretti'],
    'Seppie': ['seppie'],
    'Polipo': ['polipo', 'polpo'],
    'Vongole': ['vongole'],
    'Cozze': ['cozze'],
    'Pesce Spada': ['pesce spada'],
    'Orata': ['orata', 'orate'],
    'Sogliola': ['sogliola', 'sogliole'],
    'Granchio': ['granchio', 'polpa di granchio'],
    'Uova': ['uova', 'uovo'],
    'Mais': ['mais'],
    'Fagioli': ['fagioli', 'fagiolo'],
    'Noci': ['noci', 'frutta secca'],
    'Limone': ['limone', 'sfusato amalfitano'],
    'Pesto': ['pesto'],
    'Emmenthal': ['emmenthal', 'emmental'],
    'Menta': ['menta'],
  }

  // Controlla ogni ingrediente
  for (const [ingredient, variants] of Object.entries(ingredientMap)) {
    for (const variant of variants) {
      if (desc.includes(variant)) {
        ingredients.push(ingredient)
        break // Passa al prossimo ingrediente
      }
    }
  }

  return ingredients
}

async function main() {
  console.log('🚀 Inizio seed del database...')

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pizzeria.com' },
    update: {},
    create: {
      email: 'admin@pizzeria.com',
      password: hashedPassword,
      name: 'Admin',
    },
  })
  console.log('✅ Admin creato:', admin.email)

  // ==================== CATEGORIE ====================

  // Categorie Ristorante
  const antipastiCat = await prisma.category.create({
    data: { name: 'Antipasti', nameEn: 'Appetizers', order: 1 },
  })

  const insalatoneCat = await prisma.category.create({
    data: { name: 'Insalatone o Piatto unico', nameEn: 'Large Salads or Single Dish', order: 2 },
  })

  const primiCat = await prisma.category.create({
    data: { name: 'Primi Piatti', nameEn: 'First Courses', order: 3 },
  })

  const primiMareCat = await prisma.category.create({
    data: { name: 'Primi di Mare', nameEn: 'Seafood First Courses', order: 4 },
  })

  const risottiCat = await prisma.category.create({
    data: {
      name: 'Risotti',
      nameEn: 'Risotto',
      description: 'minimo 2 porzioni: tempo cottura 20 min',
      order: 5,
    },
  })

  const secondiPesceCat = await prisma.category.create({
    data: { name: 'Secondi Piatti di Pesce', nameEn: 'Fish Main Courses', order: 6 },
  })

  const secondiCarneCat = await prisma.category.create({
    data: { name: 'Secondi piatti di Carne', nameEn: 'Meat Main Courses', order: 7 },
  })

  const contorniCat = await prisma.category.create({
    data: { name: 'Contorni', nameEn: 'Side Dishes', order: 8 },
  })

  const formaggiCat = await prisma.category.create({
    data: { name: 'Formaggi', nameEn: 'Cheeses', order: 9 },
  })

  const bambiniCat = await prisma.category.create({
    data: { name: 'Per i più piccoli', nameEn: 'For the Little Ones', order: 10 },
  })

  // Categorie Pizze
  const pizzeClassicheCat = await prisma.category.create({
    data: {
      name: 'Pizze - Le Più Classiche',
      nameEn: 'Pizzas - The Most Classic',
      description: 'Con le farine del molino di Voghera tipo 00',
      order: 11
    },
  })

  const calzoniFocacceCat = await prisma.category.create({
    data: { name: 'Calzoni e Focacce', nameEn: 'Calzone and Focaccia', order: 12 },
  })

  const pizzeGustoseCat = await prisma.category.create({
    data: { name: 'Pizze - Le Gustose', nameEn: 'Pizzas - The Tasty Ones', order: 13 },
  })

  const pizzeGorgonzolaCat = await prisma.category.create({
    data: { name: 'Pizze al Gorgonzola', nameEn: 'Pizzas with Gorgonzola', order: 14 },
  })

  console.log('✅ Categorie create')

  // ==================== INGREDIENTI ====================
  console.log('📝 Creazione Ingredienti...')

  const ingredientsData = [
    // Verdure e ortaggi (SOLO dai PDF)
    'Pomodoro', 'Rucola', 'Insalata', 'Radicchio', 'Cipolle',
    'Funghi', 'Funghi Porcini', 'Melanzane', 'Zucchine', 'Peperoni', 'Patate',
    'Carciofi', 'Sedano', 'Carote', 'Olive', 'Capperi', 'Aglio', 'Basilico',
    'Origano', 'Friarielli', 'Spinaci',

    // Formaggi (SOLO dai PDF)
    'Mozzarella', 'Gorgonzola', 'Scamorza Affumicata', 'Bufala', 'Grana', 'Taleggio',
    'Fontina', 'Provola', 'Emmenthal', 'Pecorino', 'Bocconcini',

    // Carni e Salumi (SOLO dai PDF)
    'Prosciutto Crudo', 'Prosciutto Cotto', 'Salame Piccante', 'Salsiccia',
    'Speck', 'Bresaola', 'Pancetta', 'Wurstel', 'Nduja',

    // Pesce e frutti di mare (SOLO dai PDF)
    'Tonno', 'Acciughe', 'Gamberetti', 'Gamberi', 'Calamari', 'Seppie',
    'Polipo', 'Vongole', 'Cozze', 'Pesce Spada', 'Orata', 'Sogliola',
    'Granchio',

    // Altri (SOLO dai PDF)
    'Uova', 'Mais', 'Fagioli', 'Noci', 'Limone', 'Pesto', 'Menta'
  ]

  for (const ingredientName of ingredientsData) {
    await prisma.ingredient.upsert({
      where: { name: ingredientName },
      update: {},
      create: {
        name: ingredientName,
        available: true,
      },
    })
  }

  const totalIngredients = await prisma.ingredient.count()
  console.log(`✅ ${totalIngredients} Ingredienti creati`)

  // ==================== ANTIPASTI ====================
  console.log('📝 Creazione Antipasti...')

  const antipasti = [
    { name: 'Prosciutto Crudo', nameEn: 'Ham', price: 10 },
    { name: 'Affettato Misto', nameEn: 'Sliced Cold Meat', price: 9 },
    { name: 'Bresaola Rucola e Grana', nameEn: 'Bresaola Rocket and Parmesan Cheese', price: 15 },
    { name: 'Crudo e Bufala', nameEn: 'Ham and Buffalo Milk Mozzarella Cheese', price: 15 },
    { name: 'Misto Vetrina', nameEn: 'Mixed Vegetables', price: 9 },
    { name: 'Misto Vetrina Grande', nameEn: 'Large Portion Mixed Vegetables', price: 12 },
    { name: 'Insalata di Mare', nameEn: 'Sea Food Salad', price: 19, allergens: ['c', 'f'] },
    { name: 'Insalata di Polipo', nameEn: 'Polyp Salad', price: 19, allergens: ['c', 'f'] },
    { name: 'Cocktail Gamberi', nameEn: 'Prawn Cocktail', price: 16, allergens: ['c', 'f'] },
    { name: 'Gamberetti su insalatina di Radicchio', nameEn: 'Prawn and Chicory', price: 16, allergens: ['c', 'f'] },
    { name: 'Seppie, Sedano e Grana', nameEn: 'Squid, Celery and Parmesan Cheese', price: 14, allergens: ['c', 'f'] },
    { name: 'Polipo alla contadina', nameEn: 'Polyp with potatoes', price: 19, allergens: ['c', 'f'] },
    { name: 'Polipo alla trevisana', nameEn: 'Polyp with chicory', price: 19, allergens: ['c', 'f'] },
  ]

  for (let i = 0; i < antipasti.length; i++) {
    const dish = await prisma.dish.create({
      data: {
        ...antipasti[i],
        allergens: antipasti[i].allergens ? JSON.stringify(antipasti[i].allergens) : null,
        categoryId: antipastiCat.id,
        order: i + 1,
      },
    })
    const ingredients = extractIngredients(antipasti[i].description || antipasti[i].name)
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== INSALATONE ====================
  console.log('📝 Creazione Insalatone...')

  const insalatone = [
    { name: 'Insalatona Mista', nameEn: 'Large Mixed Salad', description: 'Insalata verde, carote, sedano, rucola, pomodori', descriptionEn: 'Lettuce, carrots, celery, rocket, tomatoes', price: 6 },
    { name: 'Insalatona Classica', nameEn: 'Large Classic Salad', description: 'Insalatona mista con aggiunta di mozzarella, tonno, mais e uova', descriptionEn: 'Mixed salad with mozzarella cheese, tuna, corn and eggs', price: 10 },
    { name: 'Insalatona Multicolore', nameEn: 'Large Multicoloured Salad', description: 'Insalatona mista con aggiunta di emmenthal, wurstel, peperoni ed olive', descriptionEn: 'Mixed salad with emmenthal swiss cheese, wurstel, peppers and olives', price: 10 },
    { name: 'Insalatona Mediterranea', nameEn: 'Large Mediterranean Salad', description: 'Insalatona mista con aggiunta di tonno, fagioli, cipolle', descriptionEn: 'Mixed salad with tuna, beans, onions', price: 10 },
    { name: 'Insalatona Italia', nameEn: 'Large Italy Salad', description: 'Pomodoro, insalata verde, rucola, mozzarella', descriptionEn: 'Tomatoes, lettuce, rocket, mozzarella cheese', price: 10 },
    { name: 'Insalatona Fantasia di Mare', nameEn: 'Large Seafood Fantasy Salad', description: 'Insalatona mista, gamberetti, polpa di granchio', descriptionEn: 'Mixed salad with prawns, crab meat', price: 14 },
    { name: 'Verdura lessa con provola affumicata al forno', nameEn: 'Boiled Vegetables with smoked provola cheese', price: 10 },
    { name: 'Provola ai ferri su letto di radicchio', nameEn: 'Grilled provola cheese on chicory', price: 10 },
    { name: 'Verdura Mista con scamorza ai ferri', nameEn: 'Mixed Vegetables with grilled scamorza cheese', price: 12 },
    { name: 'Verdura Mista con lombatina ai ferri', nameEn: 'Mixed Vegetables with grilled meat', price: 14 },
    { name: 'Verdura Mista con mozzarella', nameEn: 'Mixed Vegetables with mozzarella cheese', price: 12 },
    { name: 'Verdura Mista con salsiccia ai ferri', nameEn: 'Mixed Vegetables with grilled sausage', price: 14 },
    { name: 'Verdura Mista con bufala', nameEn: 'Mixed Vegetables with buffalo mozzarella cheese', price: 14 },
    { name: 'Verdura Mista con bresaola', nameEn: 'Mixed Vegetables with beef ham', price: 12 },
    { name: 'Verdura Mista con crudo', nameEn: 'Mixed Vegetables with ham', price: 12 },
  ]

  for (let i = 0; i < insalatone.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...insalatone[i], categoryId: insalatoneCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients((insalatone[i].description || '') + ' ' + (insalatone[i].name || ''))
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== PRIMI PIATTI ====================
  console.log('📝 Creazione Primi Piatti...')

  const primi = [
    { name: 'Penne alla novarese', nameEn: 'Penne alla novarese', description: 'con gorgonzola e spinaci', descriptionEn: 'with gorgonzola (typical novara cheese) and spinach', price: 10 },
    { name: 'Gnocchi al forno', nameEn: 'Oven-baked Gnocchi', description: 'con ragù e mozzarella al forno', descriptionEn: 'with meat sauce and mozzarella (oven-baked)', price: 9 },
    { name: 'Gnocchi Zola speck e rucola', nameEn: 'Gnocchi with gorgonzola, speck and rocket', description: 'con gorgonzola, speck e rucola', descriptionEn: 'with gorgonzola (typical novara cheese), speck and rocket salad', price: 13 },
    { name: 'Penne con zucchine', nameEn: 'Penne with courgettes', description: 'con zucchine (senza pomodoro)', descriptionEn: 'with courgettes (without tomato)', price: 10 },
    { name: 'Spaghetti alla norma', nameEn: 'Spaghetti alla norma', description: 'con pomodoro, melanzane e grana', descriptionEn: 'with tomato sauce, aubergines and parmesan cheese', price: 10 },
    { name: 'Trofie al fumo', nameEn: 'Trofie al fumo', description: 'con pomodoro e scamorza affumicata al forno', descriptionEn: 'with tomato sauce and smoked cheese (oven-baked)', price: 11 },
  ]

  for (let i = 0; i < primi.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...primi[i], categoryId: primiCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients((primi[i].description || '') + ' ' + (primi[i].name || ''))
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== PRIMI DI MARE ====================
  console.log('📝 Creazione Primi di Mare...')

  const primiMare = [
    { name: "Scialatielli all'amalfitana", nameEn: "Scialatielli all'amalfitana", description: "con vongole, menta e limone tipico della Costa d'Amalfi", descriptionEn: 'with clams, mint and lemon typical of the Amalfi Coast', price: 16 },
    { name: 'Paccheri del pescatore', nameEn: 'Paccheri del pescatore', description: 'con polipo, calamari, seppie, gamberetti e gamberone', descriptionEn: 'with polyp, squid, cuttlefish, prawns and king prawn', price: 19 },
    { name: 'Vermicelli alle vongole', nameEn: 'Vermicelli with clams', description: 'con vongole (senza pomodoro)', descriptionEn: 'with clams (without tomato sauce)', price: 16 },
    { name: "Mezze maniche al ragù di mare", nameEn: 'Mezze maniche with seafood sauce', description: 'con ragù di mare', descriptionEn: 'with seafood sauce', price: 13 },
    { name: 'Spaghetti allo scoglio', nameEn: 'Spaghetti allo scoglio', description: 'con frutti di mare e pomodoro', descriptionEn: 'with seafood and tomato sauce', price: 16 },
    { name: 'Orecchiette cozze e zucchine', nameEn: 'Orecchiette with mussels and courgettes', description: 'con cozze e zucchine', descriptionEn: 'with mussels and courgettes', price: 12 },
  ]

  for (let i = 0; i < primiMare.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...primiMare[i], categoryId: primiMareCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients((primiMare[i].description || '') + ' ' + (primiMare[i].name || ''))
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== RISOTTI ====================
  console.log('📝 Creazione Risotti...')

  const risotti = [
    { name: 'Risotto con scamorza affumicata e radicchio', nameEn: 'Rice with smoked scamorza cheese and chicory', price: 11 },
    { name: 'Risotto alla conchiglia', nameEn: 'Rice with sea food', price: 16 },
    { name: 'Risotto ai funghi porcini', nameEn: 'Rice with porcini mushrooms', price: 15 },
    { name: 'Risotto Gaudenziano', nameEn: 'Risotto Gaudenziano', description: 'con salame tipico novarese, gorgonzola e frutta secca', descriptionEn: 'with typical Novara salami, gorgonzola cheese and dried fruit', price: 15 },
    { name: 'Risotto allo Sfusato Amalfitano', nameEn: 'Risotto with Amalfi lemon', description: "con limone tipico della Costa d'Amalfi", descriptionEn: 'with lemon typical of Amalfi Coast', price: 11 },
  ]

  for (let i = 0; i < risotti.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...risotti[i], categoryId: risottiCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients((risotti[i].description || '') + ' ' + (risotti[i].name || ''))
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== SECONDI DI PESCE ====================
  console.log('📝 Creazione Secondi di Pesce...')

  const secondiPesce = [
    { name: 'Misto alla griglia', nameEn: 'Mixed grilled fish', price: 26, allergens: ['c', 'f'] },
    { name: 'Spiedini gamberoni', nameEn: 'Skewers of prawns', price: 19, allergens: ['c'] },
    { name: 'Orate a piacere', nameEn: 'Sea bream', price: 18, allergens: ['c', 'f'] },
    { name: 'Sogliola a piacere', nameEn: 'Sole', description: 'mugnaia, al limone, ai ferri', descriptionEn: 'with butter or lemon or grilled', price: 29, allergens: ['c', 'f'] },
    { name: 'Zuppette di pesce', nameEn: 'Fish soup', price: 23, allergens: ['c', 'f'] },
    { name: 'Frittura di gamberi', nameEn: 'Fried prawns', price: 19, allergens: ['c'] },
    { name: 'Fritto di calamaretti Patagonia su letto di rucola', nameEn: 'Fried Patagonia calamari with rocket salad', price: 18, allergens: ['c'] },
    { name: 'Fritto misto', nameEn: 'Fried mixed fish', price: 19, allergens: ['c'] },
    { name: 'Fritto calamari', nameEn: 'Fried calamari', price: 19, allergens: ['c'] },
    { name: 'Cozze a piacere', nameEn: 'Mussels soup', description: 'marinara, livornese, gratinate, impepata', price: 12 },
    { name: 'Soutè di vongole', nameEn: 'Sautè of clams', price: 25 },
    { name: 'Pesce spada alla griglia', nameEn: 'Grilled swordfish', price: 16, allergens: ['c'] },
    { name: 'Pesce spada alla messinese', nameEn: 'Messinese swordfish', description: 'con olive e sedano', descriptionEn: 'with olives and celery', price: 17, allergens: ['c'] },
    { name: 'Filetto di orata con patate', nameEn: 'Fillet of sea bream with potatoes', price: 14 },
    { name: 'Filetto di sogliola alla marinara', nameEn: 'Fillet of sole marinara', description: 'con pomodoro a pezzetti', descriptionEn: 'with chopped tomatoes', price: 14, allergens: ['c'] },
  ]

  for (let i = 0; i < secondiPesce.length; i++) {
    const dish = await prisma.dish.create({
      data: {
        ...secondiPesce[i],
        allergens: secondiPesce[i].allergens ? JSON.stringify(secondiPesce[i].allergens) : null,
        categoryId: secondiPesceCat.id,
        order: i + 1,
      },
    })
    const ingredients = extractIngredients((secondiPesce[i].description || '') + ' ' + (secondiPesce[i].name || ''))
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== SECONDI DI CARNE ====================
  console.log('📝 Creazione Secondi di Carne...')

  const secondiCarne = [
    { name: 'Costata ai ferri', nameEn: 'Large grilled steak', price: 24 },
    { name: "Filetto all'aceto balsamico", nameEn: 'Fillet with balsamic vinegar', price: 24 },
    { name: 'Grigliata di carne', nameEn: 'Mixed grill', price: 19 },
    { name: 'Bistecca ai ferri', nameEn: 'Grilled steak', price: 13 },
    { name: 'Scaloppa al fumo', nameEn: 'Escalope with scamorza cheese', price: 13 },
    { name: 'Scaloppine al gorgonzola e noci', nameEn: 'Escalopes with gorgonzola cheese and walnuts', price: 13 },
    { name: 'Scaloppine al vino bianco', nameEn: 'Escalopes with white wine', price: 10 },
    { name: 'Filetto di maiale scottato con pancetta', nameEn: 'Fillet of pork with port wine', price: 15 },
    { name: 'Orecchie di elefante', nameEn: 'Elephant ear cutlet', description: 'con pomodoro e rucola', descriptionEn: 'with tomatoes and rocket', price: 15 },
    { name: 'Carpaccio rucola e grana', nameEn: 'Carpaccio rocket and parmesan', price: 13 },
    { name: 'Braciola ai ferri', nameEn: 'Grilled chop', price: 9 },
    { name: 'Cotoletta alla milanese', nameEn: 'Milanese veal cutlet in breadcrumbs', price: 10 },
  ]

  for (let i = 0; i < secondiCarne.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...secondiCarne[i], categoryId: secondiCarneCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients((secondiCarne[i].description || '') + ' ' + (secondiCarne[i].name || ''))
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== CONTORNI ====================
  console.log('📝 Creazione Contorni...')

  const contorni = [
    { name: 'Patate al forno', nameEn: 'Roast potatoes', price: 5 },
    { name: 'Patate fritte', nameEn: 'Chips', price: 5, allergens: ['c'] },
    { name: 'Verdure grigliate', nameEn: 'Grilled vegetables', price: 5 },
    { name: 'Verdure cotte', nameEn: 'Boiled vegetables', price: 5 },
    { name: 'Insalate', nameEn: 'Salads', price: 5 },
    { name: 'Parmigiana', nameEn: 'Aubergine parmigiana', description: 'melanzane, pomodoro, mozzarella e grana', descriptionEn: 'aubergines, tomato sauce, mozzarella cheese and parmesan cheese', price: 5.5 },
  ]

  for (let i = 0; i < contorni.length; i++) {
    const dish = await prisma.dish.create({
      data: {
        ...contorni[i],
        allergens: contorni[i].allergens ? JSON.stringify(contorni[i].allergens) : null,
        categoryId: contorniCat.id,
        order: i + 1,
      },
    })
    const ingredients = extractIngredients((contorni[i].description || '') + ' ' + (contorni[i].name || ''))
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== FORMAGGI ====================
  console.log('📝 Creazione Formaggi...')

  const formaggi = [
    { name: 'Grana', nameEn: 'Grana', price: 6 },
    { name: 'Taleggio', nameEn: 'Taleggio', price: 6 },
    { name: 'Provola ai ferri', nameEn: 'Grilled provola cheese', price: 9 },
    { name: 'Gorgonzola', nameEn: 'Gorgonzola cheese', price: 6 },
    { name: 'Mozzarella', nameEn: 'Mozzarella cheese', price: 5 },
    { name: 'Formaggi misti', nameEn: 'Mixed cheeses', price: 7 },
    { name: 'Mozzarella di bufala', nameEn: 'Buffalo milk mozzarella cheese', price: 7 },
  ]

  for (let i = 0; i < formaggi.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...formaggi[i], categoryId: formaggiCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients((formaggi[i].description || '') + ' ' + (formaggi[i].name || ''))
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== PER I PIÙ PICCOLI ====================
  console.log('📝 Creazione Piatti per Bambini...')

  const bambini = [
    { name: 'Pasta al pomodoro', nameEn: 'Tomato pasta', price: 7 },
    { name: 'Pasta al pesto', nameEn: 'Pasta with pesto sauce', price: 8 },
    { name: 'Hamburger & patatine', nameEn: 'Hamburger & chips', price: 12 },
    { name: 'Cotoletta e Patatine', nameEn: 'Cutlet & chips', price: 12 },
  ]

  for (let i = 0; i < bambini.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...bambini[i], categoryId: bambiniCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients((bambini[i].description || '') + ' ' + (bambini[i].name || ''))
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== PIZZE - LE PIÙ CLASSICHE ====================
  console.log('🍕 Creazione Pizze Classiche...')

  const pizzeClassiche = [
    { name: 'Marinara', nameEn: 'Marinara', description: 'pomodoro, aglio, origano', descriptionEn: 'tomato, garlic, oregano', price: 5 },
    { name: 'Margherita', nameEn: 'Margherita', description: 'pomodoro, mozzarella', descriptionEn: 'tomato, mozzarella cheese', price: 7 },
    { name: 'Margherita la VERACE', nameEn: 'Margherita la VERACE', description: 'Pomodoro ciliegino schiacciato in salsa, fior di latte', descriptionEn: 'tomato, mozzarella cheese', price: 8.5 },
    { name: 'Napoli', nameEn: 'Napoli', description: 'pomodoro, mozzarella, acciughe, origano', descriptionEn: 'tomato, mozzarella cheese, anchovies, oregano', price: 7.5 },
    { name: 'Siciliana', nameEn: 'Siciliana', description: 'pomodoro, capperi, acciughe, origano, olive', descriptionEn: 'tomatoes, capers, anchovies, oregano, olives', price: 8 },
    { name: 'Romana', nameEn: 'Romana', description: 'pomodoro, mozzarella, capperi, acciughe, origano', descriptionEn: 'tomato, mozzarella cheese, capers, anchovies, oregano', price: 8.5 },
    { name: 'Scamorza', nameEn: 'Scamorza', description: 'pomodoro, scamorza affumicata', descriptionEn: 'tomato, smoked scamorza cheese', price: 9 },
    { name: 'Rucola', nameEn: 'Rucola', description: 'pomodoro, mozzarella, rucola', descriptionEn: 'tomato, mozzarella cheese, rocket', price: 8 },
    { name: 'Prosciutto', nameEn: 'Prosciutto', description: 'pomodoro, mozzarella, prosciutto', descriptionEn: 'tomato, mozzarella cheese, ham', price: 8.5 },
    { name: 'Bufala', nameEn: 'Bufala', description: 'pomodoro, mozzarella di bufala', descriptionEn: 'tomato, buffalo milk mozzarella cheese', price: 10 },
    { name: 'Pugliese', nameEn: 'Pugliese', description: 'pomodoro, mozzarella, cipolle, grana grattugiato', descriptionEn: 'tomato, mozzarella cheese, onions, parmesan cheese', price: 9 },
    { name: 'Bufala e Pomodoro Fresco', nameEn: 'Bufala e Pomodoro Fresco', description: 'pomodoro fresco a pezzetti, mozzarella di bufala', descriptionEn: 'chopped tomatoes, buffalo milk mozzarella cheese', price: 12 },
    { name: 'Bufala e Salame Piccante', nameEn: 'Bufala e Salame Piccante', description: 'pomodoro, mozzarella di bufala, salame piccante', descriptionEn: 'tomato, buffalo milk mozzarella cheese, spicy salami', price: 12 },
    { name: 'Bufala e Prosciutto Cotto', nameEn: 'Bufala e Prosciutto Cotto', description: 'pomodoro, mozzarella di bufala, Prosciutto cotto', descriptionEn: 'tomato, mozzarella cheese and ham', price: 11.5 },
    { name: 'Funghi', nameEn: 'Funghi', description: 'pomodoro, mozzarella, funghi', descriptionEn: 'tomato, mozzarella cheese, mushrooms', price: 9 },
    { name: 'Diavola', nameEn: 'Diavola', description: 'pomodoro, mozzarella, salame piccante', descriptionEn: 'tomato, mozzarella cheese, spicy salami', price: 9 },
    { name: 'Tonno', nameEn: 'Tonno', description: 'pomodoro, mozzarella, tonno', descriptionEn: 'tomato, mozzarella cheese, tuna', price: 9 },
    { name: 'Salsiccia', nameEn: 'Salsiccia', description: 'pomodoro, mozzarella, salsiccia', descriptionEn: 'tomato, mozzarella cheese, sausage', price: 9.5 },
    { name: '4 Formaggi', nameEn: '4 Formaggi', description: 'pomodoro, mozzarella, fontina, taleggio, scamorza', descriptionEn: 'tomato, four different cheeses', price: 9.5 },
    { name: 'Prosciutto e Funghi', nameEn: 'Prosciutto e Funghi', description: 'pomodoro, mozz, prosciutto, funghi', descriptionEn: 'tomato, mozzarella cheese, ham, mushrooms', price: 9.5 },
    { name: '4 Stagioni', nameEn: '4 Stagioni', description: 'pomodoro, mozzarella, prosciutto, funghi, carciofi', descriptionEn: 'tomato, mozzarella cheese, ham, mushrooms, artichokes', price: 9.5 },
    { name: 'Capricciosa', nameEn: 'Capricciosa', description: 'pomodoro, mozzarella, prosciutto,funghi, carciofi, olive', descriptionEn: 'tomato, mozzarella cheese, ham, mushrooms, artichokes, olives', price: 10 },
    { name: 'Prosciutto e Cipolle', nameEn: 'Prosciutto e Cipolle', description: 'pomodoro, mozzarella, prosciutto, cipolle', descriptionEn: 'tomato, mozzarella cheese, ham, onions', price: 9 },
    { name: 'In Amore', nameEn: 'In Amore', description: 'pomodoro, mozzarella, tonno e cipolla', descriptionEn: 'tomato, mozzarella cheese, tuna and onions', price: 10 },
    { name: 'Calamari', nameEn: 'Calamari', description: 'pomodoro, mozzarella, calamari', descriptionEn: 'tomato, mozzarella cheese, squids', price: 17 },
    { name: 'Funghi Porcini', nameEn: 'Funghi Porcini', description: 'mozzarella, funghi porcini', descriptionEn: 'mozzarella cheese, porcini mushrooms', price: 14 },
    { name: 'Pomodoro Fresco', nameEn: 'Pomodoro Fresco', description: 'pomodoro fresco a pezzetti, mozzarella', descriptionEn: 'chopped tomato, mozzarella cheese', price: 8.5 },
    { name: 'Susanna', nameEn: 'Susanna', description: 'pomodoro fresco a pezzetti, mozzarella', descriptionEn: 'chopped tomato, mozzarella cheese', price: 9.5 },
    { name: 'Verdure', nameEn: 'Verdure', description: 'pomodoro,mozzarella,verdure miste', descriptionEn: 'tomato, mozzarella cheese, mixed vegetables', price: 9 },
    { name: 'Wurstel', nameEn: 'Wurstel', description: 'pomodoro,mozzarella,wurstel', descriptionEn: 'tomato, mozzarella cheese, wurstel', price: 7.5 },
    { name: 'Americana', nameEn: 'Americana', description: 'pomodoro,mozzarella, patatine', descriptionEn: 'tomato, mozzarella cheese, chips', price: 10 },
    { name: 'Wurstel e Patatine', nameEn: 'Wurstel e Patatine', description: 'pomodoro, mozzarella, wurstel, patatine', descriptionEn: 'tomato, mozzarella cheese, wurstel, chips', price: 11 },
    { name: 'Dongiovanni', nameEn: 'Dongiovanni', description: 'pomodoro,mozzarella,salsiccia, patatine', descriptionEn: 'tomato, mozzarella cheese, sausage, chips', price: 12 },
    { name: 'Prosciutto Funghi Salsiccia', nameEn: 'Prosciutto Funghi Salsiccia', description: 'pomodoro,mozzarella,prosciutto,funghi, salsiccia', descriptionEn: 'tomato, mozzarella cheese, ham, mushrooms,sausage', price: 12 },
    { name: 'Tonno e Peperoni', nameEn: 'Tonno e Peperoni', description: 'pomodoro,mozzarella,tonno,peperoni', descriptionEn: 'tomato, mozzarella cheese, tuna, peppers', price: 11 },
    { name: 'Peperoni e Pancetta', nameEn: 'Peperoni e Pancetta', description: 'pomodoro,mozzarella,peperoni, pancetta', descriptionEn: 'tomato, mozzarella cheese, peppers, bacon', price: 12 },
  ]

  for (let i = 0; i < pizzeClassiche.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...pizzeClassiche[i], categoryId: pizzeClassicheCat.id, order: i + 1 },
    })

    // Estrai ed collega ingredienti automaticamente dalla descrizione
    const ingredients = extractIngredients(pizzeClassiche[i].description)
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== CALZONI E FOCACCE ====================
  console.log('🍕 Creazione Calzoni e Focacce...')

  const calzoniFocacce = [
    { name: 'Calzone Normale', nameEn: 'Normal Calzone', description: 'pomodoro, mozzarella, prosciutto', descriptionEn: 'tomato, mozzarella cheese, ham', price: 8 },
    { name: 'Calzone Farcito', nameEn: 'Stuffed Calzone', description: 'pomodoro, mozzarella, prosciutto, funghi, carciofi', descriptionEn: 'tomato, mozzarella cheese, ham, mushrooms,artichokes', price: 9.5 },
    { name: 'Calzone Alla Norma', nameEn: 'Calzone Alla Norma', description: 'pomodoro, mozzarella, prosciutto, melanzane, grana', descriptionEn: 'tomato, mozzarella cheese, ham, aubergine, parmesan cheese', price: 9.5 },
    { name: 'Panciotto Siciliano', nameEn: 'Panciotto Siciliano', description: 'pomodoro, mozzarella, capperi, acciughe, origano, olive', descriptionEn: 'tomato, mozzarella cheese, capers, anchovies, oregano, olives', price: 8.5 },
    { name: 'Nuares', nameEn: 'Nuares', description: 'mozzarella, gorgonzola, radicchio e noci', descriptionEn: 'mozzarella and gorgonzola cheese, chicory and nuts', price: 12 },
    { name: 'Flegreo', nameEn: 'Flegreo', description: 'mozzarella di bufala, friarielli e nduja', descriptionEn: 'buffalo milk mozzarella cheese, broccoli, spicy italian salami', price: 12 },
    { name: 'Focaccia Bianca con Olio Evo', nameEn: 'White Focaccia with Extra Virgin Olive Oil', price: 4 },
    { name: 'Focaccia con Olio Evo e Pomodoro', nameEn: 'Focaccia with Oil and Tomato', description: 'Pom e olio evo', descriptionEn: 'a little tomato and oil', price: 4 },
    { name: 'Focaccia con cipolle', nameEn: 'Focaccia with onions', description: 'Pom, olio evo, cipolle, grana grattugiato', descriptionEn: 'a little tomato, oregano, onions, parmesan cheese', price: 6 },
    { name: 'Focaccia + verdure miste', nameEn: 'Focaccia with mixed vegetables', descriptionEn: 'a little tomato with mixed vegetables', price: 7 },
    { name: 'Focaccia tonno e cipolle', nameEn: 'Focaccia tuna and onions', description: 'pom., tonno, cipolle', descriptionEn: 'tomato, tuna, onions', price: 9 },
    { name: 'Capricetta', nameEn: 'Capricetta', description: 'Base focaccia macchiata, radicchio, pomodoro, mozzarella (tutto dopo cottura)', descriptionEn: 'chicory, tomatoes, mozzarella cheese (all after cooked)', price: 10 },
    { name: 'Caprese', nameEn: 'Caprese', description: 'Base focaccia macchiata, Pomodoro a fette, bocconcino a fette, origano, basilico', descriptionEn: 'sliced tomato, sliced mozzarella cheese, oregano, basil (all after cooked)', price: 10 },
    { name: 'Schiacciata', nameEn: 'Schiacciata', description: 'pomodoro a pezzetti, aglio, origano', descriptionEn: 'chopped tomatoes, garlic, oregano', price: 8 },
    { name: 'Schiacciata con grana', nameEn: 'Schiacciata with parmesan', description: 'Pomodoro a pezzetti, aglio, scaglie di grana, origano', descriptionEn: 'chopped tomatoes, garlic, parmesan cheese, oregano', price: 10 },
    { name: 'Schiacciata scamorza affumicata', nameEn: 'Schiacciata with smoked scamorza', description: 'Pomodoro a pezzetti, aglio, scamorza affumicata, origano', descriptionEn: 'chopped tomatoes, garlic, smoked scamorza cheese, oregano', price: 11 },
  ]

  for (let i = 0; i < calzoniFocacce.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...calzoniFocacce[i], categoryId: calzoniFocacceCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients(calzoniFocacce[i].description)
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== PIZZE - LE GUSTOSE ====================
  console.log('🍕 Creazione Pizze Gustose...')

  const pizzeGustose = [
    { name: 'Carbonara', nameEn: 'Carbonara', description: 'Mozzarella, pancetta, uovo pepe e grana', descriptionEn: 'mozzarella cheese, bacon, pepper parmesan cheese', price: 11 },
    { name: 'Norma', nameEn: 'Norma', description: 'Pomodoro, mozzarella, melanzane a fettine, grana', descriptionEn: 'tomato, mozzarella cheese, aubergine, parmesan cheese', price: 10 },
    { name: 'Parmigiana', nameEn: 'Parmigiana', description: 'pomodoro, mozzarella, melanzane alla parmigiana', descriptionEn: 'tomato, mozzarella cheese, aubergine parmigiana', price: 10 },
    { name: 'Fumo', nameEn: 'Fumo', description: 'Pomodoro, scamorza affumicata, speck affumicato', descriptionEn: 'tomato, smoked scamorza cheese, smoked speck', price: 11 },
    { name: "Pizza dell'Avvocato", nameEn: "Pizza dell'Avvocato", description: 'Mozz., carciofini, crudo e pecorino', descriptionEn: 'mozzarella, artichokes, ham pecorino cheese', price: 13 },
    { name: 'Maialona', nameEn: 'Maialona', description: 'pomodoro,mozzarella,prosciutto,salsiccia,wurstel,salame piccante', descriptionEn: 'tomato, mozzarella cheese, ham, sausage, wurstel, spicy salami', price: 12 },
    { name: 'Cafoncella', nameEn: 'Cafoncella', description: 'mozzarella, Scamorza affumicata, pancetta e patate', descriptionEn: 'smoked mozzarella, bacon, potatoes', price: 12 },
    { name: 'Tramonti', nameEn: 'Tramonti', description: 'pomodoro,mozzarella,cipolle,grana, pancetta', descriptionEn: 'tomato, mozzarella cheese, onions, parmesan cheese, bacon', price: 11 },
    { name: 'Selvaggia', nameEn: 'Selvaggia', description: 'pomodoro,scamorza affumicata ,radicchio, pancetta', descriptionEn: 'tomato, smoked scamorza cheese, chicory, bacon', price: 11 },
    { name: 'La Pizza dello ZIO', nameEn: 'La Pizza dello ZIO', description: 'Pomodoro, Aglio Origano con Mozzarella di Bufala a fette dopo cottura', descriptionEn: 'tomato, garlic,oregano whit anchovies and mozzerella cheese aftercooking', price: 9.5 },
    { name: "L'altra pizza dello ZIO", nameEn: "L'altra pizza dello ZIO", description: 'Pomodoro, Aglio Origano con acciughe e Mozzarella di Bufala a fette dopo cottura', descriptionEn: 'tomato, garlic, oregano and mozzerella cheese after cooking', price: 10.5 },
    { name: 'Salsiccia e Friarielli', nameEn: 'Salsiccia e Friarielli', description: 'scamorza affumicata, salsiccia, friarielli', descriptionEn: 'smoked scamorza cheese, sausage, broccoli', price: 10 },
    { name: 'Pizza Calabrese', nameEn: 'Pizza Calabrese', description: "Pomodoro, Mozzarella e 'Nduja dopo cottura", descriptionEn: 'tomato, mozzarella cheese and typical very spicy italian salami after cooking', price: 10 },
    { name: 'Speciale', nameEn: 'Speciale', description: 'mozzarella,zucchine, gamberetti', descriptionEn: 'mozzarella cheese, courgettes, prawns', price: 15 },
    { name: 'Baguette', nameEn: 'Baguette', description: 'Chiusa a libro ripiena di Mozzarella, rucola, crudo', descriptionEn: 'mozzarella, ham, rocket', price: 10 },
  ]

  for (let i = 0; i < pizzeGustose.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...pizzeGustose[i], categoryId: pizzeGustoseCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients(pizzeGustose[i].description)
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  // ==================== PIZZE AL GORGONZOLA ====================
  console.log('🍕 Creazione Pizze al Gorgonzola...')

  const pizzeGorgonzola = [
    { name: 'Gorgonzola', nameEn: 'Gorgonzola', description: 'pomodoro,mozzarella, gorgonzola', descriptionEn: 'tomato, mozzarella cheese, gorgonzola cheese', price: 9.5 },
    { name: 'Zola e Cipolle', nameEn: 'Zola e Cipolle', description: 'pomodoro, mozzarella, gorgonzola, cipolle', descriptionEn: 'tomato, mozzarella cheese, gorgonzola cheese,onions', price: 10 },
    { name: 'Zola e Rucola', nameEn: 'Zola e Rucola', description: 'pomodoro, mozzarella, gorgonzola, rucola', descriptionEn: 'tomato, mozzarella cheese, gorgonzola cheese, rocketsalad', price: 10 },
    { name: 'Pizza Arianna', nameEn: 'Pizza Arianna', description: 'Mozzarella, Gorgonzola, Prosciutto Cotto e capperi di Linosa noce moscata', descriptionEn: 'mozzarella cheese, gorgonzola cheese, ham and capers from Linosa nutmeg', price: 12 },
    { name: 'Gustosa', nameEn: 'Gustosa', description: 'Mozzarella, Gorgonzola, salsiccia cipolla', descriptionEn: 'mozzarella gorgonzola, sausage onions', price: 12 },
    { name: 'Novarese', nameEn: 'Novarese', description: 'pomodoro,mozzarella,gorgonzola,carciofi', descriptionEn: 'tomato, mozzarella cheese, gorgonzola cheese,artichokes', price: 11 },
    { name: 'Contadina', nameEn: 'Contadina', description: 'mozzarella,gorgonzola,patate lesse, insalata', descriptionEn: 'mozzarella cheese, gorgonzola cheese, boiled potatoes, salad', price: 11 },
    { name: 'Zola e Salame Piccante', nameEn: 'Zola e Salame Piccante', description: 'pomodoro,mozzarella, gorgonzola,salame piccante', descriptionEn: 'tomato, mozzarella cheese, gorgonzola cheese, spicy salami', price: 11 },
  ]

  for (let i = 0; i < pizzeGorgonzola.length; i++) {
    const dish = await prisma.dish.create({
      data: { ...pizzeGorgonzola[i], categoryId: pizzeGorgonzolaCat.id, order: i + 1 },
    })
    const ingredients = extractIngredients(pizzeGorgonzola[i].description)
    if (ingredients.length > 0) {
      await linkIngredientsToDishe(dish.id, ingredients)
    }
  }

  const totalDishes = await prisma.dish.count()
  const totalCategories = await prisma.category.count()
  const totalIngredientsFinal = await prisma.ingredient.count()
  const totalRelations = await prisma.dishIngredient.count()

  console.log(`
  ✅ COMPLETATO!

  📊 RIEPILOGO FINALE:
  ✅ 1 Admin user
  ✅ ${totalCategories} Categorie
  ✅ ${totalIngredientsFinal} Ingredienti
  ✅ ${totalDishes} Piatti/Pizze totali
  ✅ ${totalRelations} Relazioni Piatto-Ingrediente

  🍽️  Piatti Ristorante: 89
  🍕 Pizze: ${totalDishes - 89}

  🎉 Database popolato con TUTTO il menu e ingredienti collegati!
  🔗 Ora quando segni un ingrediente come "finito", i piatti verranno disabilitati automaticamente!
  `)
}

main()
  .catch((e) => {
    console.error('❌ Errore durante il seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
