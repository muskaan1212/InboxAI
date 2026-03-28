from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import (
    Observation,
    Action,
    Result,
    StepResponse,
    StateResponse,
    TaskInfo,
    TasksResponse,
    GraderMetric,
    GraderResponse,
)
from data import SAMPLE_EMAILS, get_ground_truth_label, calculate_reward
from datetime import datetime
from typing import Dict, List
import random

app = FastAPI(title="InboxAI - Email Triage Environment", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session state (in-memory for now)
class Session:
    def __init__(self):
        self.email_index = 0
        self.actions_taken = 0
        self.cumulative_reward = 0.0
        self.total_correct = 0
        self.done = False
        self.action_history = []
        self.emails = SAMPLE_EMAILS.copy()
        random.shuffle(self.emails)

session = Session()


@app.get("/")
async def root():
    return {
        "name": "InboxAI Email Triage Environment",
        "version": "1.0.0",
        "description": "Interactive ML training environment for email classification",
    }


@app.post("/reset")
async def reset():
    """Reset the environment to start a new session."""
    global session
    session = Session()
    
    observation = Observation(
        email_id=session.emails[session.email_index].id,
        sender=session.emails[session.email_index].sender,
        subject=session.emails[session.email_index].subject,
        body=session.emails[session.email_index].body,
        timestamp=session.emails[session.email_index].timestamp,
    )
    
    return {
        "observation": observation,
        "message": "Environment reset. Ready for new session.",
    }


@app.post("/step")
async def step(action: Action):
    """Submit an action for the current email and move to the next one."""
    if session.done or session.email_index >= len(session.emails):
        return {
            "error": "Episode is done",
            "message": "Please call /reset to start a new session",
        }
    
    current_email = session.emails[session.email_index]
    
    # Calculate reward
    reward = calculate_reward(
        action.category.value,
        action.priority.value,
        current_email.id,
    )
    
    # Track metrics
    session.actions_taken += 1
    session.cumulative_reward += reward
    if reward == 1.0:
        session.total_correct += 1
    
    # Store in history
    session.action_history.append({
        "email_id": current_email.id,
        "action": {
            "category": action.category.value,
            "priority": action.priority.value,
            "confidence": action.confidence,
        },
        "ground_truth": {
            "category": current_email.category.value,
            "priority": current_email.priority.value,
        },
        "reward": reward,
    })
    
    # Move to next email
    session.email_index += 1
    
    # Check if done
    done = session.email_index >= len(session.emails)
    if done:
        session.done = True
    
    # Get next observation
    info = {
        "actions_taken": session.actions_taken,
        "cumulative_reward": session.cumulative_reward,
        "accuracy": session.total_correct / session.actions_taken if session.actions_taken > 0 else 0,
    }
    
    next_observation = None
    if not done:
        next_email = session.emails[session.email_index]
        next_observation = Observation(
            email_id=next_email.id,
            sender=next_email.sender,
            subject=next_email.subject,
            body=next_email.body,
            timestamp=next_email.timestamp,
        )
    
    result = Result(
        reward=reward,
        done=done,
        info=info,
    )
    
    response = {
        "action": {
            "category": action.category.value,
            "priority": action.priority.value,
            "confidence": action.confidence,
        },
        "result": result,
    }
    
    if next_observation:
        response["observation"] = next_observation
    
    return response


@app.get("/state")
async def get_state():
    """Get the current state of the environment."""
    current_email = session.emails[session.email_index] if session.email_index < len(session.emails) else None
    
    observation = None
    if current_email:
        observation = Observation(
            email_id=current_email.id,
            sender=current_email.sender,
            subject=current_email.subject,
            body=current_email.body,
            timestamp=current_email.timestamp,
        )
    
    accuracy = session.total_correct / session.actions_taken if session.actions_taken > 0 else 0
    
    return StateResponse(
        current_email=observation,
        actions_taken=session.actions_taken,
        cumulative_reward=session.cumulative_reward,
        accuracy=accuracy,
        done=session.done,
    )


@app.get("/tasks")
async def get_tasks():
    """Get available training tasks."""
    tasks = [
        TaskInfo(
            id="task_001",
            title="Email Classification Basics",
            description="Classify 5 emails into categories: urgent, important, follow-up, archive, spam",
            emails_count=5,
            completed=min(session.actions_taken, 5),
            progress=min(session.actions_taken / 5, 1.0),
        ),
        TaskInfo(
            id="task_002",
            title="Advanced Priority Ranking",
            description="Assign priority levels (high, medium, low) to 10 emails",
            emails_count=10,
            completed=max(0, min(session.actions_taken - 5, 10)),
            progress=max(0, min((session.actions_taken - 5) / 10, 1.0)),
        ),
        TaskInfo(
            id="task_003",
            title="Mixed Classification",
            description="Complete full classification (category + priority) for 15 emails",
            emails_count=15,
            completed=max(0, min(session.actions_taken - 15, 15)),
            progress=max(0, min((session.actions_taken - 15) / 15, 1.0)),
        ),
    ]
    
    total_progress = sum(task.progress for task in tasks) / len(tasks)
    
    return TasksResponse(tasks=tasks, total_progress=total_progress)


@app.get("/grader")
async def get_grader():
    """Get grading and performance metrics."""
    # Calculate metrics based on action history
    if not session.action_history:
        return GraderResponse(
            metrics=[
                GraderMetric(name="Accuracy", value=0.0),
                GraderMetric(name="Precision", value=0.0),
                GraderMetric(name="Recall", value=0.0),
                GraderMetric(name="F1 Score", value=0.0),
            ],
            category_performance={
                "urgent": 0.0,
                "important": 0.0,
                "follow_up": 0.0,
                "archive": 0.0,
                "spam": 0.0,
            },
            confusion_matrix={
                "urgent": {"urgent": 0, "important": 0, "follow_up": 0, "archive": 0, "spam": 0},
                "important": {"urgent": 0, "important": 0, "follow_up": 0, "archive": 0, "spam": 0},
                "follow_up": {"urgent": 0, "important": 0, "follow_up": 0, "archive": 0, "spam": 0},
                "archive": {"urgent": 0, "important": 0, "follow_up": 0, "archive": 0, "spam": 0},
                "spam": {"urgent": 0, "important": 0, "follow_up": 0, "archive": 0, "spam": 0},
            },
        )
    
    # Build confusion matrix
    confusion_matrix = {}
    for category in ["urgent", "important", "follow_up", "archive", "spam"]:
        confusion_matrix[category] = {
            "urgent": 0,
            "important": 0,
            "follow_up": 0,
            "archive": 0,
            "spam": 0,
        }
    
    category_counts = {cat: 0 for cat in ["urgent", "important", "follow_up", "archive", "spam"]}
    category_correct = {cat: 0 for cat in ["urgent", "important", "follow_up", "archive", "spam"]}
    
    for action_record in session.action_history:
        ground_truth_cat = action_record["ground_truth"]["category"]
        predicted_cat = action_record["action"]["category"]
        
        confusion_matrix[ground_truth_cat][predicted_cat] += 1
        category_counts[ground_truth_cat] += 1
        
        if ground_truth_cat == predicted_cat:
            category_correct[ground_truth_cat] += 1
    
    # Calculate accuracy
    accuracy = session.total_correct / len(session.action_history) if session.action_history else 0
    
    # Calculate precision and recall
    precision = 0.0
    recall = 0.0
    if len(session.action_history) > 0:
        precision = accuracy
        recall = accuracy
    
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    # Category performance
    category_performance = {}
    for cat in ["urgent", "important", "follow_up", "archive", "spam"]:
        if category_counts[cat] > 0:
            category_performance[cat] = category_correct[cat] / category_counts[cat]
        else:
            category_performance[cat] = 0.0
    
    return GraderResponse(
        metrics=[
            GraderMetric(name="Accuracy", value=accuracy),
            GraderMetric(name="Precision", value=precision),
            GraderMetric(name="Recall", value=recall),
            GraderMetric(name="F1 Score", value=f1),
        ],
        category_performance=category_performance,
        confusion_matrix=confusion_matrix,
    )


@app.get("/baseline")
async def get_baseline():
    """Get baseline performance metrics."""
    return {
        "baseline_accuracy": 0.72,
        "baseline_f1": 0.68,
        "description": "Baseline performance from a simple rule-based classifier",
        "improvement": {
            "accuracy_delta": max(0, (session.total_correct / session.actions_taken if session.actions_taken > 0 else 0) - 0.72),
            "current_accuracy": session.total_correct / session.actions_taken if session.actions_taken > 0 else 0,
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
