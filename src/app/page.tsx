import Link from "next/link";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowRight, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file_upload";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/subscription_button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = auth()
  const isAuth = !!userId
  const isPro = await checkSubscription()

  let firstChat

  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId))
    firstChat = firstChat[0]
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-tr from-indigo-200 via-red-200 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <h1 className="mr-3 text-5xl font-bold">
            Chat with any PDF
          </h1>

          <div className='flex mt-6 mb-4'>
            { isAuth && firstChat &&
              <Link href={`chat/${firstChat.id}`}>
                <Button> Go to Chats <ArrowRight className='ml-2' /> </Button>
              </Link>
            }

            <div className='ml-3'>
              <SubscriptionButton isPro={isPro} />
            </div>
          </div>

          <p className="max-w-xl mt-4 text-lg leading-6 text-zinc-800">
            Join millions of students, researchers and professionals to instantly answer questions and understand research with AI
          </p>

          <div className="w-full mt-6">
            { isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Log in to get started
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <Link href="/" className="text-xl font-semibold absolute top-6 left-6">
        <h1> ContextPDF </h1>
      </Link>

      <div className="absolute top-6 right-6">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}
