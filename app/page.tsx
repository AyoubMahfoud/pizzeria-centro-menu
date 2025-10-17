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
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 via-transparent to-amber-50/30"></div>
        <div className="relative container mx-auto px-4 py-5 sm:py-7">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {/* Premium Logo Badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl blur-lg opacity-40 animate-pulse"></div>
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-orange-600 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <ChefHat className="w-7 h-7 sm:w-9 sm:h-9 text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Premium Title */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 bg-clip-text text-transparent tracking-tight">
                Pizzeria Centro
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-red-400"></div>
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-[0.2em] font-light">Menu Digitale Premium</p>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-red-400"></div>
              </div>
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
                      <p className="text-sm text-gray-600 font-light">Disponibile con supplemento</p>
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
        <div className="space-y-12" id="menu-categories">
          {categoriesWithDishes.map((category, idx) => (
            <section
              key={category.id}
              id={`category-${category.id}`}
              className="animate-fade-in scroll-mt-24"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Premium Category Header */}
              <div className="mb-6 sm:mb-8">
                <div className="relative inline-block">
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-red-500/20 via-red-600/30 to-orange-500/20 blur-sm"></div>
                  <h2 className="relative text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 bg-clip-text text-transparent pb-3 border-b-2 border-red-600">
                    {category.name}
                  </h2>
                </div>
                {category.nameEn && (
                  <p className="text-base sm:text-lg text-gray-500 italic mt-3 font-light tracking-wide">{category.nameEn}</p>
                )}
                {category.description && (
                  <p className="text-sm sm:text-base text-amber-800 mt-3 font-light break-words bg-amber-50/50 px-4 py-2 rounded-lg border-l-2 border-amber-400">
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
                      className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-5 sm:p-6 border border-gray-200/50 w-full min-h-[100px] hover:scale-[1.02] hover:-translate-y-1 ${
                        !isDishAvailable ? 'opacity-50 grayscale' : ''
                      }`}
                    >
                      {/* Gradient Background Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 via-transparent to-amber-50/0 group-hover:from-red-50/50 group-hover:to-amber-50/30 transition-all duration-500"></div>

                      {/* Premium Border Shine */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-red-200/0 to-transparent group-hover:via-red-200/50 transition-all duration-700"></div>

                      <div className="relative flex justify-between items-start gap-3 sm:gap-4 w-full">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900 break-words group-hover:text-red-900 transition-colors duration-300">
                              {dish.name}
                            </h3>
                            {allergens.length > 0 && (
                              <a
                                href="#allergens-section"
                                className="mt-1 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 hover:bg-gray-500 hover:scale-110 transition-all duration-200"
                                title="Contiene allergeni - clicca per vedere la legenda"
                                aria-label="Visualizza allergeni"
                              >
                                !
                              </a>
                            )}
                          </div>

                          {dish.nameEn && (
                            <p className="text-sm sm:text-base text-gray-400 italic mt-1 break-words font-light tracking-wide">
                              {dish.nameEn}
                            </p>
                          )}

                          {dish.description && (
                            <p className="text-sm sm:text-base text-gray-700 mt-3 break-words font-light leading-relaxed">
                              {dish.description}
                            </p>
                          )}

                          {dish.descriptionEn && (
                            <p className="text-xs sm:text-sm text-gray-400 italic mt-2 break-words font-light">
                              {dish.descriptionEn}
                            </p>
                          )}

                          {!isDishAvailable && (
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-300 rounded-full">
                              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                              <p className="text-xs sm:text-sm text-red-700 font-medium">
                                Non disponibile
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Premium Price Badge */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            <Euro className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" strokeWidth={2.5} />
                            <span className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
                              {dish.price % 1 === 0
                                ? dish.price.toString()
                                : dish.price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Premium Allergen Section */}
        <section className="mt-20 mb-12" id="allergens-section">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-2 border-orange-200/50 shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl"></div>

            <div className="relative p-4 sm:p-8 lg:p-12">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">⚠️</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold bg-gradient-to-r from-gray-900 via-orange-900 to-gray-900 bg-clip-text text-transparent mb-2 sm:mb-3 px-2">
                  Informazioni Allergeni
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-light max-w-3xl mx-auto px-4">
                  I piatti contrassegnati con il simbolo <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-400 text-white text-xs font-bold mx-1">!</span> contengono allergeni.
                  <br className="hidden sm:block" />
                  <span className="hidden sm:inline">Consulta la lista completa qui sotto secondo il Regolamento UE 1169/2011.</span>
                </p>
              </div>

              {/* Allergen Legend Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
                {[
                  { number: '1', name: 'Glutine', icon: '🌾', desc: 'Cereali contenenti glutine' },
                  { number: '2', name: 'Crostacei', icon: '🦐', desc: 'e prodotti derivati' },
                  { number: '3', name: 'Uova', icon: '🥚', desc: 'e prodotti derivati' },
                  { number: '4', name: 'Pesce', icon: '🐟', desc: 'e prodotti derivati' },
                  { number: '5', name: 'Arachidi', icon: '🥜', desc: 'e prodotti derivati' },
                  { number: '6', name: 'Soia', icon: '🫘', desc: 'e prodotti derivati' },
                  { number: '7', name: 'Latte', icon: '🥛', desc: 'e prodotti derivati (lattosio)' },
                  { number: '8', name: 'Frutta a guscio', icon: '🌰', desc: 'Noci, mandorle, etc.' },
                  { number: '9', name: 'Sedano', icon: '🥬', desc: 'e prodotti derivati' },
                  { number: '10', name: 'Senape', icon: '🌭', desc: 'e prodotti derivati' },
                  { number: '11', name: 'Semi di sesamo', icon: '🫚', desc: 'e prodotti derivati' },
                  { number: '12', name: 'Anidride solforosa', icon: '💨', desc: 'e solfiti (>10mg/kg)' },
                  { number: '13', name: 'Lupini', icon: '🫘', desc: 'e prodotti derivati' },
                  { number: '14', name: 'Molluschi', icon: '🦑', desc: 'e prodotti derivati' },
                ].map((allergen) => (
                  <div
                    key={allergen.number}
                    className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-200/50 p-3 sm:p-4 lg:p-5 hover:shadow-xl transition-all duration-300 sm:hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-amber-50/0 group-hover:from-orange-50/50 group-hover:to-amber-50/50 transition-all duration-300"></div>

                    <div className="relative flex items-start gap-2 sm:gap-3 lg:gap-4">
                      {/* Number Badge */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">{allergen.number}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                          <span className="text-xl sm:text-2xl">{allergen.icon}</span>
                          <h3 className="font-serif font-bold text-gray-900 text-sm sm:text-base lg:text-lg">{allergen.name}</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 font-light">{allergen.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Notice */}
              <div className="mt-6 sm:mt-10 p-4 sm:p-6 bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-orange-300/50">
                <p className="text-xs sm:text-sm text-gray-700 text-center font-light leading-relaxed">
                  <span className="font-semibold text-orange-900">⚠️ Importante:</span> Se soffri di allergie o intolleranze alimentari,
                  <span className="font-semibold"> comunica sempre le tue esigenze al nostro staff</span> prima di ordinare.
                  Alcuni piatti potrebbero contenere tracce di altri allergeni a causa della preparazione in cucina condivisa.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="relative mt-20 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"></div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Logo Section */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-xl">
                <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-white">Pizzeria Centro</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Tradizione & Qualità</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-red-500"></div>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-sm text-gray-400 font-light">
                © {new Date().getFullYear()} Pizzeria Centro · Menu Digitale TheWolf
              </p>
              <p className="text-xs text-gray-500 mt-2 font-light">
                Con passione dal cuore di Novara
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
