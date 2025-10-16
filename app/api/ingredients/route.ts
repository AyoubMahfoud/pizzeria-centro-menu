import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0


export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { dishes: true },
        },
      },
    })

    return NextResponse.json(ingredients)
  } catch (error) {
    console.error('Get ingredients error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero degli ingredienti' },
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
    const { name } = data

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        available: true,
      },
    })

    // Revalidate all paths to refresh cache
    revalidatePath('/')
    revalidatePath('/admin')

    return NextResponse.json(ingredient)
  } catch (error) {
    console.error('Create ingredient error:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione dell\'ingrediente' },
      { status: 500 }
    )
  }
}
