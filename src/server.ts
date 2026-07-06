import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";


const PORT = config.port || 5000;

async function main() {
    try {
        //* connect to database
        await prisma.$connect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        //* disconnect from database and exit processss
        await prisma.$disconnect();
        process.exit(1);
    }
}
main()