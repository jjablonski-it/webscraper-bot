import { Guild, Job, Prisma, PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export const saveGuild = async (guildId: string): Promise<Guild> => {
  return await client.guild.create({ data: { id: guildId } })
}

export const getGuilds = async (): Promise<Guild[]> => {
  return await client.guild.findMany()
}

export const saveJob = async (job: Prisma.JobCreateInput): Promise<Job> => {
  return await client.job.create({
    data: job,
  })
}

export const getJobs = async (guildId?: string) => {
  return client.job.findMany({
    where: {
      ...(guildId && { guildId }),
    },
  })
}

export const saveLinks = async (
  guildId: string,
  jobName: string,
  links: string[]
) => {
  const job = await client.job.findUniqueOrThrow({
    where: {
      name_guildId: {
        name: jobName,
        guildId: guildId,
      },
    },
  })
  return await client.link.createMany({
    data: links.map((link) => ({
      url: link,
      jobId: job.id,
    })),
  })
}

export const getExistingLinks = async (
  guildId: string,
  jobName: string
): Promise<string[]> => {
  return await client.link
    .findMany({
      where: {
        job: {
          guildId: guildId,
          name: jobName,
        },
      },
    })
    .then((links) => links.map((link) => link.url))
}
