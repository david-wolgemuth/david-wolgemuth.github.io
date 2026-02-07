---
layout: post
title: "Why Healthcare Contracts Are Hard to Reason About"
date: 2026-01-18
tags: [healthcare, systems-thinking, architecture]
excerpt: "Healthcare contracts aren't just legal documents with rates attached. They're layered rule systems where context cascades, exceptions nest, and the 'correct' answer depends on which document you read last."
---

Most software deals with data that sits still. A product has a price. A user has a role. You look it up, you get an answer.

Healthcare contracts don't work like that. A contract between a payer and a provider isn't a lookup table—it's a rule system. And the rules reference other rules, which reference other documents, which may or may not override each other depending on context that isn't always explicit.

This makes them genuinely difficult to model in software, and the difficulty isn't accidental. It reflects real complexity in the domain.

## What a Contract Actually Contains

A healthcare payer contract isn't one thing. It's a collection of documents that together define how a provider gets paid for services. Typically this includes:

- A **base agreement** with general terms
- One or more **fee schedules** specifying rates for services
- **Amendments** that modify specific terms over time
- **Letters of agreement** for carve-outs or special arrangements
- **Regulatory references** to external rate tables (Medicare fee schedules, state Medicaid rates)

Each layer can override, extend, or qualify what came before it. An amendment might say "for services in Appendix B, apply 120% of the 2024 Medicare Physician Fee Schedule instead of the rates in Exhibit A." Understanding the reimbursement for a single procedure might require reading four documents and one external reference.

## Three Kinds of Data

Working with contract data surfaces a distinction that doesn't have a clean name in most software patterns: the difference between **specified**, **inherited**, and **detected** values.

**Specified** values are explicitly stated. "Knee replacement: $35,000." Clear, unambiguous, written down.

**Inherited** values come from context. "All outpatient services: 150% of Medicare." The rate for any specific outpatient procedure isn't written anywhere in the contract—it's derived from the combination of the contract term and an external fee schedule. Change the Medicare rate, and the contract rate changes, even though the contract text hasn't moved.

**Detected** values are inferred from patterns in the document. A clause might say "charges exceeding $10,000 require prior authorization." The system needs to recognize that this sentence contains a rate threshold, even though it's not structured as a rate table entry.

Most software assumes data is specified. Healthcare contracts force you to handle all three—and to know which kind you're looking at, because the update semantics are completely different. A specified rate is wrong if the number is wrong. An inherited rate is wrong if the reference is stale. A detected rate is wrong if the extraction logic misread the sentence.

## The Cascading Problem

The layering creates what amounts to a cascading rule system. Think CSS specificity, but for money.

```
Base agreement:     "All services at 80% of billed charges"
Fee schedule:       "Surgery: $X per procedure (see table)"
Amendment (2024):   "Cardiac surgery: 130% of Medicare"
Letter of agreement: "Dr. Smith's cardiac cases: flat $45,000"
```

Which rate applies? It depends on the service, the provider, the date, and which documents are in effect. The most specific applicable rule wins—but "most specific" isn't always obvious. Does a provider-specific letter override a service-specific amendment? The contract itself may not say.

This is the core modeling challenge. It's not that the data is messy (though it often is). It's that the *resolution logic*—which value wins when multiple rules could apply—is itself ambiguous and context-dependent.

## Why This Resists Clean Abstractions

The natural instinct is to normalize this into a clean data model. Something like:

```python
@dataclass
class Rate:
    service_code: str
    amount: Decimal
    rate_type: str  # "fixed", "percent_of_medicare", "percent_of_charges"
    effective_date: date
    source_document: str
```

This works for specified values. It breaks for inherited ones, where the "amount" isn't a number—it's a formula that references an external dataset that updates annually. It breaks differently for detected values, where the confidence level matters and the extraction might be wrong.

A rate that says "120% of Medicare" isn't really a rate at all. It's a *pointer* to a rate that will be computed later, using data that lives outside the contract, maintained by a different organization, on a different update cycle.

```python
# What you want to write:
rate = get_rate(service_code="27447", contract_id="C-1234")

# What actually has to happen:
contract_term = resolve_applicable_term(service_code, contract, date)
if contract_term.rate_type == "percent_of_reference":
    reference_rate = fetch_medicare_rate(
        service_code,
        fee_schedule=contract_term.reference_schedule,
        year=contract_term.reference_year,
        locality=contract_term.locality,
    )
    rate = reference_rate * contract_term.multiplier
```

And that's the simple case—one applicable term, one reference schedule, no stacking of modifiers.

## Compounding Ambiguity

Healthcare contracts are written by humans for humans. They assume a reader who can hold context, resolve ambiguity, and apply judgment. Software can't.

Common sources of ambiguity:

- **Temporal overlap.** An amendment says "effective January 1, 2024" but doesn't specify an end date. Does the base agreement rate still apply for services not mentioned in the amendment?
- **Scope gaps.** The fee schedule covers 500 procedure codes. The provider performs 600. What rate applies to the other 100?
- **Implicit defaults.** "All other services at 80% of charges" seems clear until you ask: 80% of *which* charges? Billed charges? Allowed charges? And what counts as "other"?

These aren't edge cases. They're the normal operating environment. Any system that processes healthcare contracts encounters these ambiguities constantly, and the resolution often comes down to institutional knowledge—how the payer and provider have historically interpreted the contract, which may not be written down anywhere.

## What This Means for Software

Building software around healthcare contracts requires accepting a few uncomfortable truths:

**You can't fully normalize the data.** Some information is genuinely ambiguous and will stay that way until a human resolves it. The system needs to represent uncertainty, not just values.

**Reference data is part of the model.** A contract that says "130% of Medicare" isn't self-contained. The external fee schedules it references are first-class dependencies, not background context.

**The same contract means different things over time.** As reference rates update, inherited values change. The contract text is static but the rates it produces aren't. Versioning isn't just about the contract—it's about the state of the world when the contract is evaluated.

**Extraction and interpretation are separate problems.** Pulling text from a PDF is one problem. Understanding what that text means in context—which rates it overrides, which documents it references, what scope it applies to—is a fundamentally different problem that requires domain knowledge.

None of this means the problem is unsolvable. It means that the clean abstractions we reach for—lookup tables, normalized schemas, CRUD interfaces—need to be applied carefully, with awareness of where they fit and where the domain pushes back.

The contracts are hard to reason about because the domain is hard to reason about. The software, at best, makes the complexity visible rather than hiding it.

---

*This post was written with AI assistance and human curation.*
