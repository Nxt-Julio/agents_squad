---
id: software-architecture
name: "Software Architecture & Technical Design"
whenToUse: |
  Creating agents that transform product goals into architecture decisions,
  service boundaries, API contracts, data models, and implementation plans.
  NOT for: direct feature coding without design context, marketing content.
version: "1.0.0"
---

# Software Architecture & Technical Design - Best Practices

## Core Principles

1. **Start from outcomes, not tools.** Architecture decisions must trace back to business goals, user impact, and operational constraints.
2. **Design for evolvability.** Prefer modular boundaries and explicit contracts that allow independent change.
3. **Make trade-offs explicit.** Every major decision records alternatives, pros, cons, and why one path was selected.
4. **Bias for operational safety.** Include failure modes, rollback strategy, and observability from the design stage.
5. **Minimize accidental complexity.** Choose the simplest architecture that can meet current scale and near-term growth.
6. **Define ownership and interfaces.** Every module/service has a clear owner and a stable interface contract.

## Design Method

1. Clarify functional requirements, quality attributes, constraints, and non-goals.
2. Identify domain boundaries and map responsibilities per component.
3. Define external and internal interfaces: API schemas, events, and data contracts.
4. Model state and data lifecycle: storage, consistency model, migration strategy, retention.
5. Evaluate failure paths: dependency outages, partial writes, retries, idempotency, timeouts.
6. Produce an implementation plan with phased rollout and measurable checkpoints.

## Decision Criteria

- **Monolith vs services:** choose services only when independent scaling/deployment is a real requirement.
- **Sync vs async:** choose async when reliability, decoupling, or latency tolerance justify eventual consistency.
- **Build vs buy:** prefer managed/platform capabilities when differentiation is not in the infrastructure layer.
- **Schema strategy:** use backward-compatible changes by default, with versioning when compatibility cannot be preserved.

## Quality Criteria

- [ ] Architecture document includes goals, constraints, and non-goals.
- [ ] Component boundaries and ownership are explicit.
- [ ] API/data contracts are defined with versioning strategy.
- [ ] Key failure modes and mitigation paths are documented.
- [ ] Rollout, rollback, and observability plans are included.
- [ ] Trade-offs and rejected alternatives are recorded.

## Anti-Patterns

### Never Do

1. Introduce distributed complexity before proving the need.
2. Design around framework preferences instead of domain boundaries.
3. Ignore operational failure and assume "happy path only."
4. Leave ownership ambiguous across critical modules.

### Always Do

1. Write architecture decisions as testable hypotheses.
2. Prefer clear contracts and bounded contexts over implicit coupling.
3. Define SLO/SLA expectations for critical flows.

