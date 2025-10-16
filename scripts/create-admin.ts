import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@pizzeria.com'
  const password = 'PizzeriaCentroAlfonso1979'

  // Hash della password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Elimina l'utente esistente se c'è
  await prisma.user.deleteMany({
    where: { email }
  })

  // Crea il nuovo utente admin
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Amministratore'
    }
  })

  console.log('✅ Utente admin creato con successo!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('ID:', admin.id)
}

main()
  .catch((e) => {
    console.error('❌ Errore:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
