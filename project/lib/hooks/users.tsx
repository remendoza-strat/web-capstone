import { useQuery } from "@tanstack/react-query"
import { getUserIdAction } from "@/lib/db/actions"

// Uses getUserIdAction()
export function getUserId(clerkId: string, options? : { enabled?: boolean }){
  return useQuery({
    queryKey: ["users", clerkId],
    queryFn: async () => {
      const data = await getUserIdAction(clerkId);
      return data;
    },
    enabled: options?.enabled ?? !!clerkId
  });
}