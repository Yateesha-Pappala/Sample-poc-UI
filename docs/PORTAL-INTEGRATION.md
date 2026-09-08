# Running a project built from this template inside the portal

The Self-Service Portal lists each project ("POC") in its catalog and opens it in
an **`<iframe>`** inside a portal-owned workspace page. A few things have to hold
for that to work.

## The app must be iframe-embeddable

- **Do not** send `X-Frame-Options: DENY` / `SAMEORIGIN`.
- If you add a `Content-Security-Policy`, it must allow the portal as a frame
  ancestor: `frame-ancestors 'self' https://<portal-host>`.
- The bundled `nginx/default.conf.template` already follows this — it sets no
  framing headers. Keep it that way.
- Cookies used inside the iframe need `SameSite=None; Secure` (third-party context).

## The container contract

`Dockerfile` + `nginx/default.conf.template` produce an image that:

- listens on **`$PORT`** (Cloud Run injects it; defaults to 8080 locally),
- serves the built SPA with an `index.html` fallback for client-side routes,
- long-caches hashed assets and never caches `index.html`.

```bash
docker build -t my-project .
docker run -p 8080:8080 my-project      # http://localhost:8080
```

## Registering with the portal

An admin adds the project in the portal with:

| Field          | Rule                                                                                               |
| -------------- | -------------------------------------------------------------------------------------------------- |
| **Slug**       | `^[a-z0-9-]+$`, set once. Names the Cloud Run service, the image path and the deploy-pipeline key. |
| **GitHub URL** | required — the pipeline builds from it.                                                            |
| **App URL**    | the deployed URL the portal embeds.                                                                |

## Usage tracking — you do nothing

The portal measures time-in-app itself (it heartbeats while its workspace tab is
open and ends the session on navigation/close). Your project does **not** send
heartbeats, hold a session, or know it's being tracked. There's deliberately no
code for this in the template.

## Theme inside the iframe

The portal and your app each manage their own `.dark` class off `localStorage`.
They don't currently sync across the iframe boundary, so a viewer may need to set
the theme once on each. If you need them coupled, add a `postMessage` listener —
it's not part of the template.
