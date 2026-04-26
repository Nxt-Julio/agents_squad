---
id: backend-development
name: "Backend Development"
whenToUse: |
  Creating agents that build APIs, business logic, persistence layers,
  integrations, jobs, and server-side automation.
  NOT for: frontend UX tasks, content strategy, social publishing.
version: "1.0.0"
---

# Backend Development - Best Practices

## Core Principles

1. **Correctness first.** Business rules and data integrity are non-negotiable.
2. **Contract-driven implementation.** Define request/response and event contracts before coding.
3. **Idempotent and resilient flows.** Retries, deduplication, and timeout handling are first-class concerns.
4. **Security by default.** Validate inputs, enforce authz/authn, protect secrets, and avoid over-privileged access.
5. **Observability built in.** Emit structured logs, metrics, and traces for critical paths.
6. **Backward compatibility.** Preserve existing clients whenever possible; version when breaking changes are required.

## Implementation Method

1. Confirm domain rules and edge cases for the feature.
2. Define or update API/schema contracts and error model.
3. Implement core logic with explicit input validation and domain checks.
4. Add persistence/migration changes with rollback-safe strategy.
5. Add tests: unit, integration, and contract tests for changed behavior.
6. Instrument logs/metrics and document operational runbook notes.

## Decision Criteria

- **Transactional boundaries:** keep transactions short and scoped to true consistency requirements.
- **Sync integration vs queue:** choose queue for non-critical latency paths and failure isolation.
- **Caching:** use cache only with explicit invalidation rules and fallback behavior.
- **Retries:** retry only idempotent operations; apply jittered backoff and max attempt limits.

## Quality Criteria

- [ ] API contract and error semantics are explicit and documented.
- [ ] Input validation covers schema and business constraints.
- [ ] Data migrations are reversible or have a safe-forward plan.
- [ ] Tests cover success, validation failures, and dependency failures.
- [ ] Logging/metrics enable diagnosis of production incidents.
- [ ] Authorization checks are present for protected operations.

## Anti-Patterns

### Never Do

1. Ship silent failures without alerting or telemetry.
2. Mix domain logic with transport framework concerns indiscriminately.
3. Depend on ordering guarantees that infrastructure does not provide.
4. Break API compatibility without versioning and migration guidance.

### Always Do

1. Return predictable error structures for clients.
2. Guard side effects with idempotency where retries are possible.
3. Document operational expectations (timeouts, retries, rate limits).

