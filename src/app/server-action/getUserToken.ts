import { cookies } from 'next/headers'
import * as jose from 'jose'

interface TokenPayload {
  id: string
  email: string
  iat: number
  exp: number
}

export async function getUserToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return { error: 'Token não foi encontrado' }
  }

  try {
    const decoded = jose.decodeJwt(token) as TokenPayload
    return {
      tokenDecoded: decoded,
    }
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
    return { error: `Erro ao decodificar o token: ${error}` }
  }
}
