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

  if (!categories || categories.length === 0) {
    return null
  }

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
    <div className="relative w-full max-w-md mx-auto mt-6 z-50">
      {/* Premium Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-full overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-600"></div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-700 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

        <div className="relative flex items-center justify-between gap-3 px-6 py-4">
          <span className="text-base font-serif font-semibold text-white tracking-wide">Vai a categoria...</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ChevronDown
                className={`w-5 h-5 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Premium Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute z-50 w-full mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 max-h-[28rem] overflow-hidden animate-in slide-in-from-top-2 duration-300">
            {/* Gradient Header */}
            <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {categories.length === 0 && (
                <div className="px-6 py-8 text-gray-500 text-center font-light">
                  Nessuna categoria disponibile
                </div>
              )}
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className="group/item w-full text-left px-6 py-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-300 border-b border-gray-100 last:border-b-0 relative overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover Indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-orange-600 transform scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-top"></div>

                  <div className="relative pl-2">
                    <div className="font-serif font-bold text-gray-900 group-hover/item:text-red-900 transition-colors duration-300 text-lg">
                      {category.name}
                    </div>
                    {category.nameEn && (
                      <div className="text-sm text-gray-500 italic mt-0.5 font-light group-hover/item:text-gray-700 transition-colors">
                        {category.nameEn}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
