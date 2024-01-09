import { cn } from '@/lib/utils'
import { Message } from 'ai/react'
import React from 'react'

type Props = {
  messages: Message[]
}

const MessageList = ({ messages }: Props) => {
  if (!messages) return <></>

  return (
    <div className='flex flex-col gap-2 px-4 pb-2'>
      { messages.map(message => {
        return (
          <div
            key={message.id}
            className={cn('flex py-1', {
              'justify-end pl-10': message.role === 'user',
              'justify-start pr-10': message.role === 'assistant'
            })}
          >
            <div className={
              cn (
                'rounded-lg px-3 text-sm py-2 shadow-md ring-1 ring-gray-800/10', {
                'bg-cyan-600 text-white': message.role === 'user',
                'bg-teal-600 text-white': message.role === 'assistant'
              }
            )}>
              <p className='leading-[22px]'> {message.content} </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
