import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import * as jose from 'jose'

interface TokenPayload {
  id: string
  email: string
  iat: number
  exp: number
}
export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    
    if (token) {
      try {
        const decoded = jose.decodeJwt(token) as TokenPayload;
        setUserId(decoded.id);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        Cookies.remove('token'); 
        setUserId(null);
      }
    }
  }, []);

  return {
    userId,
    isAuthenticated: !!userId,
  };
}
