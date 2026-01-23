---
layout: post
title: "Processes vs. Entities: How We Model Healthcare Workflows"
date: 2026-01-23
tags: [design-patterns, healthcare, python]
excerpt: "Sometimes the thing you're tracking isn't a thing at all—it's a series of state transitions that happen to share context."
---

There's a common modeling mistake that surfaces when teams build systems for complex domains: treating processes as if they were entities.

The instinct is reasonable. Object-oriented design taught us to find the nouns and give them classes. A `Claim` gets submitted, processed, approved. A `PriorAuthorization` gets requested, reviewed, decided. These feel like things you could model with identity, state, and behavior.

But in healthcare workflows, the "thing" often doesn't have stable identity. What looks like a noun is actually a process wearing the costume of an entity.

## The Entity Trap

Consider a healthcare claim. The OOP instinct produces something like:

```python
class Claim:
    def __init__(self, claim_id, patient, provider, services):
        self.claim_id = claim_id
        self.patient = patient
        self.provider = provider
        self.services = services
        self.status = "submitted"
        self.adjudication_result = None

    def adjudicate(self, rules_engine):
        self.adjudication_result = rules_engine.apply(self)
        self.status = "adjudicated"

    def pay(self, amount):
        self.payment = Payment(amount)
        self.status = "paid"
```

This feels clean until you encounter real healthcare workflows.

Claims get resubmitted. The "same" claim might have different versions with different service lines. A claim denial triggers an appeal, which is a new process that references the old one. The original claim's identity becomes philosophical.

The entity model fights the domain. You end up with `Claim`, `ClaimVersion`, `ClaimRevision`, `AdjudicatedClaim`, `AppealedClaim`—a taxonomy of nouns trying to capture what's actually a flow.

## Process-First Modeling

The alternative: model the *process*, not the object.

```python
@dataclass
class ClaimSubmission:
    """Event: a claim was submitted for processing."""
    submitted_at: datetime
    patient_id: str
    provider_id: str
    services: list[ServiceLine]
    reference_id: str  # for tracking, not identity

@dataclass
class AdjudicationResult:
    """Event: adjudication completed."""
    submission_ref: str
    decision: Literal["approved", "denied", "partial"]
    line_decisions: dict[str, LineDecision]
    processed_at: datetime

@dataclass
class PaymentIssued:
    """Event: payment was issued."""
    adjudication_ref: str
    amount: Decimal
    issued_at: datetime
```

No `Claim` class at all. Instead: a sequence of events that form a workflow. The "claim" is the relationship between these events—a process that happened, not an object that exists.

## When This Distinction Matters

The entity model works when:
- Identity is stable and meaningful (patients, providers, contracts)
- State changes are minor updates to a persistent thing
- Versioning is truly versioning (the "same" thing evolving)

The process model works when:
- "State changes" are actually phase transitions between different activities
- Multiple outcomes can branch from the same starting point
- The domain talks in verbs: submitted, adjudicated, appealed, reprocessed

Healthcare workflows tend toward the second category. A prior authorization isn't really an object—it's a request-review-decision process that might result in approval, denial, or a request for more information (which starts a new subprocess).

## The Practical Tradeoff

```
Entity model:
  ✓ Simpler mental model ("it's a Claim")
  ✓ Standard ORM patterns work well
  ✗ Status fields multiply: is_appealed, is_reprocessed, version_number
  ✗ Business logic fragments across lifecycle methods

Process model:
  ✓ Matches how the domain actually works
  ✓ Events are immutable—easier to audit, replay, debug
  ✗ Requires event sourcing or explicit state reconstruction
  ✗ Querying "current state" means replaying events or maintaining projections
```

The entity model is the path of least resistance for most CRUD applications. But healthcare workflows aren't CRUD—they're processes that accumulate, branch, and reference each other.

## A Middle Path

In practice, hybrid approaches work. Keep entities for genuinely stable things (the patient, the contract, the provider). Model workflows as sequences of events that reference those entities.

```python
# Stable entity
class Contract:
    id: str
    terms: ContractTerms
    effective_dates: DateRange

# Process events reference the entity
@dataclass
class ClaimSubmission:
    contract_id: str  # reference to stable entity
    submitted_at: datetime
    # ... workflow-specific fields
```

The contract has identity. The claim workflow doesn't—it's what happened under that contract.

## The Broader Pattern

This tension—entity vs. process—shows up anywhere workflows get complex. Task tracking systems model tickets as objects, but the interesting thing is usually the flow between states. Approval workflows model "requests" as objects, but they're really just the context for a decision process.

The question isn't "is this an entity?" but "does this thing have meaningful identity independent of the process it participates in?"

In healthcare, the answer is often no. The claim number is a tracking reference, not an identity. The prior auth case ID is a conversation thread, not an object.

Modeling processes as processes—rather than forcing them into entity costumes—tends to produce systems that match how the domain actually thinks about the work.

---

*This post was written with AI assistance.*
