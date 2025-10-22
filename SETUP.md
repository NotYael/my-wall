# Setup Guide

Complete setup instructions for the My Wall application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Supabase Configuration](#supabase-configuration)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Storage Setup](#storage-setup)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For version control ([Download](https://git-scm.com/))
- **Supabase Account**: Sign up at [supabase.com](https://supabase.com)

## Project Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd my-wall
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:

- React 19.1.1
- Supabase JS Client 2.76.0
- Vite 7.1.7
- ESLint and other dev dependencies

## Supabase Configuration

### 1. Create a New Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: My Wall (or your preferred name)
   - **Database Password**: Strong password (save this!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait for project initialization (2-3 minutes)

### 2. Get API Credentials

1. In your project dashboard, click **"Settings"** (gear icon)
2. Go to **"API"** section
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_KEY`

## Environment Variables

### 1. Create `.env` File

In the project root, create a `.env` file:

```bash
touch .env
```

### 2. Add Credentials

Paste your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key-here
```

⚠️ **Important**:

- Never commit `.env` to version control
- The `.env` file is already in `.gitignore`

## Database Schema

### 1. Create Posts Table

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"New query"**
3. Paste this SQL:

```sql
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  body TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  photo_url TEXT NULL,
  name TEXT,
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_body_check CHECK ((char_length(body) <= 280))
) TABLESPACE pg_default;
```

4. Click **"Run"**

### 2. Enable Realtime

1. Go to **Database** → **Replication**
2. Find the **"posts"** table
3. Toggle the switch to **enable** Realtime
4. Click **"Save"**

## Storage Setup

### 1. Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **"New bucket"**
3. Fill in:
   - **Name**: `post-images`
   - **Public bucket**: ✅ **Enable**
4. Click **"Create bucket"**

### 2. Configure Storage Policies

#### Using SQL Editor (Recommended):

1. Go to **SQL Editor**
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Allow anyone to upload images
CREATE POLICY "Enable upload for all users"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'post-images');

-- Allow anyone to view images
CREATE POLICY "Enable read access for all users"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'post-images');
```

4. Click **"Run"**

#### Using GUI (Alternative):

1. Go to **Storage** → **post-images** → **Policies**
2. Click **"New Policy"**
3. **For Upload (INSERT)**:
   - Policy name: `Enable upload for all users`
   - Policy command: `INSERT`
   - Target roles: `public`
   - WITH CHECK: `bucket_id = 'post-images'`
4. Click **"Review"** → **"Save policy"**
5. Repeat for **SELECT** (read access)

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Troubleshooting

### Common Issues

#### 1. "supabaseUrl is required" Error

**Problem**: Environment variables not loaded

**Solution**:

- Ensure `.env` file exists in project root
- Restart development server: `Ctrl+C` then `npm run dev`
- Verify variable names start with `VITE_`

#### 2. "StorageApiError: row-level security policy" Error

**Problem**: Storage policies not configured

**Solution**:

- Follow [Storage Setup](#storage-setup) instructions
- Verify policies exist in **Storage** → **post-images** → **Policies**
- Run the SQL commands from Step 2

#### 3. Posts Not Appearing

**Problem**: Database empty or connection issue

**Solution**:

- Check browser console (F12) for errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` are correct
- Create a test post to populate database

#### 4. Realtime Not Working

**Problem**: Realtime not enabled on posts table

**Solution**:

- Go to **Database** → **Replication**
- Enable Realtime for **posts** table
- Refresh browser

#### 5. Images Not Uploading

**Problem**: Storage bucket or policies misconfigured

**Solution**:

- Verify bucket name is exactly `post-images`
- Check storage policies are created
- Ensure bucket is set to **public**

### Getting Help

If you encounter issues:

1. Check browser console (F12) for error messages
2. Review [Supabase Docs](https://supabase.com/docs)
3. Check [Vite Docs](https://vitejs.dev/guide/) for build issues
4. Open an issue on GitHub

## Next Steps

- Read [FEATURES.md](./FEATURES.md) to understand all features
- Check [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for development workflow
- Customize the profile section in `src/components/Profile.jsx`
- Add your own styling and branding

---

**Setup Complete!** 🎉 You're ready to start using My Wall!
