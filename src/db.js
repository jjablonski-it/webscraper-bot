import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const getExistingLinks = async () => {
  const apartments = await client.appartment.findMany({
    select: { link: true },
  })
  return apartments.map((apartment) => apartment.link)
}

export const addApartments = async (links) => {
  return client.appartment.createMany({
    data: links.map((link) => ({ link })),
    skipDuplicates: true,
  })
}
