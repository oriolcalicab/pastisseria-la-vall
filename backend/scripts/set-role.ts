import 'dotenv/config'
import { prisma } from '../src/lib/prisma.js'
import { parseSetRoleArgs } from '../src/utils/setRoleArgs.js'

const main = async () => {
  const args = parseSetRoleArgs(process.argv.slice(2))

  if (!args) {
    console.error('Ús: pnpm set-role <correu> <customer|admin>')
    process.exitCode = 1
    return
  }

  const user = await prisma.user.findUnique({ where: { email: args.email } })

  if (!user) {
    console.error(`No hi ha cap usuari amb el correu ${args.email}`)
    process.exitCode = 1
    return
  }

  await prisma.user.update({ where: { id: user.id }, data: { role: args.role } })

  console.log(`${args.email} ara té el rol ${args.role}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())