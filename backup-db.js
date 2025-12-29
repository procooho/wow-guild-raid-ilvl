const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const backupDir = path.join(__dirname, 'db-backups');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Create timestamped backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const timeOfDay = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
const backupPath = path.join(backupDir, `dev-${timestamp}-${timeOfDay}.db`);

try {
    if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, backupPath);
        console.log(`✅ Database backed up to: ${backupPath}`);

        // Keep only last 10 backups
        const backups = fs.readdirSync(backupDir)
            .filter(f => f.endsWith('.db'))
            .map(f => ({
                name: f,
                path: path.join(backupDir, f),
                time: fs.statSync(path.join(backupDir, f)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (backups.length > 10) {
            backups.slice(10).forEach(backup => {
                fs.unlinkSync(backup.path);
                console.log(`🗑️  Removed old backup: ${backup.name}`);
            });
        }

        console.log(`📊 Total backups: ${Math.min(backups.length, 10)}`);
    } else {
        console.log('❌ Database file not found!');
    }
} catch (error) {
    console.error('❌ Backup failed:', error.message);
}
