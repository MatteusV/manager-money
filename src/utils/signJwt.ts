import { SignJWT } from 'jose'

interface SignJwtProps {
  id: string
  email: string
}

export async function signJwt({ email, id }: SignJwtProps) {
  const token = await new SignJWT({ id, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!))

  return { token }
}
