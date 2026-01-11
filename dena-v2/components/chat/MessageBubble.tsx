'use client'

import React from 'react'
import { Avatar } from '../ui/Avatar'
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user'
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar 
        fallback={isUser ? 'U' : '🚀'} 
        className={isUser ? 'bg-blue-600' : 'bg-primary'}
      />
      <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-4 py-3 rounded-lg ${
          isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-secondary text-gray-100'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
