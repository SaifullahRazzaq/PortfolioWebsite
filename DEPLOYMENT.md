# 🚀 Vercel Deployment Guide

Deploying your interactive 3D portfolio to Vercel is straightforward. Follow these steps to get your site live.

## Option 1: Deploy via GitHub (Recommended)

1.  **Push your changes to GitHub**:
    ```bash
    git add .
    git commit -m "Added Agentic AI projects and final refinements"
    git push origin main
    ```

2.  **Connect to Vercel**:
    - Go to [vercel.com](https://vercel.com) and log in.
    - Click **"Add New"** > **"Project"**.
    - Import your repository: `PortfolioWebsite`.

3.  **Configure Build Settings**:
    - **Framework Preset**: Vite (automatically detected).
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`

4.  **Deploy**:
    - Click **"Deploy"**. Vercel will build your project and provide a live URL!

---

## Option 2: Deploy via Vercel CLI

1.  **Install Vercel CLI**:
    ```bash
    npm install -g vercel
    ```

2.  **Deploy**:
    ```bash
    vercel
    ```
    - Follow the prompts (Select Yes for default settings).

3.  **Production Deploy**:
    ```bash
    vercel --prod
    ```

---

## 🛠 Troubleshooting (Common Vite/Vercel issues)

### 1. Large 3D Assets (Chunk Warning)
If you get a warning about "chunks larger than 500kB", don't worry. This is common with Three.js. For production, you can ignore it or add the following to `vite.config.js`:
```javascript
build: {
  chunkSizeWarningLimit: 1600,
}
```

### 2. Assets not loading
Ensure all images and models are in the `public/` folder. They should be referenced with absolute paths (e.g., `/assets/image.png`), NOT relative paths within the `src/` folder.

### 3. Environment Variables
If you add specialized API keys for AI agents later, make sure to add them in the **Vercel Project Settings > Environment Variables** section.

---

**Live Support**: If you face any issues, feel free to ask!
