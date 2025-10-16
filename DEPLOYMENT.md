# Guida Deployment - Menu Digitale Pizzeria Centro

Questa guida ti aiuterà a mettere online il menu digitale della tua pizzeria con QR code funzionante.

## Prerequisiti

1. **Account GitHub** (gratuito): https://github.com/signup
2. **Account Vercel** (gratuito): https://vercel.com/signup
3. **Database PostgreSQL** (gratuito con Neon): https://neon.tech

---

## Passo 1: Creare il Database PostgreSQL su Neon

1. Vai su https://neon.tech e registrati (è gratis)
2. Clicca su "Create Project"
3. Scegli:
   - **Project name**: `pizzeria-centro-menu`
   - **Database name**: `menudb`
   - **Region**: Europe (scegli la più vicina all'Italia)
4. Clicca "Create Project"
5. **IMPORTANTE**: Copia il **Connection String** che appare (tipo: `postgresql://user:password@host.neon.tech/menudb`)
   - Salvalo in un file temporaneo, ti servirà dopo!

---

## Passo 2: Caricare il Progetto su GitHub

### Opzione A: Usando Git da terminale (consigliato)

```bash
# Vai nella cartella del progetto
cd c:\Users\UNIVERSITA\Desktop\MENUDIGITALE\menu-digitale

# Inizializza il repository Git
git init

# Aggiungi tutti i file
git add .

# Fai il primo commit
git commit -m "Initial commit - Menu Digitale Pizzeria Centro"

# Vai su GitHub e crea un nuovo repository
# https://github.com/new
# Nome: pizzeria-centro-menu
# NON selezionare "Initialize with README"

# Collega il repository locale a GitHub (sostituisci USERNAME con il tuo username GitHub)
git remote add origin https://github.com/USERNAME/pizzeria-centro-menu.git

# Carica il codice su GitHub
git branch -M main
git push -u origin main
```

### Opzione B: Usando GitHub Desktop (più semplice)

1. Scarica GitHub Desktop: https://desktop.github.com/
2. Installa e accedi con il tuo account GitHub
3. Clicca "Add" ’ "Add Existing Repository"
4. Seleziona la cartella: `c:\Users\UNIVERSITA\Desktop\MENUDIGITALE\menu-digitale`
5. Clicca "Publish repository"
6. Nome: `pizzeria-centro-menu`
7. Deseleziona "Keep this code private" se vuoi renderlo pubblico
8. Clicca "Publish repository"

---

## Passo 3: Deploy su Vercel

1. Vai su https://vercel.com/signup e registrati (usa il tuo account GitHub)
2. Dopo il login, clicca "Add New..." ’ "Project"
3. Vercel ti mostrerà tutti i tuoi repository GitHub
4. Trova `pizzeria-centro-menu` e clicca "Import"
5. **Configurazione Build**:
   - Framework Preset: **Next.js** (dovrebbe essere automatico)
   - Root Directory: `./` (lascia così)
   - Build Command: lascia vuoto (usa quello di default)
   - Install Command: lascia vuoto (usa quello di default)

6. **IMPORTANTE - Environment Variables**:
   Clicca su "Environment Variables" e aggiungi:

   **Variable 1:**
   - Name: `DATABASE_URL`
   - Value: Il connection string di Neon che hai copiato prima
     (es: `postgresql://user:password@host.neon.tech/menudb`)

   **Variable 2:**
   - Name: `JWT_SECRET`
   - Value: Una stringa casuale sicura (es: `pizzeria-centro-2024-secret-key-change-this`)
     Puoi generare una stringa sicura qui: https://randomkeygen.com/

7. Clicca "Deploy"

Vercel inizierà il deployment. Ci vorranno 2-3 minuti.

---

## Passo 4: Inizializzare il Database

Una volta che Vercel ha finito il deployment:

1. Nella dashboard di Vercel, vai su **Settings** ’ **Functions**
2. Torna alla tab **Overview** e copia l'URL del tuo sito (es: `pizzeria-centro-menu.vercel.app`)
3. Apri il terminale e esegui questi comandi:

```bash
# Vai nella cartella del progetto
cd c:\Users\UNIVERSITA\Desktop\MENUDIGITALE\menu-digitale

# Copia il file .env.example in .env.production
copy .env.example .env.production

# Apri .env.production e inserisci:
# DATABASE_URL="il-tuo-connection-string-neon"
# JWT_SECRET="la-stessa-chiave-usata-su-vercel"
```

4. Poi esegui questi comandi per creare le tabelle e popolare il database:

```bash
# Imposta la variabile DATABASE_URL (sostituisci con il tuo connection string)
set DATABASE_URL=postgresql://user:password@host.neon.tech/menudb

# Genera il Prisma Client
npx prisma generate

# Crea le tabelle nel database
npx prisma db push

# Popola il database con tutti i piatti
npm run seed
```

---

## Passo 5: Creare l'Utente Admin

Dopo aver popolato il database, devi creare l'utente amministratore:

1. Vai sul sito di Neon (https://console.neon.tech)
2. Seleziona il tuo progetto `pizzeria-centro-menu`
3. Clicca su "SQL Editor"
4. Esegui questa query per creare l'utente admin:

```sql
INSERT INTO "User" (id, email, password, name, "createdAt", "updatedAt")
VALUES (
  'admin-' || gen_random_uuid()::text,
  'admin@pizzeriacentro.com',
  '$2a$10$YourHashedPasswordHere',
  'Amministratore',
  NOW(),
  NOW()
);
```

**IMPORTANTE**: La password deve essere hashata. Per creare la password:

1. Vai su questo sito: https://bcrypt-generator.com/
2. Inserisci la password che vuoi usare (es: `Pizzeria2024!`)
3. Rounds: 10
4. Clicca "Generate"
5. Copia l'hash generato (es: `$2a$10$abcdef123456...`)
6. Sostituisci `$2a$10$YourHashedPasswordHere` nella query sopra con l'hash copiato

Poi esegui la query cliccando "Run Query".

---

## Passo 6: Testare il Sito

1. Apri il tuo sito: `https://pizzeria-centro-menu.vercel.app` (usa il tuo URL)
2. Dovresti vedere il menu con tutti i piatti
3. Prova ad accedere all'admin:
   - Vai su: `https://pizzeria-centro-menu.vercel.app/admin/login`
   - Email: `admin@pizzeriacentro.com`
   - Password: quella che hai scelto prima
4. Verifica che puoi gestire piatti, categorie e ingredienti

---

## Passo 7: Generare il QR Code per i Tavoli

1. Vai su: `https://pizzeria-centro-menu.vercel.app/qrcode`
2. Vedrai il QR code del tuo menu
3. Clicca su "Scarica QR Code" per scaricare l'immagine
4. Clicca su "Stampa" per stampare direttamente

### Come Usare il QR Code:

1. **Stampa su carta normale (A4)**:
   - Stampa il QR code
   - Puoi plastificarlo in una copisteria per renderlo resistente

2. **Stampa professionale**:
   - Salva l'immagine del QR code
   - Portala in tipografia e falla stampare su cartoncino rigido
   - Opzionale: stampa su materiale impermeabile

3. **Posizionamento**:
   - Metti il QR code sui tavoli (uno per tavolo)
   - Puoi usare supporti da tavolo o adesivi

4. **Istruzioni per i clienti**:
   - Puoi aggiungere testo tipo: "Scannerizza il QR code per visualizzare il menu"
   - I clienti usano la fotocamera del telefono per scansionare

---

## Passo 8: Configurare il Dominio Personalizzato (Opzionale)

Se vuoi usare un dominio tipo `www.pizzeriacentro.it`:

1. Acquista un dominio (es: su https://www.aruba.it o https://www.register.it)
2. Nella dashboard Vercel, vai su **Settings** ’ **Domains**
3. Clicca "Add"
4. Inserisci il tuo dominio (es: `pizzeriacentro.it`)
5. Vercel ti darà dei record DNS da configurare
6. Vai nel pannello del tuo provider di domini
7. Aggiungi i record DNS che Vercel ti ha fornito
8. Aspetta 24-48 ore per la propagazione DNS

---

## Manutenzione e Aggiornamenti

### Aggiungere/Modificare Piatti:

1. Accedi all'admin: `https://tuo-sito.vercel.app/admin/login`
2. Modifica piatti, categorie o ingredienti
3. Le modifiche sono immediate sul menu pubblico

### Aggiornare il Codice:

Ogni volta che modifichi il codice localmente e lo carichi su GitHub, Vercel farà automaticamente il re-deploy.

```bash
git add .
git commit -m "Aggiornamento menu"
git push
```

Vercel rileverà il push e aggiornerà il sito automaticamente (2-3 minuti).

---

## Troubleshooting

### Problema: "Database connection failed"
- Verifica che il `DATABASE_URL` in Vercel sia corretto
- Controlla che il database Neon sia attivo

### Problema: "Login non funziona"
- Verifica di aver creato l'utente admin nel database
- Controlla che la password sia hashata correttamente

### Problema: "QR code non funziona"
- Assicurati che l'URL sia corretto e accessibile
- Testa il QR code con diverse app di scansione

### Problema: "Build failed su Vercel"
- Controlla i log di build nella dashboard Vercel
- Verifica che tutte le variabili ambiente siano configurate

---

## Costi

- **Vercel**: GRATIS per progetti personali
- **Neon Database**: GRATIS fino a 0.5 GB (più che sufficiente per un menu)
- **GitHub**: GRATIS per repository pubblici e privati

**Totale: 0¬ al mese!**

---

## Supporto

Se hai problemi, verifica:
1. I log di build su Vercel
2. I log del database su Neon
3. La console del browser (F12) per errori JavaScript

---

## Riepilogo URL Importanti

- **Sito pubblico**: `https://tuo-sito.vercel.app`
- **Admin login**: `https://tuo-sito.vercel.app/admin/login`
- **QR Code**: `https://tuo-sito.vercel.app/qrcode`
- **Dashboard Vercel**: https://vercel.com/dashboard
- **Dashboard Neon**: https://console.neon.tech

---

**Congratulazioni! Il tuo menu digitale è ora online! <‰**
