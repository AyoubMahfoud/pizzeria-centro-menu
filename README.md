# 🍕 Menu Digitale Premium - Pizzeria Centro

Menu digitale professionale con pannello admin completo per la gestione di piatti, categorie e ingredienti.

## ✨ Caratteristiche

### Menu Pubblico
- 📱 Design responsive e moderno
- 🎨 UI premium con animazioni fluide
- 🌍 Supporto multilingua (Italiano/Inglese)
- 🏷️ Visualizzazione allergeni (c = surgelati, f = freschi)
- ✅ Indicazione piatti non disponibili
- 💰 Prezzi chiari e ben visibili

### Pannello Admin
- 🔐 Autenticazione sicura con JWT
- 📊 Dashboard completa con 3 sezioni:
  - **Piatti**: Aggiungi, modifica, elimina e gestisci disponibilità
  - **Categorie**: Organizza il menu in sezioni personalizzabili
  - **Ingredienti**: Traccia e gestisci disponibilità ingredienti
- 🎯 Sistema intelligente di disponibilità:
  - Segna ingredienti come "finiti"
  - I piatti con ingredienti non disponibili vengono automaticamente segnalati
- 📝 Modali eleganti per tutte le operazioni CRUD
- 🔄 Aggiornamenti in tempo reale

## 🚀 Installazione e Setup

### 1. Installare le dipendenze

```bash
cd menu-digitale
npm install
```

### 2. Popolare il database

```bash
npm run seed
```

Questo comando creerà:
- Un utente admin (email: `admin@pizzeria.com`, password: `admin123`)
- Le categorie del menu
- Ingredienti di esempio
- Piatti di esempio

### 3. Avviare il server di sviluppo

```bash
npm run dev
```

L'applicazione sarà disponibile su:
- **Menu pubblico**: [http://localhost:3000](http://localhost:3000)
- **Login admin**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Dashboard admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🔑 Credenziali Admin

**Email**: admin@pizzeria.com
**Password**: admin123

## 📁 Struttura del Progetto

```
menu-digitale/
├── app/
│   ├── admin/               # Pagine admin
│   │   ├── login/          # Login admin
│   │   └── page.tsx        # Dashboard admin
│   ├── api/                # API Routes
│   │   ├── auth/           # Autenticazione
│   │   ├── categories/     # Gestione categorie
│   │   ├── dishes/         # Gestione piatti
│   │   └── ingredients/    # Gestione ingredienti
│   ├── page.tsx            # Menu pubblico
│   ├── layout.tsx          # Layout principale
│   └── globals.css         # Stili globali
├── components/
│   └── modals/
│       └── Modal.tsx       # Componente modale riutilizzabile
├── lib/
│   ├── prisma.ts          # Client Prisma
│   ├── auth.ts            # Utility autenticazione
│   └── jwt.ts             # Gestione JWT
├── prisma/
│   ├── schema.prisma      # Schema database
│   └── seed.ts            # Dati iniziali
└── middleware.ts          # Protezione route admin
```

## 🗄️ Database

Il progetto utilizza **SQLite** con **Prisma ORM**.

### Modelli:
- **User**: Admin users
- **Category**: Categorie menu
- **Dish**: Piatti/Pizze
- **Ingredient**: Ingredienti
- **DishIngredient**: Relazione many-to-many tra piatti e ingredienti

### Comandi Prisma utili:

```bash
# Generare il client Prisma
npx prisma generate

# Creare/aggiornare il database
npx prisma db push

# Aprire Prisma Studio (GUI per il database)
npx prisma studio

# Resettare il database
npx prisma db push --force-reset
npm run seed
```

## 🎨 Funzionalità Admin

### Gestione Piatti
- ➕ Aggiungi nuovo piatto con nome (IT/EN), descrizione (IT/EN), prezzo
- ✏️ Modifica piatti esistenti
- 🗑️ Elimina piatti
- 👁️ Attiva/disattiva disponibilità con un click
- 🏷️ Assegna allergeni (c, f)
- 🥗 Seleziona ingredienti associati
- 📂 Organizza per categoria
- 🔢 Definisci ordine di visualizzazione

### Gestione Categorie
- ➕ Crea nuove categorie con nome (IT/EN) e descrizione
- ✏️ Modifica categorie esistenti
- 🗑️ Elimina categorie (elimina anche i piatti associati)
- 🔢 Definisci ordine di visualizzazione
- 📊 Visualizza numero piatti per categoria

### Gestione Ingredienti
- ➕ Aggiungi nuovi ingredienti
- ✏️ Modifica nome ingrediente
- 🗑️ Elimina ingredienti
- ✅ Segna come "finito" (non disponibile)
- 📊 Visualizza in quanti piatti è usato
- ⚠️ Sistema automatico: quando un ingrediente è "finito", tutti i piatti che lo contengono vengono segnalati

## 🌟 Caratteristiche Premium

- **Design moderno**: Gradient backgrounds, animazioni fluide, ombre eleganti
- **UX ottimizzata**: Feedback visivi immediati, stati di caricamento, conferme per azioni critiche
- **Responsive**: Perfettamente funzionante su desktop, tablet e mobile
- **Modali invece di popup**: Tutte le operazioni avvengono tramite modali eleganti e accessibili
- **Sistema allergeni**: Tracciamento completo di allergeni e ingredienti surgelati/freschi
- **Gestione intelligente disponibilità**: Sistema a cascata per ingredienti e piatti

## 🔒 Sicurezza

- Autenticazione JWT sicura
- Password hashate con bcrypt
- Cookie httpOnly per i token
- Middleware per protezione route admin
- Validazione input lato client e server

## 📱 Responsive Design

L'applicazione è completamente responsive e ottimizzata per:
- 📱 Mobile (smartphone)
- 📱 Tablet
- 💻 Desktop

## 🚀 Deploy in Produzione

Per il deploy in produzione:

1. Cambiare il database da SQLite a PostgreSQL/MySQL
2. Configurare le variabili d'ambiente:
   ```
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-secure-random-secret"
   ```
3. Build del progetto:
   ```bash
   npm run build
   npm start
   ```

## 🆘 Supporto

Per problemi o domande, consulta la documentazione di:
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 Licenza

Progetto realizzato per Pizzeria Centro.
