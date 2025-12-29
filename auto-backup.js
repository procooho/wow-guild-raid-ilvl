const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const backupDir = path.join(__dirname, 'db-backups');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
    const backupPath = path.join(backupDir, `dev-${timestamp}.db`);

    try {
        if (fs.existsSync(dbPath)) {
            fs.copyFileSync(dbPath, backupPath);
            console.log(`✅ Auto-backup created: ${path.basename(backupPath)}`);

            // Keep only last 20 backups
            const backups = fs.readdirSync(backupDir)
                .filter(f => f.endsWith('.db'))
                .map(f => ({
                    name: f,
                    path: path.join(backupDir, f),
                    time: fs.statSync(path.join(backupDir, f)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time);

            if (backups.length > 20) {
                backups.slice(20).forEach(backup => {
                    fs.unlinkSync(backup.path);
                });
            }

            return true;
        } else {
            console.log('⚠️  Database file not found, skipping backup');
            return false;
        }
    } catch (error) {
        console.error('❌ Auto-backup failed:', error.message);
        return false;
    }
}

// Run backup immediately
createBackup();

// Schedule backups every 30 minutes
setInterval(() => {
    console.log('\n🔄 Running scheduled backup...');
    createBackup();
}, 30 * 60 * 1000); // 30 minutes

// Keep the process running
console.log('📡 Auto-backup service started (every 30 minutes)');
console.log('💡 Backups are saved to: db-backups/');
