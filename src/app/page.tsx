import Link from "next/link";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file_upload";

export default async function Home() {
  const { userId } = auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-tr from-indigo-200 via-red-200 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <h1 className="mr-3 text-5xl font-bold">
            Chat with any PDF
          </h1>

          { isAuth && (
            <div className="flex mt-6 mb-4">
              <Button> Go to Chats </Button>
            </div>
          )}

          <p className="max-w-xl mt-4 text-lg leading-6 text-slate-600"> 
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

      <h1 className="text-xl font-semibold absolute top-6 left-6"> ContextPDF </h1>

      <div className="absolute top-6 right-6">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}
