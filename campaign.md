# ChatGPT Ads — first test

Paused until the live site has the booking redirect and the pixel is receiving `appointment_scheduled`.

## Campaign

| Setting | Value |
| --- | --- |
| Name | Agency AI production — diagnosis |
| Objective | Conversions |
| Conversion event | `appointment_scheduled` |
| Billing | Valid clicks (oCPC). Delivery is biased toward bookings. You are not billed per booking. |
| Status | Paused |
| Countries | US, GB, CA, AU |
| Landing URL | The live homepage |
| Query string | `utm_source=openai&utm_medium=paid&utm_campaign={campaign_id}&utm_content={ad_id}&click_id={oppref}` |

The conversion event is locked at creation. This page books a meeting, so the event is `appointment_scheduled`. A `lead_created` campaign would optimize toward a form this site does not have.

In Cal.com or Calendly, set the confirmation redirect to `https://YOUR_DOMAIN/thanks`. That page fires the pixel. Add three booking questions: agency name, role, and what clients are asking for.

## Ad group

Name: Agencies — sellable AI production

One group. Hints describe situations, not keywords.

### Context hints

1. A creative agency owner figuring out how to sell AI image or video production to clients
2. An agency producer trying to turn Midjourney, Runway, or similar tools into a repeatable client workflow
3. An advertising agency weighing the cost of AI stills and social video against a traditional shoot
4. A creative director who wants AI creative scoped, reviewed, and billed like other agency work
5. An agency founder comparing an internal AI studio with freelancers for AI video and images
6. A head of production whose team experiments with AI and cannot yet deliver it as a client service
7. An agency whose clients are asking for AI campaign visuals or short films
8. Someone at a creative agency looking for a system that produces on-brand AI ads as a repeatable job

### Exclusion hints

1. Students or hobbyists learning AI image generation for themselves
2. People shopping for an AI image or video generator subscription
3. Adult, NSFW, or explicit creative production
4. Job seekers looking for work as AI artists
5. In-house marketing teams that do not sell creative services to clients

## Ads

Chat card. Title hard max 50, body hard max 100. These sit inside the shorter range that actually shows on the card (title 16–24, body 32–48). One 640×640 image can be shared across the set for the first test. Create every ad paused.

| # | Title | Body |
| --- | --- | --- |
| 1 | Skip the AI workshop | Put the experiments into production. |
| 2 | AI that you can sell | Midjourney is not a client deliverable. |
| 3 | Worth putting in production | Flux, Runway, Kling, Veo. Then what? |
| 4 | From frames to a job | Brief, references, select, deliver. |
| 5 | Your producers can run it | One workflow. Then they own it. |
| 6 | Clients are asking for AI | Talk it through. Twenty minutes. |
| 7 | No sales deck | Twenty minutes with Koby. |
| 8 | Already experimenting? | Figure out what belongs on a job. |
| 9 | AI in the actual job | Review it, price it, deliver it again. |
| 10 | Talk to Koby | 20 minutes. No workshop. |

## Before you unpause

1. Homepage CTA opens the real scheduler.
2. A test booking lands on `/thanks`.
3. Ads Manager shows `appointment_scheduled` from that test.
4. Daily cap is an amount you can lose while the optimizer is still guessing. Leave the campaign paused until those three checks pass.
