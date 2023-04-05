import fs from 'fs'
import path from 'path'

const APP_ENV_PATH = path.resolve(__dirname, '../../app/.env')

export const setAppEnv = (key: string, value: string) => {
  let appEnv = fs.readFileSync(APP_ENV_PATH, 'utf-8')

  const varRegExp = new RegExp(`^${key}=.*$`, 'm')
  const entry = `${key}=${value}`

  if (varRegExp.test(appEnv)) {
    // already has variable, update
    appEnv = appEnv.replace(varRegExp, entry)
  } else {
    // write a new one
    appEnv += `${entry}\n`
  }

  fs.writeFileSync(APP_ENV_PATH, appEnv, 'utf-8')
}
