'use client'

import React from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { SendIcon } from 'lucide-react'
import MessageList from './message_list'

type Props = {}

const ChatComponent = (props: Props) => {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/chat'
  })

  return (
    <div className='relative max-h-screen overflow-auto'>
      <div className='sticky top-0 inset-x-0 p-4 bg-white h-fit'>
        <h3 className='text-xl font-bold'>
          Chat
        </h3>
      </div>

      <MessageList messages={messages} />

      <form
        onSubmit={handleSubmit}
        className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white'
      >
        <div className='flex flex-row'>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder='Ask any question...'
            className='w-full rounded-lg'
          />

          <Button className='bg-pink-600 ml-2 rounded-lg'>
            <SendIcon className='w-4 h-4' />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatComponent