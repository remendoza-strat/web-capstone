import "dotenv/config"
import { defineConfig } from "drizzle-kit"

// Drizzle configuration
export default defineConfig ({
    out: "./drizzle",                   // Migration path
    schema: "./src/db/schema.ts",       // Schema path
    dialect: "postgresql",              // Database type
    dbCredentials: {
        url: process.env.DATABASE_URL!  // Connection string to database
    }
});