'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Category {
  id: string
  name: string
  nameEn?: string | null
}

interface CategoryNavigationProps {
  categories: Category[]
}

export function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      const offset = 100 // Offset per l'header sticky
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full max-w-xs mx-auto mt-4">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors duration-200"
      >
        <span className="font-medium">Vai a categoria...</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay per chiudere quando si clicca fuori */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{category.name}</div>
                {category.nameEn && (
                  <div className="text-sm text-gray-500 italic">{category.nameEn}</div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
