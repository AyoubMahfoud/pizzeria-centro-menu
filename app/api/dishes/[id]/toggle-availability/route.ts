import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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

    const dish = await prisma.dish.findUnique({
      where: { id },
    })

    if (!dish) {
      return NextResponse.json({ error: 'Piatto non trovato' }, { status: 404 })
    }

    const updated = await prisma.dish.update({
      where: { id },
      data: {
        available: !dish.available,
      },
    })

    // Revalidate all paths to refresh cache
    revalidatePath('/')
    revalidatePath('/admin')

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Toggle dish availability error:', error)
    return NextResponse.json(
      { error: 'Errore nel cambio di disponibilità' },
      { status: 500 }
    )
  }
}
