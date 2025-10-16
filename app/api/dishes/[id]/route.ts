import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/jwt'

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

    // Eliminare le vecchie relazioni ingredienti
    await prisma.dishIngredient.deleteMany({
      where: { dishId: id },
    })

    // Aggiornare il piatto con i nuovi ingredienti
    const dish = await prisma.dish.update({
      where: { id },
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

    return NextResponse.json(dish)
  } catch (error) {
    console.error('Update dish error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento del piatto' },
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

    await prisma.dish.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete dish error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione del piatto' },
      { status: 500 }
    )
  }
}
