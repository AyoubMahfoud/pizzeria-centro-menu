import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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
    const { name, nameEn, description, order } = data

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        nameEn: nameEn || null,
        description: description || null,
        order: order || 0,
      },
    })

    // Revalidate all paths to refresh cache
    revalidatePath('/')
    revalidatePath('/admin')

    return NextResponse.json(category)
  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento della categoria' },
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

    await prisma.category.delete({
      where: { id },
    })

    // Revalidate all paths to refresh cache
    revalidatePath('/')
    revalidatePath('/admin')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione della categoria' },
      { status: 500 }
    )
  }
}
