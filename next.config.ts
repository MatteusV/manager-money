import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configuração de imagens
  images: {
    remotePatterns: [
      {
        hostname: 'd2hs1mjtyjtarga3.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
