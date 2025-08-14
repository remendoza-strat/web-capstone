"use client"
import Pusher from "pusher-js"

// Websocket connection to pusher
export const pusherClient = new Pusher(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!}
);

// Current connection unique socket id
export function getSocketId(){
  return pusherClient.connection?.socket_id || null;
}