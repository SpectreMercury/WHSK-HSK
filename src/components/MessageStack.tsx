import { useState } from 'react'

export interface Message {
  id: string
  type: 'pending' | 'success' | 'error'
  title: string
  description: string
  txHash?: string
}

const MessageStack = ({ messages }: { 
  messages: Message[]
  onDismiss: (id: string) => void 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = (type: Message['type']) => {
    switch (type) {
      case 'pending':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-nord-13 border-t-transparent" />
        )
      case 'success':
        return (
          <div className="h-4 w-4 rounded-full bg-nord-14 flex items-center justify-center">
            <svg className="w-3 h-3 text-nord-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="h-4 w-4 rounded-full bg-nord-11 flex items-center justify-center">
            <svg className="w-3 h-3 text-nord-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex flex-col items-end">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 bg-nord-2 rounded-full 
                     text-sm text-nord-4 hover:bg-nord-3 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-nord-8"/>
            {messages.length}
          </span>
        </button>

        {isExpanded && (
          <div className="mt-2 w-80 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-nord-1 rounded-lg p-4 shadow-lg border border-nord-2"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getStatusIcon(message.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-nord-6">{message.title}</h3>
                    <p className="text-sm text-nord-4">{message.description}</p>
                    {message.txHash && (
                      <a
                        href={`https://explorer.hsk.xyz/tx/${message.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center text-sm text-nord-8 hover:text-nord-9"
                      >
                        View on Explorer
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageStack 
