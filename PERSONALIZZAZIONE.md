# 🎨 Guida alla Personalizzazione

## 🌈 Cambiare i Colori

### Colore Primario (Rosso)

Il colore rosso principale è definito nel file [tailwind.config.ts](tailwind.config.ts:1).

Per cambiare il colore principale del sito, modifica la palette `primary`:

```typescript
// tailwind.config.ts
colors: {
  primary: {
    50: '#fef2f2',   // Rosso molto chiaro
    100: '#fee2e2',  // Rosso chiaro
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Rosso principale
    600: '#dc2626',  // Rosso scuro (usato per pulsanti)
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',  // Rosso molto scuro
  },
}
```

**Esempio - Cambiare in Blu:**
```typescript
primary: {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',  // Blu principale
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
}
```

### Colori Specifici da Modificare

Se vuoi semplicemente cambiare il rosso con un altro colore, cerca e sostituisci in questi file:

**File da modificare:**
1. [app/page.tsx](app/page.tsx:1) - Menu pubblico
2. [app/admin/page.tsx](app/admin/page.tsx:1) - Dashboard admin
3. [app/admin/login/page.tsx](app/admin/login/page.tsx:1) - Login page

**Classi da cercare:**
- `bg-red-600` → Sfondo rosso
- `text-red-600` → Testo rosso
- `border-red-600` → Bordo rosso
- `hover:bg-red-700` → Hover rosso più scuro
- `from-red-50` → Gradient rosso chiaro

**Cerca e sostituisci:**
- `red-` → `blue-` (per il blu)
- `red-` → `green-` (per il verde)
- `red-` → `purple-` (per il viola)

## 🖼️ Modificare il Logo e il Nome

### Nome del Ristorante

**Menu Pubblico** - [app/page.tsx](app/page.tsx:21)
```tsx
<h1 className="text-3xl md:text-4xl font-bold text-gray-900">
  Pizzeria Centro  {/* ← Cambia qui */}
</h1>
```

**Dashboard Admin** - [app/admin/page.tsx](app/admin/page.tsx:1)
```tsx
<h1 className="text-2xl font-bold text-gray-900">
  Admin Dashboard
</h1>
<p className="text-sm text-gray-600">Pizzeria Centro</p>  {/* ← Cambia qui */}
```

**Login Page** - [app/admin/login/page.tsx](app/admin/login/page.tsx:52)
```tsx
<h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
<p className="text-gray-600 mt-2">Pizzeria Centro - Menu Digitale</p>  {/* ← Cambia qui */}
```

### Aggiungere un Logo Personalizzato

Attualmente viene usata l'icona `ChefHat`. Per usare un'immagine:

1. **Metti il logo in** `public/logo.png`

2. **Sostituisci l'icona con:**
```tsx
// Prima (icona)
<ChefHat className="w-8 h-8 text-red-600" />

// Dopo (immagine)
<Image src="/logo.png" alt="Logo" width={40} height={40} />
```

3. **Importa Image in cima al file:**
```tsx
import Image from 'next/image'
```

## 🎭 Modificare il Coperto

[app/page.tsx](app/page.tsx:37)
```tsx
<p className="text-sm text-gray-700">
  <span className="font-semibold">Coperto:</span> €2,50  {/* ← Cambia qui */}
</p>
```

## 🌐 Testi Multilingua

Per aggiungere/modificare le traduzioni inglesi, modifica:
- Nome piatto EN: Campo `nameEn` nel modale piatti
- Descrizione EN: Campo `descriptionEn` nel modale piatti
- Nome categoria EN: Campo `nameEn` nel modale categorie

## 📐 Layout e Spaziatura

### Cambiare la larghezza massima del menu

[app/page.tsx](app/page.tsx:34)
```tsx
<main className="container mx-auto px-4 py-8 max-w-5xl">
  {/* Cambia max-w-5xl con:
      - max-w-4xl (più stretto)
      - max-w-6xl (più largo)
      - max-w-7xl (molto largo)
  */}
</main>
```

