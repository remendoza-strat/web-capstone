import { Loader2 } from "lucide-react"
import { getUserImage } from "@/lib/db/tanstack"

export default function UserAvatar({ clerkId } : { clerkId: string}){
  // Get clerk image link
  const { data: imageUrl, isLoading } = getUserImage(clerkId);

  // Show loading icon
  if(isLoading){
    return(
      <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
        <Loader2 className="w-4 h-4 text-gray-500 animate-spin"/>
      </div>
    )
  }

  return(
    <img
      src={imageUrl ?? "/default.png"}
      alt="icon"
      className="object-cover w-8 h-8 rounded-full"
    />
  );
}