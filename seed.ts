import prisma from "./lib/prisma";

const load = async () => {
    try {
        await prisma.beat.deleteMany()
        console.log('Deleted records in Beat table')

        await prisma.act.deleteMany()
        console.log('Deleted records in Act table')

        await prisma.beatSheet.deleteMany()
        console.log('Deleted records in BeatSheet table')

        await prisma.beatSheet.create({
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