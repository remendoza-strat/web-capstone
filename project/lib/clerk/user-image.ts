export async function getUserImageAction(clerkId: string): Promise<string | null>{
  // Check clerk id
  if (!clerkId) return null;

  // Pass clerk id as query string
  const res = await fetch(`/api/user-image?clerkId=${clerkId}`);

  // Parse response
  const data = await res.json();

  // Return image url
  return data.imageUrl ?? null;
}