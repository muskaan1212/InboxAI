# InboxAI
InboxAI is an **OpenEnv-compatible AI training environment** that simulates real-world **email triage**. Agents learn to:
- Classify emails (spam / important / urgent)
- Assign priorities
- Generate responses or escalate tasks

Designed for the **OpenEnv Hackathon**, it’s fully interactive, graded, and deployable on **Hugging Face Spaces**.

---

## 🎯 Features
- Realistic email scenarios with partial reward scoring  
- Multi-step agent decision making  
- Deterministic graders for reproducible results  
- Baseline agent included for benchmarking  
- API endpoints fully documented

---

## 📦 Folder Structure
inboxai/
├── public/              # Static assets (logos, images)
├── src/# 📬 InboxIQ - OpenEnv Hackathon Project

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**InboxIQ** is an interactive, developer-focused dashboard for training and evaluating email classification models. Built for the OpenEnv Hackathon, this project provides a premium MLOps style environment where users can manually classify emails (urgent, important, follow-up, etc.) while tracking multi-dimensional AI model performance in real-time.

---

## ✨ Key Features

- **Interactive Training Dashboard**: Manually classify incoming emails and receive immediate evaluation and rewards from the backend simulator.
- **Live State Visualization**: Real-time rendering of the environment's state, classification accuracy, and cumulative rewards.
- **Comprehensive Grader & Metrics**: Deep dive into model performance with specific metrics for Accuracy, Precision, Recall, F1 Score, and category-level confusion matrices.
- **Task Management**: Monitor training progression over multiple curated baseline tasks.
- **Premium Developer UI**: Built with Next.js and shadcn/ui, featuring a dark-mode first design, sleek micro-animations, and highly responsive layouts.
- **Seamless Python Backend Integration**: Fueled by a fast, robust FastAPI backend.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Next.js App Router)
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS & shadcn/ui
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Charting**: Recharts
- **Icons**: Lucide React

### Backend (Python FastAPI)
- **Framework**: FastAPI
- **Data Validation**: Pydantic
- **Server**: Uvicorn
- **Environment Management**: `venv` / `pip`

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) 3.9+
- [Git](https://git-scm.com/)

### 1. Frontend Setup
Open your first terminal and run:
```bash
# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```
The frontend will be live at: **http://localhost:3000**

### 2. Backend Setup
Open a second terminal window. You'll need macOS Command Line Developer Tools or a proper Python installation footprint.
```bash
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
The backend will be live at: **http://localhost:8000**

*(Note: If you run into Python missing errors on macOS, try running `xcode-select --install` to install the backend compilation tools first).*

---

## 📂 Project Structure

```text
.
├── app/                      # Next.js App Router Frontend
│   ├── api-docs/             # API Documentation UI
│   ├── dashboard/            # Core Triage & Classification UI
│   ├── grader/               # Real-time Model Grader & Metrics
│   ├── tasks/                # Multi-task progression tracking
│   ├── layout.tsx            # Global Layout & Dark mode providers
│   └── page.tsx              # Landing Page
├── backend/                  # FastAPI Python Backend
│   ├── data.py               # Dataset generation and evaluation logic
│   ├── main.py               # API Endpoints (reset, step, state, grader)
│   ├── models.py             # Pydantic schema logic
│   └── requirements.txt      # Python dependencies
├── components/               # Reusable UI/shadcn components
├── hooks/                    # Custom React hooks (e.g., use-api.ts)
├── lib/                      # Utility functions
└── README.md                 # Project Documentation
```

---

## 📡 API Overview

The frontend seamlessly connects with the FastAPI backend through the hook `use-api.ts`.
To delve into interactive Swagger UI API documentation provided by FastAPI, navigate to **http://localhost:8000/docs** while your backend is running.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reset` | `POST` | Resets the interaction environment for a new session. |
| `/step`  | `POST` | Submits a classification action for the current email. |
| `/state` | `GET`  | Fetches the current environment state (current email, rewards). |
| `/tasks` | `GET`  | Returns the array of available model tasks and completion progress. |
| `/grader`| `GET`  | Returns detailed model evaluation metrics (F1, Precision, Recall).|
| `/baseline` | `GET`  | Gets baseline benchmark metrics for comparison. |

---

## 🎨 Design System

InboxIQ is heavily focused on presenting a premium user experience:
- **Palette**: Dark Slate background with vivid Purple-Blue accents.
- **Components**: Rounded, glassy cards with soft borders, interactive hover states, and dynamic routing transitions.
- **Typography**: Crisp, scalable sans-serif geometry prioritizing data readability (Inter-like aesthetics). 

---

## 📜 License
This project is open-source and available under the MIT License. Feel free to use and extend this project!

│   ├── app/             # Main app router components
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Dashboard / main page
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom hooks (e.g., email fetching, AI triage)
│   ├── styles/          # Global & Tailwind CSS
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies & scripts
├── postcss.config.js    # PostCSS setup
└── tailwind.config.js   # Tailwind configuration
## 🛠 Tech Stack
- **Next.js 15** - Latest version with improved performance and features
- **React 19** - Latest React version with enhanced capabilities
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

