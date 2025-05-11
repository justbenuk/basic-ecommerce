import { PrismaClient } from '@prisma/client'
import sampleData from './sample-data'

async function main() {

  //create the db connection
  const db = new PrismaClient()

  //delete any tables to we can have a fresh db
  await db.product.deleteMany()


  //import the sample data back into the db
  await db.product.createMany({
    data: sampleData.products
  })

  console.log('Database seeded successfully')

}

main()
