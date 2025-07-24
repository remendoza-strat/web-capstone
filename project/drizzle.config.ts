import "dotenv/config"
import { defineConfig } from "drizzle-kit"

// Drizzle configuration
export default defineConfig({
    out: "./lib/db/drizzle",                // Migration path
    schema: "./lib/db/schema.ts",           // Schema path
    dialect: "postgresql",                  // Database type
    dbCredentials:{
        url: process.env.DATABASE_URL!      // Connection string to database
    }
});