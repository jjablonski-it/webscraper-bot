import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const getExistingLinks = async (guildId: string, jobName: string) => {
  // TODO Change db model
  const apartments = await client.appartment.findMany({
    select: { link: true },
  })
  return apartments.map((apartment) => apartment.link)
}

export const saveLinks = async (
  guildId: string,
  jobName: string,
  links: string[]
) => {
  return client.appartment.createMany({
    data: links.map((link) => ({ link })),
    skipDuplicates: true,
  })
}
