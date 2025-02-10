import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)

export async function verifyJwt(token: string | undefined) {
  let isAuthenticated = false
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch (error) {
      console.error('Token inválido:', error)
      isAuthenticated = false
    }
  }

  return { isAuthenticated }
}
