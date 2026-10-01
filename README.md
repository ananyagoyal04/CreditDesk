# CreditDesk — Research Methodology Prototype

**CreditDesk** is a research prototype developed for the academic study:  
*“Human Trust in Explainable vs Black-Box AI Systems”*.

Participants review a simulated education loan decision (Rohan Sharma, MS Data Science in Canada) and rate their perceived trust, transparency, reliance, confidence, and fairness. Participants are randomly allocated into a 50/50 split between:
- **Condition A (Standard / Black-box)**: Standard adverse decision display without explanatory attribution.
- **Condition B (Explainable / LIN-SHAP)**: Identical adverse decision paired with a *"Why this decision?"* feature attribution breakdown, confidence metric, and determinant factors.

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM v6
- **Styling**: Vanilla CSS with design tokens matching the Stitch Utilitarian specification
- **Typography**: Inter (UI / Sans) & JetBrains Mono (Data / Monospace)
- **Icons**: Google Material Symbols Outlined
- **Zero Heavy UI Dependencies**: Built entirely with accessible native primitives and clean CSS

---

## 📂 Project Structure

```
CreditDesk/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.tsx           # Fixed top bar with research badge
│   │   ├── Footer.tsx           # Academic disclaimer footer
│   │   └── Layout.tsx           # Shell layout wrapper
│   ├── data/
│   │   └── loanData.ts          # Underwriting parameters and decision figures
│   ├── lib/
│   │   ├── stats.ts             # Welch's t-test, Incomplete Beta p-value engine
│   │   └── storage.ts           # Dual storage: localStorage + Google Sheets webhook
│   ├── pages/
│   │   ├── ApplicationPage.tsx  # Route / : Application review screen (LN-20481)
│   │   ├── DecisionPage.tsx     # Route /decision : Condition A vs Condition B view
│   │   ├── FeedbackPage.tsx     # Route /feedback : 5-item Likert survey
│   │   ├── ThanksPage.tsx       # Route /thanks : Study conclusion & lock screen
│   │   └── ResultsPage.tsx      # Route /results : Passcode-protected analytics dashboard
│   ├── styles/
│   │   └── index.css            # Utilitarian design system CSS tokens & utilities
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces for session, data & stats
│   ├── App.tsx                  # Client-side router configuration
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts            # Vite environment typings
├── .env.example                 # Sample environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Running Locally

### 1. Prerequisites
- **Node.js** (v18 or newer recommended)
- **npm** (or `pnpm` / `yarn`)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Copy the example environment file:
```bash
cp .env.example .env
```

Available environment variables:
- `VITE_RESULTS_PASSCODE`: Passcode to access `/results` (Default: `creditdesk2026`).
- `VITE_SHEETS_URL`: (Optional) Google Apps Script Web App URL for remote data collection. Leave empty for offline `localStorage` mode.

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 Testing & URL Overrides

For research validation and QA testing, you can bypass the random 50/50 assignment by appending a hidden query parameter to the URL:

- **Condition A (Standard View)**:  
  `http://localhost:5173/?condition=A` or `http://localhost:5173/decision?condition=A`
- **Condition B (Explainable View)**:  
  `http://localhost:5173/?condition=B` or `http://localhost:5173/decision?condition=B`

*Note*: In participant production runs, no query parameters are needed; the system automatically allocates participants randomly and stores their assignment in `localStorage`.

---

## 📊 Administrator Results Dashboard (`/results`)

Access the password-protected analytics suite at:
`http://localhost:5173/results`

- **Default Passcode**: `creditdesk2026`
- **Features**:
  - Participant count breakdown ($N_{total}$, $N_A$, $N_B$) and mean decision view durations
  - **Welch's Two-Sample t-Test**: Computes $t$-statistic, degrees of freedom ($df$ via Welch-Satterthwaite), and two-tailed $p$-value with plain-language academic interpretation
  - Visual Bar Chart comparing Mean Total Trust scores ($5-25$ scale)
  - Itemized 5-point Likert statistics table ($\text{Mean} \pm \text{SD}$)
  - Full raw submission records log
  - **Download CSV**: One-click export of all survey responses

---

## ☁️ Google Sheets Remote Data Collection Setup

To aggregate participant submissions across multiple devices in real time, configure a Google Apps Script Web App:

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new spreadsheet named `CreditDesk Research Submissions`.

### Step 2: Open Apps Script Editor
1. In the menu bar, navigate to **Extensions** → **Apps Script**.
2. Replace all content in `Code.gs` with the following script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Participant ID",
        "Condition",
        "Q1 (Trust)",
        "Q2 (Understanding)",
        "Q3 (Reliance)",
        "Q4 (Confidence)",
        "Q5 (Fairness)",
        "Total Score",
        "Time on Decision (s)",
        "Timestamp (ISO)"
      ]);
      // Format headers
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#eff4ff");
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.participantId,
      data.condition,
      data.answers.q1,
      data.answers.q2,
      data.answers.q3,
      data.answers.q4,
      data.answers.q5,
      data.totalScore,
      data.timeSpentSeconds,
      data.timestamp
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy as Web App
1. Click **Deploy** → **New deployment**.
2. Select type: **Web app**.
3. Set **Execute as**: `Me (your email)`.
4. Set **Who has access**: `Anyone`. *(Crucial for anonymous submissions)*.
5. Click **Deploy** and authorize permissions.
6. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 4: Configure in CreditDesk
Add the URL to your `.env` file (or host provider environment settings):
```env
VITE_SHEETS_URL=https://script.google.com/macros/s/AKfycb.../exec
```

---

## 🌐 Deployment Instructions

### Deploying to Vercel

1. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial CreditDesk research prototype"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Import your repository.
   - Framework Preset: **Vite**.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.

3. **Configure Single-Page Application (SPA) Rewrites**:
   Add a `vercel.json` file in the root directory (included below):
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

4. **Add Environment Variables**:
   In Vercel Project Settings → Environment Variables:
   - `VITE_RESULTS_PASSCODE`: `your_secure_passcode`
   - `VITE_SHEETS_URL`: `https://script.google.com/macros/s/.../exec` (if using Google Sheets)

---

### Deploying to Netlify

1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com/).
   - Click **Add new site** → **Import an existing project**.
   - Select your GitHub repository.

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Configure SPA Redirects**:
   Add a `_redirects` file inside the `public/` directory with:
   ```
   /*    /index.html   200
   ```
   *(Or create `netlify.toml` in project root)*.

4. **Environment Variables**:
   In Netlify Site Settings → Environment variables:
   - `VITE_RESULTS_PASSCODE`: `your_secure_passcode`
   - `VITE_SHEETS_URL`: `https://script.google.com/macros/s/.../exec`

---

## 📜 Academic Attribution & License
Simulated system designed exclusively for academic research in Human-Computer Interaction (HCI) and Explainable AI (XAI). No real financial data or consumer records are processed.
