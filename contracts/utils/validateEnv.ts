export const validateEnv = (name: string, env?: string): string => {
  if (!env) {
    throw new Error(`"${name}" env var is not provided!`)
  }
  return env
}
