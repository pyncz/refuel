// @ts-check
import { z } from 'zod'
import { address } from '../models'

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  // server-only secrets
})

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_ client vars
  NEXT_PUBLIC_RESOLVER_CONTRACT_ADDRESS: address,
  NEXT_PUBLIC_AUTOMATED_CONTRACT_ADDRESS: address,
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
  NEXT_PUBLIC_WALLETCONNECT_RELAY_URL: z.string(),
  NEXT_PUBLIC_ALCHEMY_ID: z.string(),
  NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'test', 'production']),
})

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.input<typeof clientSchema>]: string | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_RESOLVER_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_RESOLVER_CONTRACT_ADDRESS,
  NEXT_PUBLIC_AUTOMATED_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_AUTOMATED_CONTRACT_ADDRESS,
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_WALLETCONNECT_RELAY_URL: process.env.NEXT_PUBLIC_WALLETCONNECT_RELAY_URL,
  NEXT_PUBLIC_ALCHEMY_ID: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
}
