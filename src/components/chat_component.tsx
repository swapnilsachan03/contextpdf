'use client'

import React from 'react'
import { Input } from './ui/input'
import { useChat } from 'ai/react'
import { Button } from './ui/button'
import { SendIcon } from 'lucide-react'
import MessageList from './message_list'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Message } from 'ai'

type Props = { chatId: number }

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['chat', chatId],

    queryFn: async () => {
      const response = await axios.post<Message[]>('/api/get-messages', {
        chatId
      })

      return response.data
    }
  })

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/chat',
    body: {
      chatId
    },
    initialMessages: data || []
  })

  React.useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages])

  return (
    <div
      className='flex flex-col relative h-screen overflow-auto'
      id='message-conainer'
    >
      <div className='sticky top-0 inset-x-0 p-4 bg-white h-fit'>
        <h3 className='text-xl font-bold'>
          Chat
        </h3>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

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
