# 🚀 Guida Rapida - Menu Digitale Pizzeria Centro

## 🎯 Avvio Rapido

1. **Aprire il terminale nella cartella del progetto**
   ```bash
   cd menu-digitale
   ```

2. **Avviare il server**
   ```bash
   npm run dev
   ```

3. **Aprire il browser**
   - Menu pubblico: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

## 🔑 Login Admin

- **Email**: `admin@pizzeria.com`
- **Password**: `admin123`

## 📋 Funzionalità Principali

### 1️⃣ Gestione Piatti
Dalla dashboard admin, tab "Piatti":
- **Aggiungere un piatto**: Click su "Aggiungi Piatto"
  - Compila nome, descrizione, prezzo
  - Seleziona categoria
  - Aggiungi ingredienti (opzionale)
  - Seleziona allergeni se necessario
  - Definisci ordine di visualizzazione
- **Modificare un piatto**: Click sull'icona matita (✏️)
- **Eliminare un piatto**: Click sull'icona cestino (🗑️)
- **Rendere non disponibile**: Click sull'icona occhio (👁️)

### 2️⃣ Gestione Ingredienti
Dalla dashboard admin, tab "Ingredienti":
- **Aggiungere ingrediente**: Click su "Aggiungi Ingrediente"
- **Segnare come finito**: Click sull'icona occhio (👁️)
  - ⚠️ IMPORTANTE: Quando un ingrediente è segnato come "finito", tutti i piatti che lo contengono vengono automaticamente segnalati come "con ingredienti mancanti" nel menu pubblico
- **Modificare/Eliminare**: Icone ✏️ e 🗑️

### 3️⃣ Gestione Categorie
Dalla dashboard admin, tab "Categorie":
- **Aggiungere categoria**: Click su "Aggiungi Categoria"
  - Nome in italiano e inglese
  - Descrizione (opzionale)
  - Ordine di visualizzazione
- **Modificare/Eliminare**: Icone ✏️ e 🗑️
  - ⚠️ Eliminando una categoria si eliminano anche tutti i piatti associati!

## 🎨 Caratteristiche del Menu Pubblico

- ✅ Mostra solo piatti disponibili
- ⚠️ Segnala piatti con ingredienti non disponibili
- 🏷️ Mostra allergeni (c = surgelati, f = freschi)
- 🌍 Bilingue (Italiano/Inglese)
- 📱 Responsive (funziona su mobile, tablet, desktop)

## 🔄 Sistema di Disponibilità Intelligente

### Come funziona:
1. **Ingrediente finito** → Segnato come "non disponibile" nella sezione Ingredienti
2. **Aggiornamento automatico** → Tutti i piatti che contengono quell'ingrediente vengono segnalati
3. **Visualizzazione menu** → Il piatto appare con "Ingredienti mancanti" nel menu pubblico
4. **Ripristino** → Quando l'ingrediente torna disponibile, i piatti tornano normali automaticamente

### Esempio pratico:
- La mozzarella è finita
- Vai in "Ingredienti" → Click sull'occhio della mozzarella
- Tutti i piatti con mozzarella (es. Pizza Margherita, Caprese, ecc.) vengono automaticamente segnalati
- I clienti vedranno "Ingredienti mancanti" su quei piatti

## 💡 Suggerimenti

### Per gestire il menu giornaliero:
1. All'inizio del servizio, controlla gli ingredienti disponibili
2. Segna come "non disponibili" gli ingredienti esauriti
3. Il sistema aggiornerà automaticamente tutti i piatti

### Per aggiungere nuovi piatti velocemente:
1. Crea prima gli ingredienti nella sezione "Ingredienti"
2. Verifica che la categoria esista
3. Aggiungi il piatto e associa gli ingredienti

### Per riordinare il menu:
- Usa il campo "Ordine" quando crei/modifichi categorie e piatti
- Numeri più bassi appaiono prima nel menu

## 🛠️ Comandi Utili

```bash
# Avviare il server di sviluppo
npm run dev

# Resettare completamente il database
npx prisma db push --force-reset
npm run seed

# Visualizzare il database (GUI)
npx prisma studio
```

## ❓ Problemi Comuni

### Il server non parte
```bash
# Reinstalla le dipendenze
npm install
npm run dev
```

### Ho perso i dati di esempio
```bash
# Ripopola il database
npm run seed
```

### Ho dimenticato la password admin
- La password di default è sempre `admin123`
- Se hai modificato l'admin, puoi resettare il database con `npx prisma db push --force-reset` e poi `npm run seed`

## 📞 Note Finali

- Tutti i dati vengono salvati automaticamente
- Le modifiche sono visibili immediatamente nel menu pubblico
- I modali si chiudono con ESC o cliccando fuori
- Tutte le operazioni di eliminazione richiedono conferma

Buon lavoro! 🍕
