import { PrismaClient } from '@prisma/client';
import { emailService } from '../lib/email';

const prisma = new PrismaClient();

async function testNotifications() {
    try {
        console.log('🧪 Testing notification system...\n');

        // Test 1: Check email service connection
        console.log('1. Testing email service connection...');
        const connectionTest = await emailService.testConnection();
        console.log(`   Email service connection: ${connectionTest ? '✅ OK' : '❌ FAILED'}\n`);

        // Test 2: Find a raffle with winner
        console.log('2. Looking for a raffle with assigned winner...');
        const raffleWithWinner = await prisma.raffle.findFirst({
            where: {
                status: 'drawn',
                winnerName: { not: null }
            },
            select: {
                id: true,
                title: true,
                winnerName: true,
                winnerEmail: true,
                winnerTicketNumber: true
            }
        });

        if (!raffleWithWinner) {
            console.log('   ❌ No raffle with winner found. Please assign a winner first.\n');
            return;
        }

        console.log(`   ✅ Found raffle: "${raffleWithWinner.title}"`);
        console.log(`   Winner: ${raffleWithWinner.winnerName} (${raffleWithWinner.winnerEmail})`);
        console.log(`   Winning ticket: #${raffleWithWinner.winnerTicketNumber.toString().padStart(4, '0')}\n`);

        // Test 3: Get all participants
        console.log('3. Getting all participants...');
        const allTickets = await prisma.ticket.findMany({
            where: {
                raffleId: raffleWithWinner.id,
                paymentStatus: 'confirmed'
            },
            select: {
                ticketNumber: true,
                buyerName: true,
                buyerEmail: true
            }
        });

        console.log(`   ✅ Found ${allTickets.length} confirmed tickets`);

        // Group by email
        const participants = new Map<string, {
            buyerName: string;
            buyerEmail: string;
            ticketNumbers: number[];
        }>();

        allTickets.forEach(ticket => {
            if (participants.has(ticket.buyerEmail)) {
                participants.get(ticket.buyerEmail)!.ticketNumbers.push(ticket.ticketNumber);
            } else {
                participants.set(ticket.buyerEmail, {
                    buyerName: ticket.buyerName,
                    buyerEmail: ticket.buyerEmail,
                    ticketNumbers: [ticket.ticketNumber]
                });
            }
        });

        console.log(`   ✅ Found ${participants.size} unique participants\n`);

        // Test 4: Test winner notification
        console.log('4. Testing winner notification...');
        try {
            const winnerResult = await emailService.sendWinnerNotification({
                winnerName: raffleWithWinner.winnerName!,
                winnerEmail: raffleWithWinner.winnerEmail!,
                raffleTitle: raffleWithWinner.title,
                ticketNumber: raffleWithWinner.winnerTicketNumber!,
                prize: raffleWithWinner.title,
            });
            console.log(`   Winner notification: ${winnerResult ? '✅ SENT' : '❌ FAILED'}`);
        } catch (error) {
            console.log(`   ❌ Winner notification failed: ${error}`);
        }

        // Test 5: Test non-winner notification (first non-winner)
        console.log('\n5. Testing non-winner notification...');
        const nonWinner = Array.from(participants.values()).find(
            p => p.buyerEmail !== raffleWithWinner.winnerEmail
        );

        if (nonWinner) {
            try {
                const nonWinnerResult = await emailService.sendNonWinnerNotification({
                    buyerName: nonWinner.buyerName,
                    buyerEmail: nonWinner.buyerEmail,
                    raffleTitle: raffleWithWinner.title,
                    ticketNumbers: nonWinner.ticketNumbers,
                    winnerName: raffleWithWinner.winnerName!,
                    winnerTicketNumber: raffleWithWinner.winnerTicketNumber!,
                });
                console.log(`   Non-winner notification: ${nonWinnerResult ? '✅ SENT' : '❌ FAILED'}`);
                console.log(`   Sent to: ${nonWinner.buyerEmail}`);
            } catch (error) {
                console.log(`   ❌ Non-winner notification failed: ${error}`);
            }
        } else {
            console.log('   ⚠️ No non-winners found to test');
        }

        // Test 6: Test admin notification
        console.log('\n6. Testing admin notification...');
        try {
            const adminResult = await emailService.sendRaffleDrawNotification({
                raffleTitle: raffleWithWinner.title,
                winnerName: raffleWithWinner.winnerName!,
                winnerEmail: raffleWithWinner.winnerEmail!,
                winnerTicketNumber: raffleWithWinner.winnerTicketNumber!,
                totalParticipants: participants.size,
                totalTickets: allTickets.length,
            });
            console.log(`   Admin notification: ${adminResult ? '✅ SENT' : '❌ FAILED'}`);
        } catch (error) {
            console.log(`   ❌ Admin notification failed: ${error}`);
        }

        console.log('\n🎉 Notification system test completed!');
        console.log('\n📋 Summary:');
        console.log(`   - Raffle: "${raffleWithWinner.title}"`);
        console.log(`   - Total participants: ${participants.size}`);
        console.log(`   - Total tickets: ${allTickets.length}`);
        console.log(`   - Winner: ${raffleWithWinner.winnerName} (${raffleWithWinner.winnerEmail})`);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the test
testNotifications();
