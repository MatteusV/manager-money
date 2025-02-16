'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { uploadProfileImage } from '@/app/server-action/uploadProfileImage'
import { Input } from './ui/input'
import { Loader2 } from 'lucide-react'

export function AddProfileImageDialog() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  function handleFileChange(file: File) {
    setSelectedImage(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file)
    }
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  // Função para enviar a imagem
  async function handleSubmit() {
    if (!selectedImage) return
    setLoading(true)
    const formData = new FormData()
    formData.append('profileImage', selectedImage)
    await uploadProfileImage(formData).finally(() => setLoading(false))
  }

  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()}>
        Foto de perfil
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Adicionar Foto de Perfil</DialogTitle>
        </DialogHeader>

        {previewUrl && (
          <div className="flex justify-center mb-4">
            <Image
              src={previewUrl}
              alt="Preview"
              width={300}
              height={300}
              className="w-32 h-32 rounded-full object-cover border-2 border-primary"
            />
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed border-black dark:border-zinc-500 rounded-lg p-6 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-muted'
          }`}
        >
          <p className="text-sm text-muted-foreground">
            Arraste e solte sua imagem aqui ou{' '}
            <label
              htmlFor="picture"
              className="text-primary cursor-pointer hover:underline"
            >
              clique para selecionar
            </label>
          </p>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmit}
            disabled={!selectedImage || loading}
            className="relative"
          >
            {loading ? (
              <Loader2 className="size-5 text-white dark:text-black animate-spin" />
            ) : (
              'Enviar Imagem'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
