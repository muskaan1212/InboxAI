from models import Email, CategoryEnum, PriorityEnum
from datetime import datetime, timedelta
import random

# Sample emails with ground truth labels
SAMPLE_EMAILS = [
    Email(
        id="email_001",
        sender="boss@company.com",
        subject="Q4 Budget Review - Urgent Response Needed",
        body="I need your input on the Q4 budget allocation by EOD. Please review the attached spreadsheet and send me your thoughts. This is critical for our planning.",
        timestamp=datetime.now().isoformat(),
        category=CategoryEnum.URGENT,
        priority=PriorityEnum.HIGH,
        confidence=0.95,
    ),
    Email(
        id="email_002",
        sender="client@external.com",
        subject="RE: Project Proposal Discussion",
        body="Thanks for sending over the proposal. I've reviewed it and have a few questions. When would be a good time to discuss next week?",
        timestamp=(datetime.now() - timedelta(hours=2)).isoformat(),
        category=CategoryEnum.IMPORTANT,
        priority=PriorityEnum.HIGH,
        confidence=0.88,
    ),
    Email(
        id="email_003",
        sender="team@company.com",
        subject="Weekly Team Standup - Friday 3PM",
        body="Just confirming our weekly standup is still on for Friday at 3 PM in the conference room. See you then!",
        timestamp=(datetime.now() - timedelta(hours=4)).isoformat(),
        category=CategoryEnum.FOLLOW_UP,
        priority=PriorityEnum.MEDIUM,
        confidence=0.82,
    ),
    Email(
        id="email_004",
        sender="noreply@newsletter.com",
        subject="Your Weekly Tech Newsletter - March 27",
        body="This week's top stories: AI breakthroughs, cloud infrastructure updates, and more. Read the full newsletter on our website.",
        timestamp=(datetime.now() - timedelta(hours=6)).isoformat(),
        category=CategoryEnum.ARCHIVE,
        priority=PriorityEnum.LOW,
        confidence=0.91,
    ),
    Email(
        id="email_005",
        sender="unknown@spammer.net",
        subject="CLICK HERE - LIMITED TIME OFFER!!!",
        body="You've been selected for an exclusive offer! Click here immediately to claim your prize. Act now before it expires!",
        timestamp=(datetime.now() - timedelta(hours=8)).isoformat(),
        category=CategoryEnum.SPAM,
        priority=PriorityEnum.LOW,
        confidence=0.94,
    ),
    Email(
        id="email_006",
        sender="hr@company.com",
        subject="Benefits Enrollment Deadline - March 31",
        body="Reminder: The enrollment deadline for our new health insurance plans is March 31. Please complete your selection in the benefits portal.",
        timestamp=(datetime.now() - timedelta(hours=10)).isoformat(),
        category=CategoryEnum.IMPORTANT,
        priority=PriorityEnum.HIGH,
        confidence=0.85,
    ),
    Email(
        id="email_007",
        sender="support@service.com",
        subject="Your Support Ticket #12345 - Status Update",
        body="Your support ticket has been assigned to our technical team. We will follow up with you within 24 hours.",
        timestamp=(datetime.now() - timedelta(hours=12)).isoformat(),
        category=CategoryEnum.FOLLOW_UP,
        priority=PriorityEnum.MEDIUM,
        confidence=0.79,
    ),
    Email(
        id="email_008",
        sender="cto@company.com",
        subject="URGENT: Security Incident - Action Required",
        body="We've detected suspicious activity on the network. All employees must reset their passwords immediately and enable 2FA. Do not delay.",
        timestamp=(datetime.now() - timedelta(hours=14)).isoformat(),
        category=CategoryEnum.URGENT,
        priority=PriorityEnum.HIGH,
        confidence=0.98,
    ),
    Email(
        id="email_009",
        sender="sales@vendor.com",
        subject="Special Offer: Enterprise Software License - 40% Off",
        body="Limited time offer for our enterprise solution. Get 40% off if you purchase before April 15. Contact your sales rep for details.",
        timestamp=(datetime.now() - timedelta(hours=16)).isoformat(),
        category=CategoryEnum.ARCHIVE,
        priority=PriorityEnum.LOW,
        confidence=0.87,
    ),
    Email(
        id="email_010",
        sender="mentor@company.com",
        subject="Coffee Chat - Next Week?",
        body="Hey! Would you be interested in grabbing coffee next week? I'd like to catch up and hear about your current projects.",
        timestamp=(datetime.now() - timedelta(hours=18)).isoformat(),
        category=CategoryEnum.FOLLOW_UP,
        priority=PriorityEnum.MEDIUM,
        confidence=0.73,
    ),
]


def get_ground_truth_label(email_id: str):
    """Get the ground truth category and priority for an email."""
    for email in SAMPLE_EMAILS:
        if email.id == email_id:
            return {"category": email.category, "priority": email.priority}
    return None


def calculate_reward(predicted_category: str, predicted_priority: str, email_id: str) -> float:
    """Calculate reward for an action based on correctness."""
    ground_truth = get_ground_truth_label(email_id)
    if not ground_truth:
        return 0.0
    
    category_match = predicted_category == ground_truth["category"]
    priority_match = predicted_priority == ground_truth["priority"]
    
    if category_match and priority_match:
        return 1.0
    elif category_match or priority_match:
        return 0.5
    else:
        return 0.0
