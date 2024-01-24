'use client'

import React from 'react'
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import { Button } from './ui/button'
import { MessageSquare, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import axios from 'axios'

type Props = {
  chats: DrizzleChat[],
  chatId: number
  isPro: boolean
}

const ChatSidebar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = React.useState(false)

  const handleSubscription = async () => {
    try {
      setLoading(true)

      const response = await axios.get('/api/stripe')
      window.location.href = response.data.url
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className='w-full h-screen p-4 text-gray-200 bg-gray-900'>
      <Link href='/'>
        <Button className='w-full border-dashed border-white border'>
          <PlusCircle className='mr-2 w-4 h-4' />
          Create Chat
        </Button>
      </Link>

      <div className='flex flex-col gap-2 mt-4'>
        { chats.map(chat => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div className={
              cn('rounded-lg p-3 text-slate-300 flex items-center', {
                'bg-blue-800 text-white': chat.id === chatId,
                'hover:text-white': chat.id !== chatId
              })
            }>
              <MessageSquare className='mr-2 w-5 h-5' />
              <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'> {chat.pdfName} </p>
            </div>
          </Link>
        ))}
      </div>

      <div className='absolute bottom-4 left-4 flex flex-row'>
        { !isPro && (
          <button
            onClick={handleSubscription}
            className='mr-5 px-3 py-1 text-[13px] rounded-md border-2 border-slate-500 bg-zinc-800 text-zinc-200'
            disabled={loading}
          >
            Get Pro
          </button>
        )}

        <div className='flex items-center gap-3 text-sm text-slate-500 flex-wrap'>
          <Link href='/'> Home </Link>
          <Link href='/'> Source </Link>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
