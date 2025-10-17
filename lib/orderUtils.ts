import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Gestisce l'ordinamento automatico per le categorie
 * - Se order è null/undefined, mette la categoria alla fine
 * - Se order esiste già, sposta quella vecchia e tutte le successive di +1
 */
export async function handleCategoryOrder(
  order: number | null | undefined,
  categoryId?: string
): Promise<number> {
  // Se order non è specificato, metti alla fine
  if (order === null || order === undefined) {
    const maxOrder = await prisma.category.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })
    return (maxOrder?.order ?? -1) + 1
  }

  // Se stiamo aggiornando una categoria esistente con lo stesso order, non fare nulla
  if (categoryId) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { order: true }
    })
    if (existingCategory?.order === order) {
      return order
    }
  }

  // Controlla se esiste già una categoria con questo order
  const existingWithOrder = await prisma.category.findFirst({
    where: {
      order: order,
      ...(categoryId ? { id: { not: categoryId } } : {})
    }
  })

  // Se esiste, sposta quella e tutte le successive di +1
  if (existingWithOrder) {
    await prisma.category.updateMany({
      where: {
        order: { gte: order },
        ...(categoryId ? { id: { not: categoryId } } : {})
      },
      data: {
        order: {
          increment: 1
        }
      }
    })
  }

  return order
}

/**
 * Gestisce l'ordinamento automatico per i piatti
 * - Se order è null/undefined, mette il piatto alla fine della sua categoria
 * - Se order esiste già nella stessa categoria, sposta quello vecchio e tutti i successivi di +1
 */
export async function handleDishOrder(
  categoryId: string,
  order: number | null | undefined,
  dishId?: string
): Promise<number> {
  // Se order non è specificato, metti alla fine della categoria
  if (order === null || order === undefined) {
    const maxOrder = await prisma.dish.findFirst({
      where: { categoryId },
      orderBy: { order: 'desc' },
      select: { order: true }
    })
    return (maxOrder?.order ?? -1) + 1
  }

  // Se stiamo aggiornando un piatto esistente con lo stesso order, non fare nulla
  if (dishId) {
    const existingDish = await prisma.dish.findUnique({
      where: { id: dishId },
      select: { order: true, categoryId: true }
    })
    if (existingDish?.order === order && existingDish?.categoryId === categoryId) {
      return order
    }
  }

  // Controlla se esiste già un piatto con questo order nella stessa categoria
  const existingWithOrder = await prisma.dish.findFirst({
    where: {
      categoryId,
      order: order,
      ...(dishId ? { id: { not: dishId } } : {})
    }
  })

  // Se esiste, sposta quello e tutti i successivi nella stessa categoria di +1
  if (existingWithOrder) {
    await prisma.dish.updateMany({
      where: {
        categoryId,
        order: { gte: order },
        ...(dishId ? { id: { not: dishId } } : {})
      },
      data: {
        order: {
          increment: 1
        }
      }
    })
  }

  return order
}

