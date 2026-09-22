# Deployment Guide

Do these in order — each later step needs something from the step before it.

```
1. Neon        → PostgreSQL database, gives you a DATABASE_URL
2. Render      → hosts the FastAPI backend, gives you an API URL
3. Turnstile   → spam protection, gives you a site key + secret key
4. Cloudflare Pages → hosts the React frontend, gives you the public URL
5. Wire it all together (CORS, env vars) and test
```

You said you already have a Cloudflare account, so step 4 starts from
"create a new Pages project."

---

## 1. Create the database on Neon

1. Go to [neon.tech](https://neon.tech) and sign up / log in.
2. **Create a project** → name it `stotrapriya-spiritual-guidance`.
3. On the project's **Connect** screen, copy the connection string. It looks like:
   ```
   postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/dbname?sslmode=require
   ```
4. Change `postgresql://` to `postgresql+psycopg://` at the start (this tells
   SQLAlchemy which driver to use). Save this full string — you'll paste it
   into Render in step 2 and use it locally to run the migration.

Keep this tab open; you'll need the connection string again shortly.

---

## 2. Push the code to GitHub

Render and Cloudflare Pages both deploy from a GitHub repo.

1. Create a new **private** GitHub repository, e.g. `stotrapriya-spiritual-guidance`.
2. From the project folder:
   ```bash
   cd stotrapriya-spiritual-guidance
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/stotrapriya-spiritual-guidance.git
   git push -u origin main
   ```
   The `.gitignore` files already exclude `.env`, `node_modules`, and
   `__pycache__` — your secrets won't be pushed.

---

## 3. Deploy the backend on Render

1. Go to [render.com](https://render.com) and sign up / log in (you can use
   your GitHub account).
2. **New → Web Service** → connect your GitHub repo.
3. Configure:
   - **Root directory:** `backend`
   - **Runtime:** Python 3
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance type:** Free
4. Under **Environment**, add these variables:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | the Neon connection string from step 1 |
   | `JWT_SECRET` | a long random string — generate one with `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
   | `TURNSTILE_SECRET_KEY` | placeholder for now, e.g. `pending` — you'll update it after step 4 |
   | `CORS_ORIGINS` | placeholder for now, e.g. `http://localhost:5173` — you'll update it after step 5 |
5. Click **Create Web Service**. Render will build and deploy; you'll get a
   URL like `https://stotrapriya-api.onrender.com`. Save it.
6. Render's free plan spins the service down after 15 minutes of no traffic
   and takes about a minute to wake up on the next request — expected for a
   low-traffic site like this one.

### Run the database migration

You need to run Alembic once against the Neon database to create the
tables. Easiest way — run it from your own machine, pointed at Neon:

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL="postgresql+psycopg://...your Neon string..."
export JWT_SECRET="anything-for-this-step"
export TURNSTILE_SECRET_KEY="anything-for-this-step"
alembic upgrade head
```

You should see Alembic report it applied revision `0001`. You can confirm
in the Neon dashboard's **Tables** view — you'll see `admin_users`,
`guidance_requests`, and `request_activity`.

### Create your 3 admin accounts

Still in that same terminal (same environment variables set):

```bash
python -m scripts.create_admin
```

It will prompt for name, email, and password. Run it **three times**, once
per Spiritual Guidance Team member. There is no public sign-up page — this
script is the only way admin accounts are created.

---

## 4. Set up Cloudflare Turnstile

1. In the Cloudflare dashboard, go to **Turnstile** in the left sidebar.
2. **Add widget**:
   - **Widget name:** Stotrapriya Spiritual Guidance
   - **Domain:** add the Cloudflare Pages domain you'll get in step 5 (you
     can add `localhost` too, and add the real domain later — Turnstile
     lets you edit domains anytime)
   - **Widget mode:** Managed
3. After creating it, you'll see a **Site Key** and a **Secret Key**. Save both.
4. Go back to your Render service → **Environment** → update
   `TURNSTILE_SECRET_KEY` to the real secret key → save (Render redeploys
   automatically).

---

## 5. Deploy the frontend on Cloudflare Pages

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
2. Select your `stotrapriya-spiritual-guidance` repository and authorize Cloudflare if prompted.
3. Configure the build:
   - **Project name:** `stotrapriya-spiritual-guidance` (this becomes part of your URL)
   - **Production branch:** `main`
   - **Framework preset:** Vite
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Under **Environment variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | your Render URL from step 3, e.g. `https://stotrapriya-api.onrender.com` |
   | `VITE_TURNSTILE_SITE_KEY` | the Turnstile **site key** from step 4 |
5. Click **Save and Deploy**. Cloudflare will build and give you a URL like:
   ```
   https://stotrapriya-spiritual-guidance.pages.dev
   ```
   That's your public website. (The `frontend/public/_redirects` file
   already included in the project tells Cloudflare Pages to route all
   paths through `index.html`, so React Router's pages — `/request`,
   `/admin/login`, etc. — work correctly on refresh and direct links.)

---

## 6. Connect everything together

Two loose ends to close, now that you have the real Pages URL:

1. **Turnstile domain** — go back to the Turnstile widget settings and make
   sure `stotrapriya-spiritual-guidance.pages.dev` (your real domain) is
   listed under allowed domains.
2. **Backend CORS** — go to Render → your service → **Environment** → set
   `CORS_ORIGINS` to your Pages URL, e.g.:
   ```
   https://stotrapriya-spiritual-guidance.pages.dev
   ```
   Save — Render redeploys automatically. Without this, the browser will
   block the frontend from calling the API.

---

## 7. Test it end to end

1. Open your Pages URL and submit a test request through the public form.
   You should land on the confirmation page with a reference number like
   `SP-2026-0001`.
2. Go to `https://stotrapriya-spiritual-guidance.pages.dev/admin/login` and
   sign in with one of the admin accounts you created in step 3.
3. Confirm the test request appears on the dashboard, open it, and change
   its status — check that the activity log records the change.
4. In Neon's **Tables** view, spot-check that the row and its activity
   entry are there.

---

## Notes for later

- **Custom domain:** once this is working, Cloudflare Pages lets you attach
  a custom domain under the project's **Custom domains** tab — you don't
  need to buy one for this to work, `pages.dev` is permanent and free.
- **Render cold starts:** if the ~1-minute wake-up on the free tier bothers
  you later, Render's paid tier removes it — not needed for an initial
  launch.
- **Rotating secrets:** if `JWT_SECRET` or the Turnstile secret ever leak,
  generate a new one and update it in Render; existing admin sessions will
  simply need to log in again.
