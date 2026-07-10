import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

import { PrismaClient } from "../generated/prisma/client";
import config from "../src/config";

const pool = new Pool({ connectionString: config.database_url });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
    console.log("Seeding GearUp database starting...");

    // password hash
    const adminPassword = await bcrypt.hash("22422242#", 12);
    const commonPassword = await bcrypt.hash("password123", 12);

    // Default Admin User create
    const admin = await prisma.user.upsert({
        where: { email: "milonchandro35@gmail.com" },
        update: {},
        create: {
            name: "Milon Chandra",
            email: "milonchandro35@gmail.com",
            password: adminPassword,
            role: "ADMIN",
        },
    });
    console.log("✅ Admin account ready!");

    // Default Provider User create
    const provider = await prisma.user.upsert({
        where: { email: "provider@gmail.com" },
        update: {},
        create: {
            name: "Hero Provider",
            email: "provider@gmail.com",
            password: commonPassword,
            role: "PROVIDER",
        },
    });
    console.log("✅ Provider account ready!");

    // Default Customer User create
    const customer = await prisma.user.upsert({
        where: { email: "customer@gmail.com" },
        update: {},
        create: {
            name: "Hero Customer",
            email: "customer@gmail.com",
            password: commonPassword,
            role: "CUSTOMER",
        },
    });
    console.log("✅ Customer account ready!");

    // Category create
    await prisma.category.createMany({
        data: [
            { id: "cat-tennis", name: "Tennis" },
            { id: "cat-cricket", name: "Cricket" },
            { id: "cat-football", name: "Football" },
        ],
        skipDuplicates: true,
    });
    console.log("✅ Categories seeded!");

    // Gear item create
    await prisma.gearItem.createMany({
        data: [
            {
                id: "gear-tennis-1",
                title: "Wilson Pro Staff Racket v14",
                description: "Professional tennis racket offering ultimate precision and classic feel.",
                brand: "Wilson",
                pricePerDay: 450,
                stock: 5,
                isAvailable: true,
                providerId: provider.id,
                categoryId: "cat-tennis",
            },
            {
                id: "gear-cricket-1",
                title: "SS King Custom Cricket Bat",
                description: "Premium Grade 1 English Willow cricket bat with huge edges and light pickup.",
                brand: "SS",
                pricePerDay: 600,
                stock: 3,
                isAvailable: true,
                providerId: provider.id,
                categoryId: "cat-cricket",
            },
            {
                id: "gear-football-1",
                title: "Adidas Al Rihla Official Match Ball",
                description: "FIFA Quality Pro certified official match ball for high-durability performance.",
                brand: "Adidas",
                pricePerDay: 200,
                stock: 10,
                isAvailable: true,
                providerId: provider.id,
                categoryId: "cat-football",
            },
        ],
        skipDuplicates: true,
    });

    console.log("\n===============================================");
    console.log("🎉 Seed complete! Credentials summary:");
    console.log("👤 Admin: milonchandro35@gmail.com / 22422242#");
    console.log("👤 Provider: provider@gmail.com / password123");
    console.log("👤 Customer: customer@gmail.com / password123");
    console.log("==================================================\n");
}

main()
    .catch((e) => {
        console.error("❌ Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end(); // Close the database connection
    });