import ChatComponent from '@/components/chat_component'
import ChatSidebar from '@/components/chat_sidebar'
import PDFViewer from '@/components/pdf_viewer'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth, currentUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: {
    chatId: string
  }
}

const ChatPage = async ({ params: {chatId} }: Props) => {
  const { userId } = await auth();
  if (!userId) return redirect('/sign-in');

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
  if (!_chats) return redirect('/')
  if (!_chats.find(chat => chat.id === parseInt(chatId))) return redirect('/')

  const currentChat = _chats.find(chat => chat.id === parseInt(chatId))

  return (
    <div className='flex max-h-screen overflow-hidden'>
      <div className='flex w-full max-h-screen overflow-auto'>
        {/* Chat Sidebar */}
        
        <div className='flex-[2] max-w-xs'>
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)} />
        </div>

        {/* PDF Viewer */}

        <div className='max-h-screen p-4 overflow-auto flex-[5]'>
          <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
        </div>

        {/* Chat Component */}
        
        <div className='flex-[3] border-l-4 border-l-slate-200'>
          <ChatComponent />
        </div>
      </div>
    </div>
  )
}

export default ChatPage
