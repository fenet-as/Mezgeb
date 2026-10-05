const appEnvironments = ['development', 'test', 'production'] as const

export type AppEnvironment = (typeof appEnvironments)[number]

function isAppEnvironment(value: string): value is AppEnvironment {
  return appEnvironments.includes(value as AppEnvironment)
}

function getApiUrl(value: string | undefined): string {
  const apiUrl = value?.trim() || 'http://localhost:8080/api/v1'

  try {
    const parsedUrl = new URL(apiUrl)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error()
    }
  } catch {
    throw new Error('VITE_API_URL must be a valid HTTP(S) URL.')
  }

  return apiUrl.replace(/\/+$/, '')
}

const appEnvironment = import.meta.env.VITE_APP_ENV?.trim() || import.meta.env.MODE

if (!isAppEnvironment(appEnvironment)) {
  throw new Error('VITE_APP_ENV must be development, test, or production.')
}

export const env = {
  apiUrl: getApiUrl(import.meta.env.VITE_API_URL),
  appName: import.meta.env.VITE_APP_NAME?.trim() || 'Mezgeb',
  appEnvironment,
}
