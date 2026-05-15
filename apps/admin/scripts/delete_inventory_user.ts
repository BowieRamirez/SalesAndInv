import { prisma } from '@furnitrack/db'

async function main() {
  const email = 'inventory@sims.com'

  const user = await prisma.user.findFirst({
    where: { email }
  })

  if (user) {
    await prisma.user.delete({
      where: { id: user.id }
    })
    console.log('Deleted from public.users')
  } else {
    console.log('Not found in public.users')
  }

  try {
    await prisma.$executeRaw`DELETE FROM neon_auth."user" WHERE email = ${email}`
    console.log('Deleted from neon_auth.user')
  } catch (e) {
    console.log('Error deleting from neon_auth.user', e)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
