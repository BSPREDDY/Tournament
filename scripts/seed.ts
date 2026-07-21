import { db } from '@/src/lib/db';
import { UserTable } from '@/src/db/schema/schema';
import { hashPassword } from '@/src/lib/hash';

async function seed() {
    try {
        console.log('Seeding database...');

        // Create admin user
        const adminPassword = await hashPassword('admin123');
        await db.insert(UserTable).values({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@tournament.com',
            password: adminPassword,
            phoneNumber: '+1234567890',
            role: 'admin',
        }).onConflictDoNothing();

        // Create test user
        const userPassword = await hashPassword('user123');
        await db.insert(UserTable).values({
            firstName: 'Test',
            lastName: 'User',
            email: 'user@tournament.com',
            password: userPassword,
            phoneNumber: '+1234567891',
            role: 'user',
        }).onConflictDoNothing();

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
