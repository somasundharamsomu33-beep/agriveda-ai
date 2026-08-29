# 🌾 AgriVeda AI 

AgriVeda AI is a comprehensive, AI-powered agricultural platform designed to empower farmers with localized actionable insights, weather patterns, disease detection via computer vision, market price tracking, and community intelligence. 

The infrastructure is powered by a robust **React + Vite Frontend** coupled with an **Express Node.js Backend**, securely managed by an enterprise **Supabase (PostgreSQL)** database.

---

## 🏗️ Technical Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion
- **Backend AI API:** Node.js, Express, TypeScript (Llama-3.3-70B via Groq & Gemini 3.6 Vision)
- **Database Architecture:** Supabase PostgreSQL
- **Authentication:** Supabase Auth (Google OAuth & JWT)
- **Realtime Services:** Supabase WebSockets (`supabase_realtime` pub/sub)

---

## 🚀 Local Development

### 1️⃣ Cloud Database Initialization
AgriVeda natively runs entirely on Supabase.
1. Create a free account at [Supabase](https://supabase.com/).
2. Run the secure authentication CLI locally:
   ```bash
   npx supabase login
   npx supabase link --project-ref [YOUR_PROJECT_ID]
   ```
3. Push your backend architectural migrations to the cloud (creating 10 robust SQL tables instantly):
   ```bash
   npx supabase db push
   ```

### 2️⃣ Environment Configuration
Create a `.env` file in the root of the project:
```env
# AI Services
GEMINI_API_KEY="your_gemini_api_key_here"
GROQ_API_KEY="your_groq_api_key_here"

# Supabase Connectivity
VITE_SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:5432/postgres"
```

### 3️⃣ Starting the Servers
AgriVeda utilizes an optimized monorepo system. To boot both the Vite Dashboard and Node.js Controller simultaneously:
```bash
npm install
npm run dev
```
> **View Dashboard:** `http://localhost:3000`

---

## 🌍 Hosting & Deployment (Vercel)

The entire AgriVeda platform can be seamlessly hosted via edge networks using Vercel.

**Automated GitHub Deployment (Recommended)**
1. Ensure your repository is pushed to GitHub.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" -> "Project"**.
3. Import your GitHub repository.
4. Expand **Environment Variables** and securely paste your `.env` secrets (`GEMINI_API_KEY`, `VITE_SUPABASE_URL`, etc.).
5. Click **Deploy**.

*Vercel will natively detect the built-in `vercel.json` routing configuration and proxy the `/api/*` endpoints to your unified Edge Server.*

---

## 📂 Core End-to-End Modules

- **AI Crop Pathology Scanner:** Extracts secure Supabase Auth JWTs locally and securely proxies images to the Express `/api/analyze-crop` container for Groq/Gemini Llama diagnoses. Automatically pushes results directly into the `crop_diagnosis_reports` PostgreSQL table.
- **B2B Escrow Marketplace:** Complex Multi-vendor catalog natively authenticated with PostgreSQL Triggers (`handle_new_user`) guaranteeing no data drift between anonymous profiles and marketplace listings.
- **Realtime Agronomy Community:** Websocket architecture enabled via `Supabase Realtime` Channels, providing millisecond-latency streaming updates whenever global experts reply to community crop-sickness threads. 
