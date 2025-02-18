const baseUrl = process.env.NEXT_PUBLIC_URL

export const api = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`)
  }

  const responseInJson = await response.json()

  if (endpoint === '/api/init-cron') {
    console.log(responseInJson)
  }

  return responseInJson
}
