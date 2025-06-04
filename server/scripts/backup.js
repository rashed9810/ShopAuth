const { exec } = require("child_process");
const path = require("path");
const fs = require("fs").promises;
const logger = require("../config/logger");

const BACKUP_DIR = path.join(__dirname, "../backups");
const DB_NAME = process.env.MONGODB_NAME || "shopauth";

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

  try {
    // Ensure backup directory exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    // Run mongodump
    const command = `mongodump --db ${DB_NAME} --out "${backupPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error("Backup failed:", error);
        return;
      }

      logger.info(`Backup completed successfully at ${backupPath}`);

      // Clean up old backups (keep last 5)
      cleanupOldBackups();
    });
  } catch (error) {
    logger.error("Backup process failed:", error);
  }
}

async function cleanupOldBackups() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const backups = files
      .filter((file) => file.startsWith("backup-"))
      .map((file) => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        time: fs.stat(path.join(BACKUP_DIR, file)).then((stat) => stat.mtime),
      }));

    // Sort backups by date and keep only the last 5
    const sortedBackups = (await Promise.all(backups))
      .sort((a, b) => b.time - a.time)
      .slice(5);

    // Remove old backups
    for (const backup of sortedBackups) {
      await fs.rm(backup.path, { recursive: true });
      logger.info(`Removed old backup: ${backup.name}`);
    }
  } catch (error) {
    logger.error("Cleanup of old backups failed:", error);
  }
}

// If running directly, execute backup
if (require.main === module) {
  createBackup();
}

module.exports = { createBackup };
