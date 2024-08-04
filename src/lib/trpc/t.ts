import { initTRPC } from '@trpc/server'

export const t = initTRPC.context<App.Locals>().create()
