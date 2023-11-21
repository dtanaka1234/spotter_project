const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const load = async () => {
    try {
        await prisma.Beat.deleteMany()
        console.log('Deleted records in Beat table')

        await prisma.Act.deleteMany()
        console.log('Deleted records in Act table')

        await prisma.BeatSheet.deleteMany()
        console.log('Deleted records in BeatSheet table')

        await prisma.BeatSheet.create({
            data: {
                title: 'Making a cool video!',
            },
        });
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

load()