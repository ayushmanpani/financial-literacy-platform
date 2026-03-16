import { prisma } from "@repo/db";

export async function createProfile(userId: string, data: any) {
  return prisma.profile.create({
    data: {
      userId,
      ...data
    }
  });
}

export async function getProfile(userId: string) {
  return prisma.profile.findUnique({
    where: { userId }
  });
}

export async function updateProfile(userId: string, data: any) {
  return prisma.profile.update({
    where: { userId },
    data
  });
}