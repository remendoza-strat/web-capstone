import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/lib/db/schema"
import * as relations from "@/lib/db/relations"

// Create client to send queries to neon database
const client  = neon(process.env.DATABASE_URL!);

// Database instance to query neon database
export const db = drizzle(client, { schema: {...schema, ...relations} });