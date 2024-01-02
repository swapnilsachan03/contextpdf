import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600">
      <SignUp />
    </div>
  );
}
