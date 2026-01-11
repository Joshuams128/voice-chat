import React from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  className?: string
}

export function Avatar({ src, alt, fallback = 'D', className = '' }: AvatarProps) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white font-semibold ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
      ) : (
        fallback
      )}
    </div>
  )
}
