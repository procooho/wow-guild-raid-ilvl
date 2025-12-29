const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { username: 'AwakenOfficer' },
        update: { password: 'AwOf1234' },
        create: {
            username: 'AwakenOfficer',
            password: 'AwOf1234',
            role: 'officer',
        },
    });
    console.log('User created:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