### Modificare il numero di colonne

**Piatti** - [app/page.tsx](app/page.tsx:67)
```tsx
<div className="grid gap-4 md:grid-cols-2">
  {/* Cambia md:grid-cols-2 con:
      - md:grid-cols-1 (una colonna)
      - md:grid-cols-3 (tre colonne)
  */}
</div>
```

## 🔤 Cambiare i Font

Il font attuale è Inter. Per cambiare:

[app/layout.tsx](app/layout.tsx:1)
```tsx
import { Inter } from 'next/font/google'

// Cambia con altri font Google:
import { Roboto, Montserrat, Poppins } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
// Sostituisci con:
const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin']
})
```

## 🎨 Modificare lo Sfondo

### Sfondo del Menu Pubblico

[app/page.tsx](app/page.tsx:16)
```tsx
<div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50">
  {/* Esempi alternativi:
      - bg-white (sfondo bianco semplice)
      - bg-gray-50 (sfondo grigio chiaro)
      - bg-gradient-to-br from-blue-50 via-white to-purple-50 (gradient blu-viola)
  */}
</div>
```

### Sfondo della Dashboard

[app/admin/page.tsx](app/admin/page.tsx:1)
```tsx
<div className="min-h-screen bg-gray-50">
  {/* Cambia bg-gray-50 con il colore desiderato */}
</div>
```

## 🔔 Modificare le Note sugli Allergeni

[app/page.tsx](app/page.tsx:41-44)
```tsx
<p className="text-xs text-gray-600 mt-1">
  <span className="font-medium">'c'</span> = alimenti surgelati (frozen food) •
  <span className="font-medium ml-2">'f'</span> = alimenti freschi (fresh food)
</p>
```

Per aggiungere altri allergeni, modifica la lista nel modale piatti:

[app/admin/page.tsx](app/admin/page.tsx:1) - funzione `DishModal`
```tsx
const allergenOptions = ['c', 'f', 'g', 'l']  // Aggiungi nuovi allergeni
```

## 📱 Modificare il Footer

[app/page.tsx](app/page.tsx:125)
```tsx
<footer className="mt-16 py-8 bg-gray-900 text-white">
  <div className="container mx-auto px-4 text-center">
    <p className="text-sm">
      © {new Date().getFullYear()} Pizzeria Centro - Menu Digitale Premium
    </p>
    {/* Aggiungi qui informazioni aggiuntive, link social, etc. */}
  </div>
</footer>
```

## 🎯 Tips Avanzati

### Aggiungere Animazioni Custom

Definisci nuove animazioni in [app/globals.css](app/globals.css:1):

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

### Modificare le Ombre

Cerca `shadow-` nelle classi CSS e sostituisci con:
- `shadow-sm` - Ombra piccola
- `shadow-md` - Ombra media
- `shadow-lg` - Ombra grande
- `shadow-xl` - Ombra extra grande
- `shadow-2xl` - Ombra massima

### Arrotondare gli Angoli

Cerca `rounded-` e modifica:
- `rounded-sm` - Poco arrotondato
- `rounded-md` - Medio
- `rounded-lg` - Grande
- `rounded-xl` - Extra grande
- `rounded-2xl` - Molto arrotondato
- `rounded-full` - Completamente rotondo

## 🔧 Dopo le Modifiche

Dopo aver fatto modifiche ai file, il server Next.js si ricaricherà automaticamente. Se le modifiche non appaiono:

1. **Ricarica la pagina** del browser (Ctrl+R o Cmd+R)
2. **Se non funziona**, ferma il server (Ctrl+C) e riavvialo:
   ```bash
   npm run dev
   ```

## 💾 Salvare le Modifiche

Ricordati di salvare tutti i file modificati prima di testare le modifiche!

Buona personalizzazione! 🎨
