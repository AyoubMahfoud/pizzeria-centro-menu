import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/jwt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()
    const { name, available } = data

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: {
        name,
        available: available !== false,
      },
    })

    return NextResponse.json(ingredient)
  } catch (error) {
    console.error('Update ingredient error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento dell\'ingrediente' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { id } = await params

    await prisma.ingredient.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete ingredient error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione dell\'ingrediente' },
      { status: 500 }
    )
  }
}
