'use client'

import React, { useState, FormEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '../ui/Button'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask Dena anything about GTM strategy..."
        disabled={disabled}
        className="flex-1 px-4 py-3 bg-secondary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      />
      <Button 
        type="submit" 
        disabled={!input.trim() || disabled}
        className="px-6"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  )
}
