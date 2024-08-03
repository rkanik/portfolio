import { PrismaClient } from '@prisma/client'

console.log('new PrismaClient')
export const prisma = new PrismaClient()
