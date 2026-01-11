'use client'

import { useState } from 'react'
import { ChatContainer } from '@/components/chat/ChatContainer'
import { UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { MessageSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { STARTER_PROMPTS } from '@/lib/prompts'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        throw new Error(`Failed to fetch response: ${errorText}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          assistantMessage += chunk

          // Update assistant message in real-time
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            
            if (lastMessage?.role === 'assistant') {
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: assistantMessage
              }
            } else {
              newMessages.push({
                role: 'assistant',
                content: assistantMessage
              })
            }
            
            return newMessages
          })
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please check the console for details.`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStarterPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleNewChat = () => {
    setMessages([])
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xl">
              🚀
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dena</h1>
              <p className="text-sm text-gray-400">Your AI GTM Advisor</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={handleNewChat}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="primary">Sign Up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Conversation History */}
        <aside className="w-64 border-r border-gray-800 bg-background overflow-y-auto hidden md:block">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Recent Conversations
            </h2>
            <div className="space-y-2 text-sm text-gray-500">
              <p>No saved conversations yet</p>
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <div className="max-w-2xl w-full text-center space-y-8">
                <div>
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-4xl mx-auto mb-4">
                    🚀
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Welcome to Dena
                  </h2>
                  <p className="text-gray-400">
                    Your AI-powered GTM strategy advisor. Ask me anything about sales, revenue growth, and go-to-market strategy.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-500 font-medium">Try asking:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {STARTER_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleStarterPrompt(prompt)}
                        className="text-left p-4 bg-secondary hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 hover:border-primary"
                      >
                        <p className="text-sm text-gray-300">{prompt}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}
        </main>
      </div>
    </div>
  )
}
