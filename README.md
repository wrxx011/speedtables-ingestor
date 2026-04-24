# speedtables-ingestor

The data is saved under `$pwd/data`

the data is structured like:
```
[
    {
    "header": "Brands Hatch",
    "round": "Round 2",
    "series": "GT World Challenge Europe - Sprint Cup",
    "url": "*/event/247/brands-hatch",
    "sessions": [
        {
            "date": "Saturday, 2 May",
            "sessions": [
                {
                    "label": "Free Practice 1",
                    "localTime": "09:35",
                    "gmt": "08:35"
                },
            ]
        },
    ]
    },
]
```

if you ever intend to use this, use rate limiter


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/sro/index.ts
```

This project was created using `bun init` in bun v1.3.13. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
