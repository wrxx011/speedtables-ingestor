import { scrapeGTWCSchedule } from "./events";
import { prisma } from "../../lib/prisma";

const test = [
  {
    "header": "Brands Hatch",
    "round": "Round 2",
    "series": "GT World Challenge Europe - Sprint Cup",
    "url": "https://www.gt-world-challenge-europe.com/event/247/brands-hatch",
    "circuitUrl": "https://www.brandshatch.co.uk",
    "sessions": [
      {
        "date": "Saturday, 2 May",
        "sessions": [
          {
            "label": "Free Practice 1",
            "type": "practice",
            "localTime": "09:35",
            "gmt": "08:35"
          },
          {
            "label": "Free Practice 2",
            "type": "practice",
            "localTime": "12:00",
            "gmt": "11:00"
          },
          {
            "label": "",
            "type": "unknown",
            "localTime": "16:40",
            "gmt": "15:40"
          },
          {
            "label": "",
            "type": "unknown",
            "localTime": "17:05",
            "gmt": "16:05"
          }
        ]
      },
      {
        "date": "Sunday, 3 May",
        "sessions": [
          {
            "label": "",
            "type": "unknown",
            "localTime": "09:05",
            "gmt": "08:05"
          },
          {
            "label": "Race 1",
            "type": "race",
            "localTime": "11:15",
            "gmt": "10:15"
          },
          {
            "label": "Race 2",
            "type": "race",
            "localTime": "15:45",
            "gmt": "14:45"
          }
        ]
      }
    ]
  }
]

async function validateTrack(trackUrl) {
  if(trackUrl!==undefined){
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
  const row = await prisma.event.create({
    data: {
      name: event.header,
      circuit: circuit ? { connect: { id: circuit.id } } : undefined,
      roundNumber: event.round ? parseInt(event.round.match(/\d+/)?.[0] ?? '0') : null,
      slug: `${event.header.toLowerCase().replace(/\s+/g, "-")}-${process.env.YEAR}`,
      status: "scheduled",
      sessions: {
        create: event.sessions.flatMap((day) =>
          day.sessions.map((session) => ({
            label: session.label,
            type: session.type ?? null,
            scheduledAt: new Date(
              `${day.date} ${process.env.YEAR} ${session.scheduledAt?.replace(" GMT", "") ?? session.gmt}:00`,
            ),
            status: "upcoming",
          })),
        ),
      },
    },
  });
  console.log("Created event:", row);
}

try {
  const allEvents = await scrapeGTWCSchedule();
  allEvents.forEach(element => {
    insertEvent(element)
  });
  //await insertEvent(test[0]);
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
