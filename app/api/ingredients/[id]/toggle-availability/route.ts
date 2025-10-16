import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { id } = await params

    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
    })

    if (!ingredient) {
      return NextResponse.json({ error: 'Ingrediente non trovato' }, { status: 404 })
    }

    const updated = await prisma.ingredient.update({
      where: { id },
      data: {
        available: !ingredient.available,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Toggle ingredient availability error:', error)
    return NextResponse.json(
      { error: 'Errore nel cambio di disponibilità' },
      { status: 500 }
    )
  }
}
