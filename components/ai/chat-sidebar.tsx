"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAIChat } from "@/lib/hooks/use-ai-chat"
import type { DashboardContext } from "@/lib/types/ai-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, TrashIcon, SparklesIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ChatSidebarProps {
  context: DashboardContext
}

const QUICK_QUESTIONS = [
  { label: "Sites sous-performants", query: "Quels sites sous-performent le plus?" },
  { label: "Augmenter revenus", query: "Comment augmenter nos revenus?" },
  { label: "Améliorer NPS", query: "Comment améliorer le NPS?" },
  { label: "Anomalies détectées", query: "Quelles anomalies détectes-tu?" },
  { label: "Staffing optimal", query: "Quel est le staffing optimal par site?" },
  { label: "Prévisions demande", query: "Quelles sont les prévisions pour les 30 prochains jours?" },
]

export function ChatSidebar({ context }: ChatSidebarProps) {
  const { messages, loading, error, sendMessage, clearChat, messagesEndRef } = useAIChat()
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async (query: string = input) => {
    if (!query.trim()) return

    await sendMessage(query, context, "conversational")
    setInput("")
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 to-white dark:from-slate-900 dark:to-slate-950 border-l border-green-200 dark:border-slate-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-green-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-green-900 dark:text-white">Assistant IA</h3>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">Posez vos questions stratégiques au PDG</p>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-4 text-center py-8">
            <div className="text-green-600 dark:text-green-400">
              <SparklesIcon className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Aucune question pour le moment</p>
            <div className="space-y-2 pt-4">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Questions suggérées:</p>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.query}
                  onClick={() => handleSendMessage(q.query)}
                  className="w-full text-left p-2 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 px-4 py-3 rounded-lg text-sm">
                  Erreur: {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-green-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Votre question..."
            className="text-sm border-green-200 dark:border-slate-600"
            disabled={loading}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>
        {messages.length > 0 && (
          <Button
            onClick={clearChat}
            variant="ghost"
            size="sm"
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Effacer historique
          </Button>
        )}
      </div>
    </div>
  )
}
