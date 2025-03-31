<img src="https://github.com/user-attachments/assets/8c96711e-f640-4c2b-8284-a052219f719b" alt="drawing" width="200"/>

# Blood Manager Frontend
Blood Manager is an open-source, inofficial web tool to track [Blood on the Clocktower](https://bloodontheclocktower.com/) games.
This repository contains the React frontend. You can find the backend [here](https://github.com/tikelespike/gamestats).

Please note that this project is a very early work in progress.
The vision is that this tool will allow groups to track their games, player statistics like win rate or rate of being in good/evil team, characters already played, achievements, a level/xp system...

## Running the frontend
Simply run:

```sh
npm run dev
```

There is currently no Dockerfile yet.

Make sure to set the needed environment variables, for example via a `.env` file. You can use the example envfile for reference.

## Documentation
The frontend is built using [React](https://react.dev/), [Redux](https://redux-toolkit.js.org/)/RTK Query and [Mantine](https://mantine.dev/). Currently, there is no other documentation available.
