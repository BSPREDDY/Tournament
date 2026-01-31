import { defineConfig } from "drizzle-kit"

export default defineConfig({
    schema: "./src/db/schema/schema.ts",
    out: "./drizzle",

    // ✅ Use dialect instead of driver
    dialect: "postgresql",

    // ✅ Use `url` instead of connectionString
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    },

    verbose: true,
    strict: true,
})
