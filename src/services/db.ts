import { Guild, Job, Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const saveGuild = async (guildId: string): Promise<Guild> => {
  return await prisma.guild.create({ data: { id: guildId } })
}

export const getGuilds = async (): Promise<Guild[]> => {
  return await prisma.guild.findMany()
}

export const saveJob = async (job: Prisma.JobCreateInput): Promise<Job> => {
  return await prisma.job.create({
    data: job,
  })
}

export const getJobs = async (guildId?: string) => {
  return prisma.job.findMany({
    where: {
      ...(guildId && { guildId }),
    },
  })
}

export const getJob = async (guildId: string, name: string): Promise<Job> => {
  return await prisma.job.findUniqueOrThrow({
    where: {
      name_guildId: {
        guildId,
        name,
      },
    },
  })
}

export const updateJob = async (
  guildId: string,
  name: string,
  job: Prisma.JobUpdateInput
): Promise<Job> => {
  return await prisma.job.update({
    data: job,
    where: {
      name_guildId: {
        guildId,
        name,
      },
    },
  })
}

export const deleteJob = async (guildId: string, name: string) => {
  return await prisma.job.delete({
    where: {
      name_guildId: {
        guildId,
        name,
      },
    },
  })
}

export const saveLinks = async (
  guildId: string,
  jobName: string,
  links: string[]
) => {
  const job = await prisma.job.findUniqueOrThrow({
    where: {
      name_guildId: {
        name: jobName,
        guildId: guildId,
      },
    },
  })
  return await prisma.link.createMany({
    data: links.map((link) => ({
      url: link,
      jobId: job.id,
    })),
  })
}

export const getLinks = async (
  guildId: string,
  channelId: string
): Promise<string[]> => {
  return await prisma.link
    .findMany({
      where: {
        job: {
          guildId,
          channelId,
        },
      },
    })
    .then((links) => links.map((link) => link.url))
}
