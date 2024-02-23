import { cn } from '@/lib/utils'
import { Message } from 'ai/react'
import { Loader2 } from 'lucide-react'
import React from 'react'
import Markdown from 'react-markdown'

type Props = {
  isLoading: boolean
  messages: Message[]
}

const MessageList = ({ isLoading, messages }: Props) => {
  if (isLoading) {
    return (
      <div className='flex flex-col flex-grow items-center justify-center'>
        <Loader2 className='w-6 h-6 animate-spin' />
      </div>
    )
  }

  if (!messages) return <></>

  return (
    <div className='flex flex-col flex-grow gap-2 px-4 pb-2'>
      { messages.map(message => {
        const markdown = message.content
        console.log(markdown, '\n')
        
        return (
          <div
            key={message.id}
            className={cn('flex py-1', {
              'justify-end pl-10': message.role === 'user',
              'justify-start pr-10': message.role === 'assistant' || message.role === 'system'
            })}
          >
            <div className={
              cn (
                'rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-800/10', {
                'bg-sky-600 text-white': message.role === 'user',
                'bg-emerald-600/80 text-white shadow-lg': message.role === 'assistant' || message.role === 'system'
              }
            )}>
              <p className='leading-[22px]'>
                <Markdown>{message.content}</Markdown>
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
