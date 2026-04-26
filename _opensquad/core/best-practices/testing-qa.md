---
id: testing-qa
name: "Testing & QA"
whenToUse: |
  Creating agents that define quality strategies, write tests, validate regressions,
  triage defects, and enforce release-readiness criteria.
  NOT for: writing production feature code without quality validation.
version: "1.0.0"
---

# Testing & QA - Best Practices

## Core Principles

1. **Risk-based prioritization.** Test depth follows impact and likelihood of failure.
2. **Shift-left quality.** Define acceptance criteria and test scenarios before implementation completes.
3. **Layered validation.** Combine unit, integration, and end-to-end checks based on risk profile.
4. **Reproducibility.** Every defect report includes deterministic reproduction steps and expected behavior.
5. **Fast feedback loops.** Prioritize checks that catch critical regressions early in CI.
6. **Quality gates are explicit.** Release decisions use pre-defined thresholds, not subjective confidence.

## QA Method

1. Translate requirements into testable acceptance criteria.
2. Build a test matrix covering happy path, edge cases, and failure modes.
3. Implement automated checks for repeatable regressions.
4. Run exploratory testing for complex user journeys and environment-specific issues.
5. Report defects with severity, impact, reproduction, and evidence.
6. Validate fixes with targeted and regression tests before closure.

## Decision Criteria

- **Automate vs manual:** automate high-frequency and high-risk regressions; keep low-frequency exploratory checks manual.
- **Release blocking:** block release on unresolved critical/high-severity defects in core workflows.
- **Test depth:** increase depth when touching auth, payments, data integrity, or infra-critical paths.

## Quality Criteria

- [ ] Acceptance criteria are mapped to concrete test cases.
- [ ] Test matrix includes edge and failure scenarios.
- [ ] Automated suite covers regression-critical paths.
- [ ] Defect reports include reproducible evidence.
- [ ] Exit criteria for release are documented and enforced.
- [ ] Flaky tests are tracked and remediated with ownership.

## Anti-Patterns

### Never Do

1. Treat a "green test run" as proof of complete quality.
2. Close bugs without validating root cause and regression risk.
3. Ignore flaky tests until they become noise and lose trust.
4. Release with unknown impact on core journeys.

### Always Do

1. Connect tests to user and business risk.
2. Keep release gates objective and visible.
3. Maintain defect hygiene with clear severity and ownership.

