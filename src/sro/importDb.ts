import { scrapeGTWCSchedule } from "./events";
import { prisma } from "../../lib/prisma";

async function validateTrack(trackUrl) {
  if (trackUrl !== undefined) {
    const url = new URL(trackUrl);
    const circuit = await prisma.circuit.findUnique({
      where: { url: url.href },
      select: { id: true, name: true },
    });
    return circuit;
  } else return undefined;
}

async function insertEvent(event) {
  const circuit = await validateTrack(event.circuitUrl);
  const slug = `${event.header.toLowerCase().replace(/\s+/g, "-")}-${process.env.YEAR}`;

  const sessionData = event.sessions.flatMap((day) =>
    day.sessions.map((session) => ({
      label: session.label,
      type: session.type ?? null,
      scheduledAt: new Date(`${day.date} ${process.env.YEAR} ${session.gmt}:00 UTC`),
      status: "upcoming",
    }))
  );

  const row = await prisma.event.upsert({
    where: { slug },
    update: {
      name: event.header,
      circuit: circuit ? { connect: { id: circuit.id } } : { disconnect: true },
      roundNumber: event.round ? parseInt(event.round.match(/\d+/)?.[0] ?? '0') : null,
      status: "scheduled",
      sessions: {
        deleteMany: {},         // remove old sessions
        create: sessionData,    // recreate with latest data
      },
    },
    create: {
      name: event.header,
      circuit: circuit ? { connect: { id: circuit.id } } : undefined,
      roundNumber: event.round ? parseInt(event.round.match(/\d+/)?.[0] ?? '0') : null,
      slug,
      status: "scheduled",
      sessions: {
        create: sessionData,
      },
    },
  });

  console.log("Upserted event:", row);
}

try {
  const allEvents = await scrapeGTWCSchedule();
  allEvents.forEach((element) => {
    insertEvent(element);
  });
  //await insertEvent(test[0]);
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
