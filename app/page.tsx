import { prisma } from '@/lib/prisma'
import { ChefHat, Euro } from 'lucide-react'
import { CategoryNavigation } from '@/components/CategoryNavigation'

async function getMenuData() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      dishes: {
        where: { available: true },
        orderBy: { order: 'asc' },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      },
    },
  })

  return categories
}

export default async function HomePage() {
  const categories = await getMenuData()

  // Filtrare categorie con piatti disponibili
  const categoriesWithDishes = categories.filter(cat => cat.dishes.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50 overflow-x-hidden w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <ChefHat className="w-8 h-8 text-red-600" />
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Pizzeria Centro
              </h1>
              <p className="text-sm text-gray-600">Menu Digitale</p>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="container mx-auto px-4 py-4 max-w-5xl">
        <CategoryNavigation categories={categoriesWithDishes} />
      </div>

      {/* Menu Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Coperto */}
        <div className="mb-8 p-4 bg-amber-100 border-l-4 border-amber-500 rounded-r-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Coperto:</span> €2,50
          </p>
          <p className="text-xs text-gray-600 mt-1">
            <span className="font-medium">'c'</span> = alimenti surgelati (frozen food) •
            <span className="font-medium ml-2">'f'</span> = alimenti freschi (fresh food)
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {categoriesWithDishes.map((category, idx) => (
            <section
              key={category.id}
              id={`category-${category.id}`}
              className="animate-fade-in scroll-mt-24"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Category Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-1 border-b-2 border-red-600 pb-2 inline-block">
                  {category.name}
                </h2>
                {category.nameEn && (
                  <p className="text-lg text-gray-600 italic mt-1">{category.nameEn}</p>
                )}
                {category.description && (
                  <p className="text-sm text-amber-700 mt-2 font-medium">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Dishes Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {category.dishes.map((dish) => {
                  // Verificare se tutti gli ingredienti sono disponibili
                  const unavailableIngredients = dish.ingredients.filter(
                    (di) => !di.ingredient.available
                  )
                  const isDishAvailable = dish.available && unavailableIngredients.length === 0

                  let allergens: string[] = []
                  try {
                    allergens = dish.allergens ? JSON.parse(dish.allergens) : []
                  } catch (e) {
                    allergens = []
                  }

                  return (
                    <div
                      key={dish.id}
                      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-5 border border-gray-100 ${
                        !isDishAvailable ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {dish.name}
                            </h3>
                            {allergens.length > 0 && (
                              <div className="flex gap-1">
                                {allergens.map((allergen) => (
                                  <span
                                    key={allergen}
                                    className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded"
                                  >
                                    {allergen}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {dish.nameEn && (
                            <p className="text-sm text-gray-500 italic mt-0.5">
                              {dish.nameEn}
                            </p>
                          )}

                          {dish.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {dish.description}
                            </p>
                          )}

                          {dish.descriptionEn && (
                            <p className="text-xs text-gray-500 italic mt-1">
                              {dish.descriptionEn}
                            </p>
                          )}

                          {!isDishAvailable && (
                            <p className="text-sm text-red-600 font-medium mt-2">
                              Non disponibile
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-lg font-bold text-red-600 whitespace-nowrap">
                          <Euro className="w-4 h-4" />
                          {dish.price.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Pizzeria Centro - Menu Digitale Premium
          </p>
        </div>
      </footer>
    </div>
  )
}
