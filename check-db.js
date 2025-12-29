const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        console.log('\n=== DATABASE INTEGRITY CHECK ===\n');

        // Check Raiders
        const raiders = await prisma.raider.findMany();
        console.log(`✓ Raiders: ${raiders.length} records found`);
        if (raiders.length > 0) {
            console.log('  Sample:', raiders.slice(0, 3).map(r => `${r.name} (${r.server})`).join(', '));
        }

        // Check Users
        const users = await prisma.user.findMany();
        console.log(`✓ Users: ${users.length} records found`);
        if (users.length > 0) {
            console.log('  Sample:', users.map(u => u.username).join(', '));
        }

        // Check Notices
        const notices = await prisma.notice.findMany();
        console.log(`✓ Notices: ${notices.length} records found`);

        // Check Officer Posts
        const posts = await prisma.officerPost.findMany();
        console.log(`✓ Officer Posts: ${posts.length} records found`);

        // Check Item Level History
        const history = await prisma.itemLevelHistory.findMany();
        console.log(`✓ Item Level History: ${history.length} records found`);

        console.log('\n=== DATABASE IS INTACT ===\n');

    } catch (error) {
        console.error('❌ Database Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
