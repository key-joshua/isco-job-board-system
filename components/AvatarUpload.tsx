'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { User, Plus } from 'lucide-react'

export default function AvatarUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const [isHovering, setIsHovering] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const triggerFileUpload = () => {
    inputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      onFileSelect(file)
    }
  }

  return (
    <div className="text-center mb-8">
      <div onClick={triggerFileUpload} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} className="w-20 h-20 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center relative overflow-hidden cursor-pointer transition-all duration-200" >
        {imageUrl ? (
          <Image src={imageUrl} alt="Avatar" fill className="object-cover" />
        ) : (
          <User className="w-10 h-10 text-primary-semi-active" />
        )}

        {isHovering && (
          <div className="absolute inset-0 bg-primary-semi-active bg-opacity-70 flex items-center justify-center"> <Plus className="w-6 h-6 text-white-active" /> </div>
        )}
      </div>

      <p className="text-primary-semi-active text-sm cursor-pointer" onClick={triggerFileUpload}> Click to upload photo </p>
      <input type="file" accept="image/*" ref={inputRef} onChange={handleFileUpload} className="hidden" />
      <p className="text-xs text-gray-500 mt-1"> Supported formats: JPG, PNG, GIF (Max: 5MB) </p>
    </div>
  )
}
