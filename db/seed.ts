import { PrismaClient } from '@prisma/client'
import sampleData from './sample-data'

async function main() {

  //create the db connection
  const db = new PrismaClient()

  //delete any tables to we can have a fresh db
  await db.product.deleteMany()
  await db.user.deleteMany()
  await db.account.deleteMany()
  await db.session.deleteMany()
  await db.verificationToken.deleteMany()


  //import the sample data back into the db
  await db.product.createMany({
    data: sampleData.products
  })

  //import the sample users for development only
  await db.user.createMany({
    data: sampleData.users
  })

  console.log('Database seeded successfully')

}

main()
