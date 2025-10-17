import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/jwt'
import { handleCategoryOrder } from '@/lib/orderUtils'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0


export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { dishes: true },
        },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero delle categorie' },
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
    const { name, nameEn, description, order } = data

    // Gestire l'ordinamento automatico
    const finalOrder = await handleCategoryOrder(order)

    const category = await prisma.category.create({
      data: {
        name,
        nameEn: nameEn || null,
        description: description || null,
        order: finalOrder,
      },
    })

    // Revalidate all paths to refresh cache
    revalidatePath('/')
    revalidatePath('/admin')

    return NextResponse.json(category)
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Errore nella creazione della categoria' },
      { status: 500 }
    )
  }
}
