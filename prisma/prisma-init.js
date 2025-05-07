const { execSync } = require('child_process');

/**
 * Executes the migrations and seeds the database synchronously.
 */

try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    execSync('npx prisma db seed', { stdio: 'inherit' });
} catch (error) {
    console.error('Migration or seed failed:', error);
    process.exit(1);
}
