import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      orderBy: [{ categoryId: 'asc' }, { order: 'asc' }],
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    })

    return NextResponse.json(dishes)
  } catch (error) {
    console.error('Get dishes error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei piatti' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const data = await request.json()
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      price,
      categoryId,
      allergens,
      available,
      order,
      ingredientIds,
    } = data

    // Creare il piatto con gli ingredienti
    const dish = await prisma.dish.create({
      data: {
        name,
        nameEn: nameEn || null,
        description: description || null,
        descriptionEn: descriptionEn || null,
        price: parseFloat(price),
        categoryId,
        allergens: allergens ? JSON.stringify(allergens) : null,
        available: available !== false,
        order: order || 0,
        ingredients: {
          create: (ingredientIds || []).map((ingredientId: string) => ({
            ingredientId,
          })),
        },
      },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    })

    // Revalidate all paths to refresh cache
    revalidatePath('/')
    revalidatePath('/admin')

    return NextResponse.json(dish)
  } catch (error) {
    console.error('Create dish error:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione del piatto' },
      { status: 500 }
    )
  }
}
