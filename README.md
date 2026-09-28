# CerebroBro

Landing page for creative agencies. Talk to Koby. The sprint is sold after the call. See `sales.md` and `campaign.md`.

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_BOOKING_URL` to the Cal.com or Calendly event. In that scheduler, redirect the confirmation to `/thanks`.

Set `NEXT_PUBLIC_OPENAI_PIXEL_ID` once the ChatGPT Ads pixel exists. `/thanks` sends `appointment_scheduled`.

```bash
npm run dev
```
