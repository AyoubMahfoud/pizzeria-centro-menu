import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
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

  console.log('Admin creato:', admin.email)

  // Creare categorie
  const antipastiCat = await prisma.category.create({
    data: {
      name: 'Antipasti',
      nameEn: 'Appetizers',
      order: 1,
    },
  })

  const insalatoneCat = await prisma.category.create({
    data: {
      name: 'Insalatone o Piatto unico',
      nameEn: 'Large Salads or Single Dish',
      order: 2,
    },
  })

  const primiCat = await prisma.category.create({
    data: {
      name: 'Primi Piatti',
      nameEn: 'First Courses',
      order: 3,
    },
  })

  const primiMareCat = await prisma.category.create({
    data: {
      name: 'Primi di Mare',
      nameEn: 'Seafood First Courses',
      order: 4,
    },
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
    data: {
      name: 'Secondi Piatti di Pesce',
      nameEn: 'Fish Main Courses',
      order: 6,
    },
  })

  const secondiCarneCat = await prisma.category.create({
    data: {
      name: 'Secondi piatti di Carne',
      nameEn: 'Meat Main Courses',
      order: 7,
    },
  })

  const contorniCat = await prisma.category.create({
    data: {
      name: 'Contorni',
      nameEn: 'Side Dishes',
      order: 8,
    },
  })

  const formaggiCat = await prisma.category.create({
    data: {
      name: 'Formaggi',
      nameEn: 'Cheeses',
      order: 9,
    },
  })

  const bambiniCat = await prisma.category.create({
    data: {
      name: 'Per i più piccoli',
      nameEn: 'For the Little Ones',
      order: 10,
    },
  })

  console.log('Categorie create')

  // Creare ingredienti comuni
  const prosciuttoCrudo = await prisma.ingredient.create({ data: { name: 'Prosciutto Crudo' } })
  const mozzarella = await prisma.ingredient.create({ data: { name: 'Mozzarella' } })
  const bufala = await prisma.ingredient.create({ data: { name: 'Mozzarella di Bufala' } })
  const bresaola = await prisma.ingredient.create({ data: { name: 'Bresaola' } })
  const rucola = await prisma.ingredient.create({ data: { name: 'Rucola' } })
  const grana = await prisma.ingredient.create({ data: { name: 'Grana Padano' } })
  const gamberetti = await prisma.ingredient.create({ data: { name: 'Gamberetti' } })
  const polipo = await prisma.ingredient.create({ data: { name: 'Polipo' } })
  const insalataMista = await prisma.ingredient.create({ data: { name: 'Insalata Mista' } })
  const radicchio = await prisma.ingredient.create({ data: { name: 'Radicchio' } })

  console.log('Ingredienti creati')

  // Creare alcuni piatti di esempio (Antipasti)
  await prisma.dish.create({
    data: {
      name: 'Prosciutto Crudo',
      nameEn: 'Ham',
      price: 10,
      categoryId: antipastiCat.id,
      order: 1,
      ingredients: {
        create: [
          { ingredientId: prosciuttoCrudo.id },
        ],
      },
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Bresaola Rucola e Grana',
      nameEn: 'Bresaola Rocket and Parmesan Cheese',
      price: 15,
      categoryId: antipastiCat.id,
      order: 2,
      ingredients: {
        create: [
          { ingredientId: bresaola.id },
          { ingredientId: rucola.id },
          { ingredientId: grana.id },
        ],
      },
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Crudo e Bufala',
      nameEn: 'Ham and Buffalo Milk Mozzarella Cheese',
      price: 15,
      categoryId: antipastiCat.id,
      order: 3,
      ingredients: {
        create: [
          { ingredientId: prosciuttoCrudo.id },
          { ingredientId: bufala.id },
        ],
      },
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Insalata di Mare',
      nameEn: 'Sea Food Salad',
      price: 19,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 4,
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Cocktail Gamberi',
      nameEn: 'Prawn Cocktail',
      price: 16,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 5,
      ingredients: {
        create: [
          { ingredientId: gamberetti.id },
        ],
      },
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Polipo alla contadina',
      nameEn: 'Polyp with potatoes',
      price: 19,
      categoryId: antipastiCat.id,
      allergens: JSON.stringify(['c', 'f']),
      order: 6,
      ingredients: {
        create: [
          { ingredientId: polipo.id },
        ],
      },
    },
  })

  // Insalatone
  await prisma.dish.create({
    data: {
      name: 'Insalatona Mista',
      nameEn: 'Large Mixed Salad',
      description: 'Insalata verde, carote, sedano, rucola, pomodori',
      descriptionEn: 'Lettuce, carrots, celery, rocket, tomatoes',
      price: 6,
      categoryId: insalatoneCat.id,
      order: 1,
      ingredients: {
        create: [
          { ingredientId: insalataMista.id },
          { ingredientId: rucola.id },
        ],
      },
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
      ingredients: {
        create: [
          { ingredientId: insalataMista.id },
          { ingredientId: mozzarella.id },
        ],
      },
    },
  })

  // Primi Piatti
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
      ingredients: {
        create: [
          { ingredientId: mozzarella.id },
        ],
      },
    },
  })

  // Primi di Mare
  await prisma.dish.create({
    data: {
      name: 'Scialatielli all\'amalfitana',
      nameEn: 'Scialatielli all\'amalfitana',
      description: 'con vongole, menta e limone tipico della Costa d\'Amalfi',
      descriptionEn: 'with clams, mint and lemon typical of the Amalfi Coast',
      price: 16,
      categoryId: primiMareCat.id,
      order: 1,
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
      order: 2,
    },
  })

  // Risotti
  await prisma.dish.create({
    data: {
      name: 'Risotto con scamorza affumicata e radicchio',
      nameEn: 'Rice with smoked scamorza cheese and chicory',
      price: 11,
      categoryId: risottiCat.id,
      order: 1,
      ingredients: {
        create: [
          { ingredientId: radicchio.id },
        ],
      },
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

  // Secondi di Pesce
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
      name: 'Frittura di gamberi',
      nameEn: 'Fried prawns',
      price: 19,
      categoryId: secondiPesceCat.id,
      allergens: JSON.stringify(['c']),
      order: 2,
      ingredients: {
        create: [
          { ingredientId: gamberetti.id },
        ],
      },
    },
  })

  // Secondi di Carne
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
      name: 'Filetto all\'aceto balsamico',
      nameEn: 'Fillet with balsamic vinegar',
      price: 24,
      categoryId: secondiCarneCat.id,
      order: 2,
    },
  })

  // Contorni
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
      name: 'Verdure grigliate',
      nameEn: 'Grilled vegetables',
      price: 5,
      categoryId: contorniCat.id,
      order: 2,
    },
  })

  // Formaggi
  await prisma.dish.create({
    data: {
      name: 'Mozzarella',
      nameEn: 'Mozzarella cheese',
      price: 5,
      categoryId: formaggiCat.id,
      order: 1,
      ingredients: {
        create: [
          { ingredientId: mozzarella.id },
        ],
      },
    },
  })

  await prisma.dish.create({
    data: {
      name: 'Mozzarella di bufala',
      nameEn: 'Buffalo milk mozzarella cheese',
      price: 7,
      categoryId: formaggiCat.id,
      order: 2,
      ingredients: {
        create: [
          { ingredientId: bufala.id },
        ],
      },
    },
  })

  // Bambini
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
      name: 'Hamburger & patatine',
      nameEn: 'Hamburger & chips',
      price: 12,
      categoryId: bambiniCat.id,
      order: 2,
    },
  })

  console.log('Piatti di esempio creati!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
