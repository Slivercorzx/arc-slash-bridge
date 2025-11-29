
# ARC Raiders Slash Commands (Discord) — Vercel + Google Apps Script bridge

## What you get
- **Vercel** `/api/interactions` function that verifies Discord signatures and defers responses (ephemeral).
- **GAS** Web App that receives the forwarded payload and **edits the original interaction**
  with item/craft/drop embeds.

This approach is required because **Google Apps Script cannot read HTTP headers** (needed for Ed25519 verification).

---

## Setup — Discord Developer Portal
1) Create Application → Bot → copy **Application ID** and **Public Key**; add a **Bot token** (reset/copy).
2) OAuth2 → URL Generator: scopes `bot applications.commands`.
   - Permissions: at least `Send Messages`, `Embed Links`.
3) Add the bot to your server via the generated URL.

## Deploy Vercel (free)
1) Create a Vercel project. Put these files:
   - `api/interactions.js`
   - `package.json`
   - `vercel.json`
2) Set **Environment Variables**:
   - `DISCORD_PUBLIC_KEY` = from Developer Portal
   - `GAS_FORWARD_URL` = your GAS Web App URL (see next section)
3) Deploy → copy the production URL, e.g. `https://yourapp.vercel.app/api/interactions`
4) In Developer Portal → **Interactions Endpoint URL** = that URL. Save → it should verify successfully.

## Deploy Google Apps Script (Web App)
1) Go to https://script.google.com → create project → paste `gas/Code.gs`.
2) **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy the Web App URL and set it to Vercel env `GAS_FORWARD_URL`.
3) (Optional) Set Script Properties for registering commands later:
   - `DISCORD_APPLICATION_ID`, `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID`
4) Test GAS endpoint: use `Run → doPost` with sample JSON, or trigger from Vercel by using the command.

## Register Slash Commands (Guild-level, fast)
- In GAS, edit `setSecretsExample()` and run it (or set via Project Settings → Script Properties).
- Run `registerCommandsGuild()` once.
- In Discord, type `/item`, `/craft`, `/drop`.

## Flow
- Discord → Vercel (`/api/interactions`) — verifies signature.
- Vercel immediately replies with **deferred ephemeral** and forwards payload to GAS.
- GAS builds the embed and **edits the original** message via:
  `PATCH /webhooks/{application_id}/{interaction_token}/messages/@original`

## Notes
- The sample item API is a placeholder. Replace/extend `ITEM_SOURCES` to real endpoints.
- If your source supports recursion of materials, you can expand `sumMaterials_()` to walk sub-items.
- To make messages non-ephemeral, set `flags` to `0` in the Vercel response.
