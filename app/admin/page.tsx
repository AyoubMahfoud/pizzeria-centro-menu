'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChefHat,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  List,
  UtensilsCrossed,
  Search,
  QrCode,
} from 'lucide-react'
import Modal from '@/components/modals/Modal'

interface Category {
  id: string
  name: string
  nameEn?: string
  description?: string
  order: number
  _count: { dishes: number }
}

interface Ingredient {
  id: string
  name: string
  available: boolean
  _count: { dishes: number }
}

interface Dish {
  id: string
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  price: number
  categoryId: string
  allergens?: string
  available: boolean
  order: number
  category: { name: string }
  ingredients: Array<{
    ingredient: { id: string; name: string; available: boolean }
  }>
}

type TabType = 'dishes' | 'categories' | 'ingredients'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('dishes')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])

  // Modali
  const [showDishModal, setShowDishModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'dish' | 'category' | 'ingredient', id: string, name: string } | null>(null)

  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)

  useEffect(() => {
    checkAuth()
    loadData()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check')
      if (!res.ok) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setUser(data.user)
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [categoriesRes, ingredientsRes, dishesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/ingredients'),
        fetch('/api/dishes'),
      ])

      const [categoriesData, ingredientsData, dishesData] = await Promise.all([
        categoriesRes.json(),
        ingredientsRes.json(),
        dishesRes.json(),
      ])

      setCategories(categoriesData)
      setIngredients(ingredientsData)
      setDishes(dishesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const handleSaveDish = async (data: any) => {
    try {
      const url = editingDish ? `/api/dishes/${editingDish.id}` : '/api/dishes'
      const method = editingDish ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Errore nel salvataggio')

      setShowDishModal(false)
      setEditingDish(null)
      loadData()
    } catch (error) {
      console.error('Error saving dish:', error)
      alert('Errore nel salvataggio del piatto')
    }
  }

  const handleDeleteDish = async (id: string) => {
    const dish = dishes.find(d => d.id === id)
    if (!dish) return

    setDeleteTarget({ type: 'dish', id, name: dish.name })
    setShowDeleteConfirm(true)
  }

  const handleDeleteDishConfirm = async () => {
    if (!deleteTarget || deleteTarget.type !== 'dish') return

    try {
      const res = await fetch(`/api/dishes/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Errore nell\'eliminazione')
      loadData()
      setShowDeleteConfirm(false)
      setDeleteTarget(null)
    } catch (error) {
      console.error('Error deleting dish:', error)
      alert('Errore nell\'eliminazione del piatto')
    }
  }

  const handleToggleDishAvailability = async (id: string) => {
    try {
      const res = await fetch(`/api/dishes/${id}/toggle-availability`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Errore nel cambio di disponibilità')
      loadData()
    } catch (error) {
      console.error('Error toggling dish availability:', error)
    }
  }

  const handleSaveCategory = async (data: any) => {
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Errore nel salvataggio')

      setShowCategoryModal(false)
      setEditingCategory(null)
      loadData()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Errore nel salvataggio della categoria')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const category = categories.find(c => c.id === id)
    if (!category) return

    setDeleteTarget({ type: 'category', id, name: category.name })
    setShowDeleteConfirm(true)
  }

  const handleDeleteCategoryConfirm = async () => {
    if (!deleteTarget || deleteTarget.type !== 'category') return

    try {
      const res = await fetch(`/api/categories/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Errore nell\'eliminazione')
      loadData()
      setShowDeleteConfirm(false)
      setDeleteTarget(null)
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Errore nell\'eliminazione della categoria')
    }
  }

  const handleSaveIngredient = async (data: any) => {
    try {
      const url = editingIngredient
        ? `/api/ingredients/${editingIngredient.id}`
        : '/api/ingredients'
      const method = editingIngredient ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Errore nel salvataggio')

      setShowIngredientModal(false)
      setEditingIngredient(null)
      loadData()
    } catch (error) {
      console.error('Error saving ingredient:', error)
      alert('Errore nel salvataggio dell\'ingrediente')
    }
  }

  const handleToggleIngredientAvailability = async (id: string) => {
    try {
      const res = await fetch(`/api/ingredients/${id}/toggle-availability`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Errore nel cambio di disponibilità')
      loadData()
    } catch (error) {
      console.error('Error toggling ingredient availability:', error)
    }
  }

  const handleDeleteIngredient = async (id: string) => {
    const ingredient = ingredients.find(i => i.id === id)
    if (!ingredient) return

    setDeleteTarget({ type: 'ingredient', id, name: ingredient.name })
    setShowDeleteConfirm(true)
  }

  const handleDeleteIngredientConfirm = async () => {
    if (!deleteTarget || deleteTarget.type !== 'ingredient') return

    try {
      const res = await fetch(`/api/ingredients/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Errore nell\'eliminazione')
      loadData()
      setShowDeleteConfirm(false)
      setDeleteTarget(null)
    } catch (error) {
      console.error('Error deleting ingredient:', error)
      alert('Errore nell\'eliminazione dell\'ingrediente')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-12 h-12 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Pizzeria Centro</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Visualizza Menu
              </a>
              <a
                href="/qrcode"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </a>
              <div className="border-l pl-4">
                <p className="text-sm text-gray-600">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4" />
                Esci
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('dishes')}
              className={`flex items-center gap-2 py-4 border-b-2 transition ${
                activeTab === 'dishes'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              Piatti ({dishes.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 py-4 border-b-2 transition ${
                activeTab === 'categories'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-5 h-5" />
              Categorie ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex items-center gap-2 py-4 border-b-2 transition ${
                activeTab === 'ingredients'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              Ingredienti ({ingredients.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dishes' && (
          <DishesTab
            dishes={dishes}
            categories={categories}
            onAdd={() => {
              setEditingDish(null)
              setShowDishModal(true)
            }}
            onEdit={(dish: Dish) => {
              setEditingDish(dish)
              setShowDishModal(true)
            }}
            onDelete={handleDeleteDish}
            onToggleAvailability={handleToggleDishAvailability}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesTab
            categories={categories}
            onAdd={() => {
              setEditingCategory(null)
              setShowCategoryModal(true)
            }}
            onEdit={(category) => {
              setEditingCategory(category)
              setShowCategoryModal(true)
            }}
            onDelete={handleDeleteCategory}
          />
        )}

        {activeTab === 'ingredients' && (
          <IngredientsTab
            ingredients={ingredients}
            onAdd={() => {
              setEditingIngredient(null)
              setShowIngredientModal(true)
            }}
            onEdit={(ingredient) => {
              setEditingIngredient(ingredient)
              setShowIngredientModal(true)
            }}
            onDelete={handleDeleteIngredient}
            onToggleAvailability={handleToggleIngredientAvailability}
          />
        )}
      </main>

      {/* Modali */}
      {showDishModal && (
        <DishModal
          dish={editingDish}
          categories={categories}
          ingredients={ingredients}
          onClose={() => {
            setShowDishModal(false)
            setEditingDish(null)
          }}
          onSave={handleSaveDish}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowCategoryModal(false)
            setEditingCategory(null)
          }}
          onSave={handleSaveCategory}
        />
      )}

      {showIngredientModal && (
        <IngredientModal
          ingredient={editingIngredient}
          onClose={() => {
            setShowIngredientModal(false)
            setEditingIngredient(null)
          }}
          onSave={handleSaveIngredient}
        />
      )}

      {showDeleteConfirm && deleteTarget && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowDeleteConfirm(false)
            setDeleteTarget(null)
          }}
          title="Conferma Eliminazione"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Sei sicuro di voler eliminare{' '}
              <span className="font-bold">"{deleteTarget.name}"</span>?
            </p>

            {deleteTarget.type === 'category' && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                ⚠️ Attenzione: Verranno eliminati anche tutti i piatti associati a questa categoria!
              </p>
            )}

            {deleteTarget.type === 'ingredient' && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                ⚠️ Questo ingrediente sarà rimosso da tutti i piatti che lo utilizzano.
              </p>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteTarget(null)
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  if (deleteTarget.type === 'dish') handleDeleteDishConfirm()
                  else if (deleteTarget.type === 'category') handleDeleteCategoryConfirm()
                  else if (deleteTarget.type === 'ingredient') handleDeleteIngredientConfirm()
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Elimina
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// Component tabs
function DishesTab({
  dishes,
  categories,
  onAdd,
  onEdit,
  onDelete,
  onToggleAvailability,
}: any) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDishes = dishes.filter((dish: Dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dish.nameEn && dish.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestione Piatti</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Aggiungi Piatto
        </button>
      </div>

      {/* Barra di ricerca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca piatto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category: Category) => {
          const categoryDishes = filteredDishes.filter(
            (d: Dish) => d.categoryId === category.id
          )

          if (categoryDishes.length === 0) return null

          return (
            <div key={category.id} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {category.name}
              </h3>
              <div className="space-y-3">
                {categoryDishes.map((dish: Dish) => {
                  const unavailableIngredients = dish.ingredients.filter(
                    (di) => !di.ingredient.available
                  )
                  const hasUnavailableIngredients = unavailableIngredients.length > 0

                  return (
                    <div
                      key={dish.id}
                      className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition ${
                        !dish.available || hasUnavailableIngredients
                          ? 'bg-gray-50'
                          : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900">
                            {dish.name}
                          </h4>
                          <span className="text-red-600 font-bold">
                            €{dish.price.toFixed(2)}
                          </span>
                          {!dish.available && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              Non disponibile
                            </span>
                          )}
                          {hasUnavailableIngredients && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                              Ingredienti mancanti
                            </span>
                          )}
                        </div>
                        {dish.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {dish.description}
                          </p>
                        )}
                        {hasUnavailableIngredients && (
                          <p className="text-xs text-amber-600 mt-1">
                            Ingredienti non disponibili:{' '}
                            {unavailableIngredients
                              .map((i) => i.ingredient.name)
                              .join(', ')}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleAvailability(dish.id)}
                          className={`p-2 rounded-lg transition ${
                            dish.available
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={
                            dish.available
                              ? 'Segna come non disponibile'
                              : 'Segna come disponibile'
                          }
                        >
                          {dish.available ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => onEdit(dish)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(dish.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {filteredDishes.length === 0 && searchQuery && (
          <div className="text-center py-16 glass rounded-xl">
            <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Nessun risultato</p>
            <p className="text-gray-500">Nessun piatto trovato per "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CategoriesTab({ categories, onAdd, onEdit, onDelete }: any) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.nameEn && category.nameEn.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestione Categorie</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Aggiungi Categoria
        </button>
      </div>

      {/* Barra di ricerca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category: Category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                {category.nameEn && (
                  <p className="text-sm text-gray-600 italic">{category.nameEn}</p>
                )}
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Ordine: {category.order}
              </span>
            </div>

            {category.description && (
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                {category._count.dishes} piatt{category._count.dishes === 1 ? 'o' : 'i'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && searchQuery && (
        <div className="text-center py-16 glass rounded-xl">
          <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">Nessun risultato</p>
          <p className="text-gray-500">Nessuna categoria trovata per "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}

function IngredientsTab({
  ingredients,
  onAdd,
  onEdit,
  onDelete,
  onToggleAvailability,
}: any) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredIngredients = ingredients.filter((ingredient: Ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableCount = filteredIngredients.filter((i: Ingredient) => i.available).length
  const unavailableCount = filteredIngredients.length - availableCount

  return (
    <div>
      {/* Header con statistiche */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🧾 Gestione Ingredienti
            </h2>
            <p className="text-gray-600">
              Segna gli ingredienti finiti per disabilitare automaticamente i piatti
            </p>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-xl hover:shadow-lg transition-all duration-300 btn-ripple"
          >
            <Plus className="w-5 h-5" />
            Aggiungi Ingrediente
          </button>
        </div>

        {/* Barra di ricerca */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca ingrediente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Statistiche cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Totale Ingredienti</p>
                <p className="text-3xl font-bold text-gray-900">{ingredients.length}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="glass rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">✅ Disponibili</p>
                <p className="text-3xl font-bold text-green-600">{availableCount}</p>
              </div>
              <Eye className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="glass rounded-xl p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">❌ Finiti</p>
                <p className="text-3xl font-bold text-red-600">{unavailableCount}</p>
              </div>
              <EyeOff className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista ingredienti */}
      <div className="space-y-3">
        {filteredIngredients.map((ingredient: Ingredient, index: number) => (
          <div
            key={ingredient.id}
            className={`card-premium bg-white rounded-xl p-6 animate-slide-in-up stagger-${Math.min(index + 1, 5)} ${
              !ingredient.available ? 'border-l-4 border-red-500 bg-red-50' : 'border-l-4 border-green-500'
            }`}
          >
            <div className="flex items-center justify-between gap-6">
              {/* Nome e info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {ingredient.name}
                  </h3>
                  {ingredient.available ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Disponibile
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold pulse-glow">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      FINITO
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  📋 Usato in <span className="font-bold text-blue-600">{ingredient._count.dishes}</span> piatt{ingredient._count.dishes === 1 ? 'o' : 'i'}
                  {!ingredient.available && ingredient._count.dishes > 0 && (
                    <span className="ml-2 text-red-600 font-semibold">
                      → {ingredient._count.dishes} piatt{ingredient._count.dishes === 1 ? 'o' : 'i'} disabilitato!
                    </span>
                  )}
                </p>
              </div>

              {/* Toggle grande e chiaro */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggleAvailability(ingredient.id)}
                  className={`relative inline-flex h-14 w-28 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                    ingredient.available
                      ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300'
                      : 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
                  }`}
                  title={ingredient.available ? 'Clicca per segnare come FINITO' : 'Clicca per segnare come DISPONIBILE'}
                >
                  <span
                    className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      ingredient.available ? 'translate-x-2' : 'translate-x-16'
                    }`}
                  >
                    {ingredient.available ? (
                      <Eye className="w-10 h-10 p-2 text-green-600" />
                    ) : (
                      <EyeOff className="w-10 h-10 p-2 text-red-600" />
                    )}
                  </span>
                  <span className={`absolute text-xs font-bold text-white ${ingredient.available ? 'right-3' : 'left-3'}`}>
                    {ingredient.available ? 'OK' : 'NO'}
                  </span>
                </button>

                {/* Azioni */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(ingredient)}
                    className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                    title="Modifica ingrediente"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(ingredient.id)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                    title="Elimina ingrediente"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredIngredients.length === 0 && searchQuery && (
          <div className="text-center py-16 glass rounded-xl">
            <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Nessun risultato</p>
            <p className="text-gray-500">Nessun ingrediente trovato per "{searchQuery}"</p>
          </div>
        )}
      </div>

      {ingredients.length === 0 && !searchQuery && (
        <div className="text-center py-16 glass rounded-xl">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">Nessun ingrediente</p>
          <p className="text-gray-500">Aggiungi il primo ingrediente per iniziare</p>
        </div>
      )}
    </div>
  )
}

// Modali
function DishModal({ dish, categories, ingredients, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: dish?.name || '',
    nameEn: dish?.nameEn || '',
    description: dish?.description || '',
    descriptionEn: dish?.descriptionEn || '',
    price: dish?.price || '',
    categoryId: dish?.categoryId || categories[0]?.id || '',
    allergens: dish?.allergens ? JSON.parse(dish.allergens) : [],
    available: dish?.available !== false,
    order: dish?.order || 0,
    ingredientIds: dish?.ingredients?.map((i: any) => i.ingredient.id) || [],
  })

  const allergenOptions = ['c', 'f']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const toggleAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a: string) => a !== allergen)
        : [...prev.allergens, allergen],
    }))
  }

  const toggleIngredient = (ingredientId: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredientIds: prev.ingredientIds.includes(ingredientId)
        ? prev.ingredientIds.filter((id: string) => id !== ingredientId)
        : [...prev.ingredientIds, ingredientId],
    }))
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={dish ? 'Modifica Piatto' : 'Nuovo Piatto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome (EN)
            </label>
            <input
              type="text"
              value={formData.nameEn}
              onChange={(e) =>
                setFormData({ ...formData, nameEn: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrizione
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrizione (EN)
          </label>
          <textarea
            value={formData.descriptionEn}
            onChange={(e) =>
              setFormData({ ...formData, descriptionEn: e.target.value })
            }
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prezzo (€) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
              required
            >
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordine
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergeni
          </label>
          <div className="flex gap-4">
            {allergenOptions.map((allergen) => (
              <label key={allergen} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allergens.includes(allergen)}
                  onChange={() => toggleAllergen(allergen)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">{allergen}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredienti
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
            {ingredients.map((ingredient: Ingredient) => (
              <label
                key={ingredient.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.ingredientIds.includes(ingredient.id)}
                  onChange={() => toggleIngredient(ingredient.id)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">{ingredient.name}</span>
                {!ingredient.available && (
                  <span className="text-xs text-red-600">(non disponibile)</span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) =>
                setFormData({ ...formData, available: e.target.checked })
              }
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Disponibile</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Salva
          </button>
        </div>
      </form>
    </Modal>
  )
}

function CategoryModal({ category, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    nameEn: category?.nameEn || '',
    description: category?.description || '',
    order: category?.order || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={category ? 'Modifica Categoria' : 'Nuova Categoria'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome (EN)
          </label>
          <input
            type="text"
            value={formData.nameEn}
            onChange={(e) =>
              setFormData({ ...formData, nameEn: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrizione
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordine
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Salva
          </button>
        </div>
      </form>
    </Modal>
  )
}

function IngredientModal({ ingredient, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: ingredient?.name || '',
    available: ingredient?.available !== false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={ingredient ? 'Modifica Ingrediente' : 'Nuovo Ingrediente'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) =>
                setFormData({ ...formData, available: e.target.checked })
              }
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Disponibile</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Salva
          </button>
        </div>
      </form>
    </Modal>
  )
}
