from pydantic import BaseModel
from typing import Optional, Dict, Any
from enum import Enum


class CategoryEnum(str, Enum):
    URGENT = "urgent"
    IMPORTANT = "important"
    FOLLOW_UP = "follow_up"
    ARCHIVE = "archive"
    SPAM = "spam"


class PriorityEnum(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Email(BaseModel):
    id: str
    sender: str
    subject: str
    body: str
    timestamp: str
    category: CategoryEnum
    priority: PriorityEnum
    confidence: float


class Observation(BaseModel):
    email_id: str
    sender: str
    subject: str
    body: str
    timestamp: str


class Action(BaseModel):
    category: CategoryEnum
    priority: PriorityEnum
    confidence: float


class Result(BaseModel):
    reward: float
    done: bool
    info: Dict[str, Any]


class StepResponse(BaseModel):
    observation: Observation
    action: Optional[Action]
    result: Result


class StateResponse(BaseModel):
    current_email: Observation
    actions_taken: int
    cumulative_reward: float
    accuracy: float
    done: bool


class TaskInfo(BaseModel):
    id: str
    title: str
    description: str
    emails_count: int
    completed: int
    progress: float


class TasksResponse(BaseModel):
    tasks: list[TaskInfo]
    total_progress: float


class GraderMetric(BaseModel):
    name: str
    value: float


class GraderResponse(BaseModel):
    metrics: list[GraderMetric]
    category_performance: Dict[str, float]
    confusion_matrix: Dict[str, Dict[str, int]]
