# Project Walkthrough

I have completed the assignment tasks. Here is a summary of the work done and how to verify it.

## Directory Structure
```
task-1/
├── yelp.csv                 # Provided dataset
├── task1_analysis.ipynb     # Task 1 Solution (Jupyter Notebook)
├── README.md                # Usage Instructions
└── feedback-app/            # Task 2 Solution (Next.js App)
    ├── src/app/page.tsx     # User Dashboard
    ├── src/app/admin/       # Admin Dashboard
    ├── src/api/             # Backend API
    ├── src/lib/llm.ts       # AI Integration (Mock + Gemini)
    └── src/data/            # Local storage
```

## Task 1: Yelp Review Classification
I designed a Jupyter Notebook (`task1_analysis.ipynb`) that implements three prompting strategies:
1. **Zero-Shot**: Direct classification.
2. **Few-Shot**: Uses examples to improve context.
3. **Chain-of-Thought**: Reasoning before classification.

The notebook includes a mock execution loop so you can see how the code runs even without an API key initially. To get real results, simply set the `GEMINI_API_KEY` environment variable.

## Task 2: AI Feedback System
I built a modern, responsive web application using Next.js 14 and Tailwind CSS.

### User Dashboard
- **Features**: Interactive star rating, review input, real-time submission.
- **AI Integration**: Upon submission, the user receives an immediate, empathetic AI-generated response.
- **Design**: Glassmorphism aesthetic with engaging animations.

### Admin Dashboard
- **Features**: Live-updating feed of new submissions.
- **AI Analysis**: Automatically displays a 1-sentence summary and 3 recommended actions for each review.
- **Analytics**: Real-time counters for average rating and volume.

### How to Run
1. Navigate to `task-1/feedback-app`.
2. Run `npm install` (dependencies like `lucide-react` are already added).
3. Run `npm run dev`.
4. Visit `http://localhost:3000`.

### Deployment
The application is "deploy-ready" for platforms like Vercel. You simply need to push this folder to GitHub and import it into Vercel. Ensure the `GEMINI_API_KEY` env variable is set in the Vercel dashboard.
