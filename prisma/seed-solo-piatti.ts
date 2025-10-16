import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Inizio seed del database...')

  // Creare admin user
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

  // Creare categorie
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

  console.log('✅ Categorie create')

  // ==================== ANTIPASTI ====================
  console.log('📝 Creazione Antipasti...')

  await prisma.dish.create({
    data: {
      name: 'Prosciutto Crudo',
      nameEn: 'Ham',
      price: 10,
      categoryId: antipastiCat.id,
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Affettato Misto',
      nameEn: 'Sliced Cold Meat',
      price: 9,
      categoryId: antipastiCat.id,
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Bresaola Rucola e Grana',
      nameEn: 'Bresaola Rocket and Parmesan Cheese',
      price: 15,
      categoryId: antipastiCat.id,
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Crudo e Bufala',
      nameEn: 'Ham and Buffalo Milk Mozzarella Cheese',
      price: 15,
      categoryId: antipastiCat.id,
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Misto Vetrina',
      nameEn: 'Mixed Vegetables',
      price: 9,
      categoryId: antipastiCat.id,
      order: 5,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Misto Vetrina Grande',
      nameEn: 'Large Portion Mixed Vegetables',
      price: 12,
      categoryId: antipastiCat.id,
      order: 6,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Insalata di Mare',
      nameEn: 'Sea Food Salad',
      price: 19,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 7,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Insalata di Polipo',
      nameEn: 'Polyp Salad',
      price: 19,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 8,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Cocktail Gamberi',
      nameEn: 'Prawn Cocktail',
      price: 16,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 9,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Gamberetti su insalatina di Radicchio',
      nameEn: 'Prawn and Chicory',
      price: 16,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 10,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Seppie, Sedano e Grana',
      nameEn: 'Squid, Celery and Parmesan Cheese',
      price: 14,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 11,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Polipo alla contadina',
      nameEn: 'Polyp with potatoes',
      price: 19,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 12,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Polipo alla trevisana',
      nameEn: 'Polyp with chicory',
      price: 19,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 13,
    },
  })

  // ==================== INSALATONE ====================
  console.log('📝 Creazione Insalatone...')

  await prisma.dish.create({
    data: {
      name: 'Insalatona Mista',
      nameEn: 'Large Mixed Salad',
      description: 'Insalata verde, carote, sedano, rucola, pomodori',
      descriptionEn: 'Lettuce, carrots, celery, rocket, tomatoes',
      price: 6,
      categoryId: insalatoneCat.id,
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Insalatona Classica',
      nameEn: 'Large Classic Salad',
      description: 'Insalatona mista con aggiunta di mozzarella, tonno, mais e uova',
      descriptionEn: 'Mixed salad with mozzarella cheese, tuna, corn and eggs',
      price: 10,
      categoryId: insalatoneCat.id,
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Insalatona Multicolore',
      nameEn: 'Large Multicoloured Salad',
      description: 'Insalatona mista con aggiunta di emmenthal, wurstel, peperoni ed olive',
      descriptionEn: 'Mixed salad with emmenthal swiss cheese, wurstel, peppers and olives',
      price: 10,
      categoryId: insalatoneCat.id,
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Insalatona Mediterranea',
      nameEn: 'Large Mediterranean Salad',
      description: 'Insalatona mista con aggiunta di tonno, fagioli, cipolle',
      descriptionEn: 'Mixed salad with tuna, beans, onions',
      price: 10,
      categoryId: insalatoneCat.id,
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Insalatona Italia',
      nameEn: 'Large Italy Salad',
      description: 'Pomodoro, insalata verde, rucola, mozzarella',
      descriptionEn: 'Tomatoes, lettuce, rocket, mozzarella cheese',
      price: 10,
      categoryId: insalatoneCat.id,
      order: 5,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Insalatona Fantasia di Mare',
      nameEn: 'Large Seafood Fantasy Salad',
      description: 'Insalatona mista, gamberetti, polpa di granchio',
      descriptionEn: 'Mixed salad with prawns, crab meat',
      price: 14,
      categoryId: insalatoneCat.id,
      order: 6,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdura lessa con provola affumicata al forno',
      nameEn: 'Boiled Vegetables with smoked provola cheese',
      price: 10,
      categoryId: insalatoneCat.id,
      order: 7,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Provola ai ferri su letto di radicchio',
      nameEn: 'Grilled provola cheese on chicory',
      price: 10,
      categoryId: insalatoneCat.id,
      order: 8,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdura Mista con scamorza ai ferri',
      nameEn: 'Mixed Vegetables with grilled scamorza cheese',
      price: 12,
      categoryId: insalatoneCat.id,
      order: 9,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdura Mista con lombatina ai ferri',
      nameEn: 'Mixed Vegetables with grilled meat',
      price: 14,
      categoryId: insalatoneCat.id,
      order: 10,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdura Mista con mozzarella',
      nameEn: 'Mixed Vegetables with mozzarella cheese',
      price: 12,
      categoryId: insalatoneCat.id,
      order: 11,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdura Mista con salsiccia ai ferri',
      nameEn: 'Mixed Vegetables with grilled sausage',
      price: 14,
      categoryId: insalatoneCat.id,
      order: 12,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdura Mista con bufala',
      nameEn: 'Mixed Vegetables with buffalo mozzarella cheese',
      price: 14,
      categoryId: insalatoneCat.id,
      order: 13,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdura Mista con bresaola',
      nameEn: 'Mixed Vegetables with beef ham',
      price: 12,
      categoryId: insalatoneCat.id,
      order: 14,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdura Mista con crudo',
      nameEn: 'Mixed Vegetables with ham',
      price: 12,
      categoryId: insalatoneCat.id,
      order: 15,
    },
  })

  // ==================== PRIMI PIATTI ====================
  console.log('📝 Creazione Primi Piatti...')

  await prisma.dish.create({
    data: {
      name: 'Penne alla novarese',
      nameEn: 'Penne alla novarese',
      description: 'con gorgonzola e spinaci',
      descriptionEn: 'with gorgonzola (typical novara cheese) and spinach',
      price: 10,
      categoryId: primiCat.id,
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Gnocchi al forno',
      nameEn: 'Oven-baked Gnocchi',
      description: 'con ragù e mozzarella al forno',
      descriptionEn: 'with meat sauce and mozzarella (oven-baked)',
      price: 9,
      categoryId: primiCat.id,
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Gnocchi Zola speck e rucola',
      nameEn: 'Gnocchi with gorgonzola, speck and rocket',
      description: 'con gorgonzola, speck e rucola',
      descriptionEn: 'with gorgonzola (typical novara cheese), speck and rocket salad',
      price: 13,
      categoryId: primiCat.id,
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Penne con zucchine',
      nameEn: 'Penne with courgettes',
      description: 'con zucchine (senza pomodoro)',
      descriptionEn: 'with courgettes (without tomato)',
      price: 10,
      categoryId: primiCat.id,
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Spaghetti alla norma',
      nameEn: 'Spaghetti alla norma',
      description: 'con pomodoro, melanzane e grana',
      descriptionEn: 'with tomato sauce, aubergines and parmesan cheese',
      price: 10,
      categoryId: primiCat.id,
      order: 5,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Trofie al fumo',
      nameEn: 'Trofie al fumo',
      description: 'con pomodoro e scamorza affumicata al forno',
      descriptionEn: 'with tomato sauce and smoked cheese (oven-baked)',
      price: 11,
      categoryId: primiCat.id,
      order: 6,
    },
  })

  // ==================== PRIMI DI MARE ====================
  console.log('📝 Creazione Primi di Mare...')

  await prisma.dish.create({
    data: {
      name: "Scialatielli all'amalfitana",
      nameEn: "Scialatielli all'amalfitana",
      description: "con vongole, menta e limone tipico della Costa d'Amalfi",
      descriptionEn: 'with clams, mint and lemon typical of the Amalfi Coast',
      price: 16,
      categoryId: primiMareCat.id,
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Paccheri del pescatore',
      nameEn: 'Paccheri del pescatore',
      description: 'con polipo, calamari, seppie, gamberetti e gamberone',
      descriptionEn: 'with polyp, squid, cuttlefish, prawns and king prawn',
      price: 19,
      categoryId: primiMareCat.id,
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Vermicelli alle vongole',
      nameEn: 'Vermicelli with clams',
      description: 'con vongole (senza pomodoro)',
      descriptionEn: 'with clams (without tomato sauce)',
      price: 16,
      categoryId: primiMareCat.id,
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: "Mezze maniche al ragù di mare",
      nameEn: 'Mezze maniche with seafood sauce',
      description: 'con ragù di mare',
      descriptionEn: 'with seafood sauce',
      price: 13,
      categoryId: primiMareCat.id,
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Spaghetti allo scoglio',
      nameEn: 'Spaghetti allo scoglio',
      description: 'con frutti di mare e pomodoro',
      descriptionEn: 'with seafood and tomato sauce',
      price: 16,
      categoryId: primiMareCat.id,
      order: 5,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Orecchiette cozze e zucchine',
      nameEn: 'Orecchiette with mussels and courgettes',
      description: 'con cozze e zucchine',
      descriptionEn: 'with mussels and courgettes',
      price: 12,
      categoryId: primiMareCat.id,
      order: 6,
    },
  })

  // ==================== RISOTTI ====================
  console.log('📝 Creazione Risotti...')

  await prisma.dish.create({
    data: {
      name: 'Risotto con scamorza affumicata e radicchio',
      nameEn: 'Rice with smoked scamorza cheese and chicory',
      price: 11,
      categoryId: risottiCat.id,
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Risotto alla conchiglia',
      nameEn: 'Rice with sea food',
      price: 16,
      categoryId: risottiCat.id,
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Risotto ai funghi porcini',
      nameEn: 'Rice with porcini mushrooms',
      price: 15,
      categoryId: risottiCat.id,
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Risotto Gaudenziano',
      nameEn: 'Risotto Gaudenziano',
      description: 'con salame tipico novarese, gorgonzola e frutta secca',
      descriptionEn: 'with typical Novara salami, gorgonzola cheese and dried fruit',
      price: 15,
      categoryId: risottiCat.id,
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Risotto allo Sfusato Amalfitano',
      nameEn: 'Risotto with Amalfi lemon',
      description: "con limone tipico della Costa d'Amalfi",
      descriptionEn: 'with lemon typical of Amalfi Coast',
      price: 11,
      categoryId: risottiCat.id,
      order: 5,
    },
  })

  // ==================== SECONDI DI PESCE ====================
  console.log('📝 Creazione Secondi di Pesce...')

  await prisma.dish.create({
    data: {
      name: 'Misto alla griglia',
      nameEn: 'Mixed grilled fish',
      price: 26,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Spiedini gamberoni',
      nameEn: 'Skewers of prawns',
      price: 19,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c']),
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Orate a piacere',
      nameEn: 'Sea bream',
      price: 18,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Sogliola a piacere',
      nameEn: 'Sole',
      description: 'mugnaia, al limone, ai ferri',
      descriptionEn: 'with butter or lemon or grilled',
      price: 29,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Zuppette di pesce',
      nameEn: 'Fish soup',
      price: 23,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 5,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Frittura di gamberi',
      nameEn: 'Fried prawns',
      price: 19,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c']),
      order: 6,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Fritto di calamaretti Patagonia su letto di rucola',
      nameEn: 'Fried Patagonia calamari with rocket salad',
      price: 18,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c']),
      order: 7,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Fritto misto',
      nameEn: 'Fried mixed fish',
      price: 19,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c']),
      order: 8,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Fritto calamari',
      nameEn: 'Fried calamari',
      price: 19,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c']),
      order: 9,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Cozze a piacere',
      nameEn: 'Mussels soup',
      description: 'marinara, livornese, gratinate, impepata',
      price: 12,
      categoryId: secondiPesceCat.id,
      order: 10,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Soutè di vongole',
      nameEn: 'Sautè of clams',
      price: 25,
      categoryId: secondiPesceCat.id,
      order: 11,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Pesce spada alla griglia',
      nameEn: 'Grilled swordfish',
      price: 16,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c']),
      order: 12,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Pesce spada alla messinese',
      nameEn: 'Messinese swordfish',
      description: 'con olive e sedano',
      descriptionEn: 'with olives and celery',
      price: 17,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c']),
      order: 13,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Filetto di orata con patate',
      nameEn: 'Fillet of sea bream with potatoes',
      price: 14,
      categoryId: secondiPesceCat.id,
      order: 14,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Filetto di sogliola alla marinara',
      nameEn: 'Fillet of sole marinara',
      description: 'con pomodoro a pezzetti',
      descriptionEn: 'with chopped tomatoes',
      price: 14,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c']),
      order: 15,
    },
  })

  // ==================== SECONDI DI CARNE ====================
  console.log('📝 Creazione Secondi di Carne...')

  await prisma.dish.create({
    data: {
      name: 'Costata ai ferri',
      nameEn: 'Large grilled steak',
      price: 24,
      categoryId: secondiCarneCat.id,
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: "Filetto all'aceto balsamico",
      nameEn: 'Fillet with balsamic vinegar',
      price: 24,
      categoryId: secondiCarneCat.id,
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Grigliata di carne',
      nameEn: 'Mixed grill',
      price: 19,
      categoryId: secondiCarneCat.id,
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Bistecca ai ferri',
      nameEn: 'Grilled steak',
      price: 13,
      categoryId: secondiCarneCat.id,
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Scaloppa al fumo',
      nameEn: 'Escalope with scamorza cheese',
      price: 13,
      categoryId: secondiCarneCat.id,
      order: 5,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Scaloppine al gorgonzola e noci',
      nameEn: 'Escalopes with gorgonzola cheese and walnuts',
      price: 13,
      categoryId: secondiCarneCat.id,
      order: 6,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Scaloppine al vino bianco',
      nameEn: 'Escalopes with white wine',
      price: 10,
      categoryId: secondiCarneCat.id,
      order: 7,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Filetto di maiale scottato con pancetta',
      nameEn: 'Fillet of pork with port wine',
      price: 15,
      categoryId: secondiCarneCat.id,
      order: 8,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Orecchie di elefante',
      nameEn: 'Elephant ear cutlet',
      description: 'con pomodoro e rucola',
      descriptionEn: 'with tomatoes and rocket',
      price: 15,
      categoryId: secondiCarneCat.id,
      order: 9,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Carpaccio rucola e grana',
      nameEn: 'Carpaccio rocket and parmesan',
      price: 13,
      categoryId: secondiCarneCat.id,
      order: 10,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Braciola ai ferri',
      nameEn: 'Grilled chop',
      price: 9,
      categoryId: secondiCarneCat.id,
      order: 11,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Cotoletta alla milanese',
      nameEn: 'Milanese veal cutlet in breadcrumbs',
      price: 10,
      categoryId: secondiCarneCat.id,
      order: 12,
    },
  })

  // ==================== CONTORNI ====================
  console.log('📝 Creazione Contorni...')

  await prisma.dish.create({
    data: {
      name: 'Patate al forno',
      nameEn: 'Roast potatoes',
      price: 5,
      categoryId: contorniCat.id,
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Patate fritte',
      nameEn: 'Chips',
      price: 5,
      categoryId: contorniCat.id,
      allergens: JSON.stringify(['c']),
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdure grigliate',
      nameEn: 'Grilled vegetables',
      price: 5,
      categoryId: contorniCat.id,
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Verdure cotte',
      nameEn: 'Boiled vegetables',
      price: 5,
      categoryId: contorniCat.id,
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Insalate',
      nameEn: 'Salads',
      price: 5,
      categoryId: contorniCat.id,
      order: 5,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Parmigiana',
      nameEn: 'Aubergine parmigiana',
      description: 'melanzane, pomodoro, mozzarella e grana',
      descriptionEn: 'aubergines, tomato sauce, mozzarella cheese and parmesan cheese',
      price: 5.5,
      categoryId: contorniCat.id,
      order: 6,
    },
  })

  // ==================== FORMAGGI ====================
  console.log('📝 Creazione Formaggi...')

  await prisma.dish.create({
    data: {
      name: 'Grana',
      nameEn: 'Grana',
      price: 6,
      categoryId: formaggiCat.id,
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Taleggio',
      nameEn: 'Taleggio',
      price: 6,
      categoryId: formaggiCat.id,
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Provola ai ferri',
      nameEn: 'Grilled provola cheese',
      price: 9,
      categoryId: formaggiCat.id,
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Gorgonzola',
      nameEn: 'Gorgonzola cheese',
      price: 6,
      categoryId: formaggiCat.id,
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Mozzarella',
      nameEn: 'Mozzarella cheese',
      price: 5,
      categoryId: formaggiCat.id,
      order: 5,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Formaggi misti',
      nameEn: 'Mixed cheeses',
      price: 7,
      categoryId: formaggiCat.id,
      order: 6,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Mozzarella di bufala',
      nameEn: 'Buffalo milk mozzarella cheese',
      price: 7,
      categoryId: formaggiCat.id,
      order: 7,
    },
  })

  // ==================== PER I PIÙ PICCOLI ====================
  console.log('📝 Creazione Piatti per Bambini...')

  await prisma.dish.create({
    data: {
      name: 'Pasta al pomodoro',
      nameEn: 'Tomato pasta',
      price: 7,
      categoryId: bambiniCat.id,
      order: 1,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Pasta al pesto',
      nameEn: 'Pasta with pesto sauce',
      price: 8,
      categoryId: bambiniCat.id,
      order: 2,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Hamburger & patatine',
      nameEn: 'Hamburger & chips',
      price: 12,
      categoryId: bambiniCat.id,
      order: 3,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Cotoletta e Patatine',
      nameEn: 'Cutlet & chips',
      price: 12,
      categoryId: bambiniCat.id,
      order: 4,
    },
  })

  console.log('✅ TUTTI i piatti sono stati creati!')
  console.log(`
  📊 RIEPILOGO:
  ✅ 1 Admin
  ✅ 10 Categorie
  ✅ ${await prisma.dish.count()} Piatti totali

  🎉 Database popolato con successo!
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
