import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        const adminEmail = 'admin@ganaxdar.com';
        const adminPassword = 'admin123'; // Change this to a secure password

        // Check if admin user already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        // Create admin user
        const adminUser = await prisma.user.create({
            data: {
                name: 'Administrador',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            }
        });

        console.log('Admin user created successfully:', {
            id: adminUser.id,
            email: adminUser.email,
            role: adminUser.role
        });
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
