import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/jwt'
import { handleDishOrder } from '@/lib/orderUtils'

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

    // Gestire l'ordinamento automatico
    const finalOrder = await handleDishOrder(categoryId, order, id)

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
        order: finalOrder,
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

    // Revalidate all paths to refresh cache
    revalidatePath('/')
    revalidatePath('/admin')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete dish error:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione del piatto' },
      { status: 500 }
    )
  }
}
