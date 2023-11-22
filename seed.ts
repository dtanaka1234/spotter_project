import prisma from "./lib/prisma";

const load = async () => {
    try {
        await prisma.beat.deleteMany()
        console.log('Deleted records in Beat table')

        await prisma.act.deleteMany()
        console.log('Deleted records in Act table')

        await prisma.beatSheet.deleteMany()
        console.log('Deleted records in BeatSheet table')

        await prisma.$queryRaw`
            ALTER SEQUENCE "BeatSheet_id_seq" RESTART WITH 1;
        `;

        await prisma.$queryRaw`
            ALTER SEQUENCE "Act_id_seq" RESTART WITH 1;
        `;

        await prisma.$queryRaw`
            ALTER SEQUENCE "Beat_id_seq" RESTART WITH 1;
        `;

        var beatSheet = await prisma.beatSheet.create({
            data: {
                title: 'Making a cool video!',
            },
        });

        var act1 = await prisma.act.create({
            data: {
                beatSheetId: beatSheet.id,
                description: 'This is act 1',
            },
        });

        await prisma.beat.create({
            data: {
                actId: act1.id,
                description: 'This is beat 1',
                duration: 24,
                cameraAngle: 'ANGLE1',
            },
        });

        await prisma.beat.create({
            data: {
                actId: act1.id,
                description: 'This is beat 2',
                duration: 60,
                cameraAngle: 'ANGLE2',
            },
        });

        var act2 = await prisma.act.create({
            data: {
                beatSheetId: beatSheet.id,
                description: 'This is act 2',
            },
        });

        await prisma.beat.create({
            data: {
                actId: act2.id,
                description: 'This is beat 1',
                duration: 24,
                cameraAngle: 'ANGLE1',
            },
        });

        await prisma.beat.create({
            data: {
                actId: act2.id,
                description: 'This is beat 2',
                duration: 60,
                cameraAngle: 'ANGLE2',
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