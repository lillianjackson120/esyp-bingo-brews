# ESC Young Professionals Bingo & Brews

A Vercel-ready React/Firebase event bingo system for ESC Young Professionals Bingo & Brews.

## Screens

- `/` — landing page
- `/audience` — TV/projector display
- `/host` — caller controls
- `/admin` — event settings

## What this app does

- Runs a 75-ball bingo caller.
- Syncs host controls to audience displays through Firebase Firestore.
- Supports one active host lock at a time.
- Includes Beer Break, Hold Your Cards, Thank You, and Announcement modes.
- Lets future volunteers update sponsors, table sponsors, and messages in the admin screen.

## Setup

1. Create a Firebase project.
2. Enable Firestore Database.
3. In Firebase Project Settings, create a Web App and copy the config values.
4. Add the values from `.env.example` into Vercel as Environment Variables.
5. Deploy with Vercel.

## Default passcode

Set `VITE_EVENT_PASSCODE` in Vercel. Do not leave the default passcode for the live event.

## Notes

This is designed for a 16:9 TV/projector audience display. Use `/audience` full screen on the TV/projector and `/host` on the caller laptop.
