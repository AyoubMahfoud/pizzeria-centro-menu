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
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Pizzeria Centro
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">Menu Digitale</p>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="container mx-auto px-4 py-4 max-w-5xl relative">
        <CategoryNavigation categories={categoriesWithDishes} />
      </div>

      {/* Menu Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Premium Info Sections */}
        <div className="mb-8 sm:mb-12 space-y-6">
          {/* Coperto - Elegant Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 via-white to-amber-50 shadow-lg border border-amber-200/50">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600"></div>
            <div className="p-5 sm:p-6 pl-6 sm:pl-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base text-gray-800 font-light">
                    Coperto <span className="ml-2 text-lg sm:text-xl font-serif font-medium text-amber-900">€2,50</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2 font-light tracking-wide">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">'c'</span>
                    <span className="mx-1.5 text-gray-400">·</span>
                    alimenti surgelati
                    <span className="mx-2 text-amber-400">•</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">'f'</span>
                    <span className="mx-1.5 text-gray-400">·</span>
                    alimenti freschi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pizza al Metro - Premium Card */}
          <div className="relative overflow-hidden rounded-xl bg-white shadow-xl border border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-100 to-yellow-100 rounded-full blur-3xl opacity-40"></div>

            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🍕</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">Pizza al Metro</h3>
                  <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest font-light">Con Farina Integrale</p>
                </div>
              </div>

              <div className="mb-5 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/30">
                <p className="text-xs sm:text-sm text-amber-900 italic font-light text-center">
                  Dal lunedì al venerdì <span className="mx-2">·</span> Escluso il sabato sera
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="group hover:scale-105 transition-transform duration-300">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 font-light">1 Metro Margherita</p>
                    <p className="text-2xl font-serif font-bold text-gray-900">€25</p>
                  </div>
                </div>
                <div className="group hover:scale-105 transition-transform duration-300">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 font-light">1/2 Metro Margherita</p>
                    <p className="text-2xl font-serif font-bold text-gray-900">€18</p>
                  </div>
                </div>
                <div className="group hover:scale-105 transition-transform duration-300">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/50 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-red-700 mb-1 font-light">1 Metro Farcito</p>
                    <p className="text-2xl font-serif font-bold text-red-900">€41</p>
                  </div>
                </div>
                <div className="group hover:scale-105 transition-transform duration-300">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/50 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-red-700 mb-1 font-light">1/2 Metro Farcito</p>
                    <p className="text-2xl font-serif font-bold text-red-900">€28</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 font-light">
                  Aggiunte speciali <span className="text-gray-400">·</span> Frutti di mare o funghi porcini
                  <span className="ml-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-medium text-xs">€5 ogni 1/4</span>
                </p>
              </div>
            </div>
          </div>

          {/* Opzioni Impasto - Premium Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-xl border border-slate-200/50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>

            <div className="p-6 sm:p-8 pt-8">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">✨</span> Opzioni Impasto
              </h3>

              <div className="space-y-4">
                <div className="group p-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 group-hover:scale-150 transition-transform"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">Impasto Integrale</p>
                      <p className="text-sm text-gray-600 font-light">Disponibile su richiesta per un'esperienza più salutare</p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-300">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 group-hover:scale-150 transition-transform"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">Pizza Senza Glutine</p>
                      <p className="text-sm text-gray-600 font-light">Disponibile con supplemento <span className="text-gray-400">·</span> Contattaci per informazioni</p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600 mt-2 group-hover:scale-150 transition-transform"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="font-semibold text-gray-900">Calzone Vesuvio</p>
                        <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold shadow-lg">+€2</span>
                      </div>
                      <p className="text-sm text-gray-600 font-light mt-1">Doppio impasto per un'esplosione di gusto</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note Prezzi - Elegant Minimal */}
          <div className="relative overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200/50">
            <div className="p-5 sm:p-6">
              <div className="space-y-3 text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                <p className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium flex-shrink-0">*</span>
                  <span>Le pizze baby hanno lo stesso prezzo delle pizze normali</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium flex-shrink-0">**</span>
                  <span>Il prezzo delle aggiunte varia da <span className="font-semibold text-gray-900">€1 a €4</span> in base all'ingrediente scelto</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium flex-shrink-0">***</span>
                  <span>Le aggiunte degli ingredienti sono sommate alla pizza con il prezzo più elevato</span>
                </p>
              </div>
            </div>
          </div>
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
              <div className="mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 border-b-2 border-red-600 pb-2 inline-block">
                  {category.name}
                </h2>
                {category.nameEn && (
                  <p className="text-base sm:text-lg text-gray-600 italic mt-1">{category.nameEn}</p>
                )}
                {category.description && (
                  <p className="text-xs sm:text-sm text-amber-700 mt-2 font-medium break-words">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Dishes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
                      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 sm:p-5 border border-gray-100 w-full min-h-[100px] ${
                        !isDishAvailable ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 sm:gap-3 w-full">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                              {dish.name}
                            </h3>
                            {allergens.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {allergens.map((allergen) => (
                                  <span
                                    key={allergen}
                                    className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded whitespace-nowrap"
                                  >
                                    {allergen}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {dish.nameEn && (
                            <p className="text-xs sm:text-sm text-gray-500 italic mt-0.5 break-words">
                              {dish.nameEn}
                            </p>
                          )}

                          {dish.description && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-2 break-words">
                              {dish.description}
                            </p>
                          )}

                          {dish.descriptionEn && (
                            <p className="text-xs text-gray-500 italic mt-1 break-words">
                              {dish.descriptionEn}
                            </p>
                          )}

                          {!isDishAvailable && (
                            <p className="text-xs sm:text-sm text-red-600 font-medium mt-2">
                              Non disponibile
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-0.5 sm:gap-1 text-base sm:text-lg font-bold text-red-600 whitespace-nowrap flex-shrink-0">
                          <Euro className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>
                            {dish.price % 1 === 0
                              ? dish.price.toString()
                              : dish.price.toFixed(2).replace('.', ',')}
                          </span>
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
