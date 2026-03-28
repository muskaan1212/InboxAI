# InboxAI Backend Setup

This guide explains how to set up and run the Python/FastAPI backend for the InboxAI email triage training environment.

## Prerequisites

- Python 3.9+
- pip or uv (package manager)

## Installation

### Option 1: Using uv (recommended)

```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
```

### Option 2: Using pip

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Backend

From the `backend` directory:

```bash
uvicorn main:app --reload --port 8000
```

The backend will start on `http://localhost:8000`

You can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### POST /reset
Reset the environment to start a new session.

**Response:**
```json
{
  "observation": {
    "email_id": "email_001",
    "sender": "boss@company.com",
    "subject": "Q4 Budget Review - Urgent Response Needed",
    "body": "...",
    "timestamp": "2024-03-27T10:00:00"
  },
  "message": "Environment reset. Ready for new session."
}
```

### POST /step
Submit a classification action for the current email.

**Request:**
```json
{
  "category": "urgent",
  "priority": "high",
  "confidence": 0.95
}
```

**Response:**
```json
{
  "action": {
    "category": "urgent",
    "priority": "high",
    "confidence": 0.95
  },
  "observation": {
    "email_id": "email_002",
    "sender": "client@external.com",
    "subject": "RE: Project Proposal Discussion",
    "body": "...",
    "timestamp": "2024-03-27T09:00:00"
  },
  "result": {
    "reward": 1.0,
    "done": false,
    "info": {
      "actions_taken": 1,
      "cumulative_reward": 1.0,
      "accuracy": 1.0
    }
  }
}
```

### GET /state
Get the current state of the environment.

**Response:**
```json
{
  "current_email": {
    "email_id": "email_002",
    "sender": "client@external.com",
    "subject": "RE: Project Proposal Discussion",
    "body": "...",
    "timestamp": "2024-03-27T09:00:00"
  },
  "actions_taken": 1,
  "cumulative_reward": 1.0,
  "accuracy": 1.0,
  "done": false
}
```

### GET /tasks
Get available training tasks with progress.

**Response:**
```json
{
  "tasks": [
    {
      "id": "task_001",
      "title": "Email Classification Basics",
      "description": "Classify 5 emails into categories...",
      "emails_count": 5,
      "completed": 2,
      "progress": 0.4
    }
  ],
  "total_progress": 0.33
}
```

### GET /grader
Get model performance metrics.

**Response:**
```json
{
  "metrics": [
    {"name": "Accuracy", "value": 0.87},
    {"name": "Precision", "value": 0.86},
    {"name": "Recall", "value": 0.88},
    {"name": "F1 Score", "value": 0.87}
  ],
  "category_performance": {
    "urgent": 0.98,
    "important": 0.91,
    "follow_up": 0.87,
    "archive": 0.76,
    "spam": 0.99
  },
  "confusion_matrix": {
    "urgent": {"urgent": 10, "important": 0, ...},
    ...
  }
}
```

### GET /baseline
Get baseline performance metrics for comparison.

**Response:**
```json
{
  "baseline_accuracy": 0.72,
  "baseline_f1": 0.68,
  "description": "Baseline performance from a simple rule-based classifier",
  "improvement": {
    "accuracy_delta": 0.15,
    "current_accuracy": 0.87
  }
}
```

## Frontend Integration

The frontend automatically connects to the backend at `http://localhost:8000`.

To change the API URL, set the `NEXT_PUBLIC_API_URL` environment variable:

```bash
export NEXT_PUBLIC_API_URL=http://your-backend-url:8000
```

## Architecture

- **Models** (`models.py`): Pydantic data models for requests/responses
- **Data** (`data.py`): Sample emails and reward calculation logic
- **Main** (`main.py`): FastAPI application with all endpoints

## Sample Emails

The environment includes 10 sample emails with different categories:
- Urgent (2)
- Important (2)
- Follow-up (3)
- Archive (2)
- Spam (1)

Each email has a ground truth label for reward calculation.

## Reward System

- **Perfect classification** (both category and priority correct): 1.0 reward
- **Partial classification** (only one correct): 0.5 reward
- **Incorrect**: 0.0 reward

Accuracy is calculated as: correct_classifications / total_classifications
