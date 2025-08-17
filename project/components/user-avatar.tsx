import { getUserImage } from "@/lib/hooks/projectMembers"
import { Loader2 } from "lucide-react"

export function UserAvatar({ clerkId }: { clerkId: string}) {
  const { data: imageUrl, isLoading } = getUserImage(clerkId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
      </div>
    )
  }

  return (
    <img
      src={imageUrl ?? "/default-avatar.png"}
      alt="icon"
      className="object-cover w-8 h-8 rounded-full"
    />
  )
}
