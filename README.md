# 📚 PhD‑Defense Scheduling App

A modern **Next.js 15** application that streamlines scheduling PhD‐defense slots between a student and multiple judges.  It features a polished Persian‑language UI (RTL), calendar‑style slot picking, and a simple JSON API for storing responses.

---

## Table of contents

1. [Features](#features) 2. [Tech‑stack](#tech-stack) 3. [Local setup](#local-setup) 4. [Production build](#production-build) 5. [Deployment recipes](#deployment-recipes) 6. [Domain & Caddy](#domain--caddy) 7. [Environment vars](#environment-vars)

---

## Features

| Category        | Details                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| **UI**          | Tailwind CSS v4, Persian RTL typography, responsive, accessible               |
| **Calendar**    | Three‑week grid • weekend/holiday dimming • one‑click multiple‑slot selection |
| **Persistence** | Simple JSON file (`data/responses.json`) via `/api/submit`                    |
| **Prod ready**  | Stand‑alone `next start` build, Dockerfile, systemd & PM2 samples             |
| **Security**    | Opinionated Caddy headers (HSTS, X‑Frame‑Options, etc.)                       |

---

## Tech stack<a id="tech-stack"></a>

* **Next.js 15 App Router**  – SSR/ISR pages
* **React 19**
* **Tailwind 4 (CSS‑first)**  – design tokens & utilities  ([tekru.net](https://tekru.net/en/blog/deploy-a-next-js-app-with-caddy/?utm_source=chatgpt.com))
* **Caddy 2** reverse‑proxy with automatic Let’s Encrypt HTTPS  ([caddyserver.com](https://caddyserver.com/docs/automatic-https?utm_source=chatgpt.com))

---

## Local setup<a id="local-setup"></a>

```bash
# clone & install
git clone git@github.com:alireza787b/phd-defense-scheduling.git
cd phd-defense-scheduling
npm ci

# development server (hot‑reload on http://localhost:3000)
npm run dev
```

---

## Production build<a id="production-build"></a>

```bash
npm run build        # creates .next/standalone bundle
PORT=3120 npm start  # serve on chosen port (default 3000)
```

> **Tip:** keep the port configurable (`PORT` env) so you can reverse‑proxy different instances easily.  ([stackoverflow.com](https://stackoverflow.com/questions/64644912/how-to-set-port-for-next-js-on-pm2?utm_source=chatgpt.com))

---

## Deployment recipes<a id="deployment-recipes"></a>

### 1 · systemd (unit on bare VPS)

```ini
# /etc/systemd/system/phd-defense.service
[Unit]
Description=PhD Defense (Next.js)
After=network.target

[Service]
WorkingDirectory=/srv/phd-defense-scheduling
Environment=PORT=3120
ExecStart=/usr/bin/npm start
Restart=on-failure
User=deploy

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now phd-defense
```

Keeps the app alive on crashes & reboots.  ([medium.com](https://medium.com/%40byyilmaz/how-i-deploy-nextjs-with-systemd-nginx-and-cerbot-ef37a3619e49?utm_source=chatgpt.com), [caddy.community](https://caddy.community/t/multi-domain-application-for-nextjs-and-caddy-server/23001?utm_source=chatgpt.com))

### 2 · Docker Compose

```yaml
# docker-compose.yml
services:
  app:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./:/app
    command: sh -c "npm ci && npm run build && npm start -p 3120"
    ports: [ "3120:3120" ]
    restart: always   # auto‑heal & boot‑start  ([stackoverflow.com](https://stackoverflow.com/questions/68872370/if-i-run-a-node-js-app-in-docker-compose-with-restart-always-do-i-still-need?utm_source=chatgpt.com))
```

`docker compose up -d --build` builds and runs in the background.

### 3 · PM2 (Node ecosystem)

```bash
pm install -g pm2
pm2 start npm --name phd-defense -- start -- -p 3120   # single line
pm2 save && pm2 startup                                # auto‑start on boot
```

 ([medium.com](https://medium.com/%40silviuks/pm2-start-nextjs-app-on-preferred-port-8c632b725442?utm_source=chatgpt.com))

---

## Domain & Caddy<a id="domain--caddy"></a>

1. **DNS** – add an **A‑record** `phd-defend.joomtalk.ir → <VPS‑IP>` at your registrar. ([serverfault.com](https://serverfault.com/questions/1050013/pointing-my-domain-name-to-my-vps?utm_source=chatgpt.com))
2. **Caddyfile** – append:

   ```caddyfile
   phd-defend.joomtalk.ir {
       import security_headers
       reverse_proxy * http://localhost:3120
   }
   ```
3. **Reload** Caddy:

   ```bash
   sudo caddy reload --config /root/Caddyfile
   ```

   Caddy will obtain/renew Let’s Encrypt certificates automatically. ([caddyserver.com](https://caddyserver.com/docs/automatic-https?utm_source=chatgpt.com))

Troubleshooting ACME errors? Check `journalctl -u caddy` for `failed to obtain certificate` messages; usually ports 80/443 or DNS propagation. ([loadforge.com](https://loadforge.com/guides/configuration-of-caddyfile-for-lets-encrypt-integration?utm_source=chatgpt.com))

---

## Environment vars<a id="environment-vars"></a>

| Variable   | Default      | Purpose                          |
| ---------- | ------------ | -------------------------------- |
| `PORT`     | `3120`       | Port that `npm start` listens on |
| `NODE_ENV` | `production` | Optimised build when set         |

Create an `.env.local` for anything sensitive (DB keys, SMTP, etc.)—it’s already in `.gitignore`.

---

## Quick deploy cheat‑sheet

```bash
# 1. clone & build
 # ssh  to vps
cd /srv && git clone git@github.com:alireza787b/phd-defense-scheduling.git
cd phd-defense-scheduling && npm ci && npm run build

# 2. run under systemd (one‑time setup)
sudo cp deploy/phd-defense.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now phd-defense

# 3. configure domain (DNS A‑record) and add block in Caddyfile
sudo caddy reload --config /root/Caddyfile
```

You’re live at **[https://phd-defend.joomtalk.ir](https://phd-defend.joomtalk.ir)** in under 5 minutes 🚀.

---

## License

MIT — see `LICENSE` file.
