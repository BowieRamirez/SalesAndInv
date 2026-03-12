import { config } from "dotenv";
import path from "path";
import { PrismaClient } from "@furnitrack/db";

// Load environment variables IMMEDIATELY
config({ path: path.resolve(__dirname, "../../../.env") });

const ADMIN_USERS = [
    {
        email: "admin@sims.com",
        password: "Admin@2026!",
        name: "Executive Admin",
        role: "ADMIN",
    },
    {
        email: "sales@sims.com",
        password: "Sales@2026!",
        name: "Sales Manager",
        role: "SALES",
    },
    {
        email: "accounting@sims.com",
        password: "Accounting@2026!",
        name: "Head Accountant",
        role: "ACCOUNTING",
    },
    {
        email: "inventory@sims.com",
        password: "Inventory@2026!",
        name: "Warehouse Lead",
        role: "INVENTORY",
    },
    {
        email: "analytics@sims.com",
        password: "Analytics@2026!",
        name: "Data Analyst",
        role: "ANALYTICS",
    },
];

async function seed() {
    console.log("🚀 Starting Admin User Seeding...");

    const authUrl = process.env.NEON_AUTH_BASE_URL;
    if (!authUrl || authUrl.includes("ep-xxx")) {
        console.error("❌ Error: NEON_AUTH_BASE_URL is not set correctly in .env");
        process.exit(1);
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("❌ Error: DATABASE_URL is not set in .env");
        process.exit(1);
    }

    const prisma = new PrismaClient();

    for (const user of ADMIN_USERS) {
        try {
            // 1. Create the user via the signup API
            const endpoint = `${authUrl}/sign-up/email`;

            const signUpResponse = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Origin": authUrl,
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                    name: user.name,
                }),
            });

            const responseText = await signUpResponse.text();
            let signUpResult;

            try {
                signUpResult = JSON.parse(responseText);
            } catch (e) {
                throw new Error(`Server returned non-JSON response (${signUpResponse.status}). Body: ${responseText.substring(0, 100)}...`);
            }

            if (!signUpResponse.ok) {
                if (signUpResult.message?.includes("already exists") || signUpResult.code === "user_already_exists") {
                    // User exists — just make sure role is still correct
                    await prisma.$executeRaw`UPDATE neon_auth.user SET role = ${user.role} WHERE email = ${user.email}`;
                    console.log(`⏩ Skipped: ${user.email} (Already exists, role ensured: ${user.role})`);
                    continue;
                }
                throw new Error(signUpResult.message || `Failed to sign up (${signUpResponse.status})`);
            }

            // 2. Assign the role directly in the database
            await prisma.$executeRaw`UPDATE neon_auth.user SET role = ${user.role} WHERE email = ${user.email}`;
            console.log(`✅ Created: ${user.email} (Role: ${user.role})`);

        } catch (error: any) {
            console.error(`❌ Failed: ${user.email} -> ${error.message}`);
        }
    }

    await prisma.$disconnect();
    console.log("\n✨ Seeding process finished.");
    process.exit(0);
}

seed();
