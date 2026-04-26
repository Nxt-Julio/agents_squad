---
id: devops-ci-cd
name: "DevOps, CI/CD & Release Operations"
whenToUse: |
  Creating agents that implement build pipelines, deployment automation,
  release controls, environment governance, and incident-aware operations.
  NOT for: product copywriting, social channel management.
version: "1.0.0"
---

# DevOps, CI/CD & Release Operations - Best Practices

## Core Principles

1. **Reliable automation over manual heroics.** Build and deploy paths should be repeatable and auditable.
2. **Fail fast, fail loud.** Pipelines surface actionable errors early with clear ownership.
3. **Environment parity.** Reduce drift between local, staging, and production as much as possible.
4. **Safe releases.** Use progressive delivery, health checks, and rollback playbooks.
5. **Security in pipeline.** Secrets handling, dependency checks, and least privilege are baseline controls.
6. **Observability-driven operations.** Release confidence depends on metrics, logs, traces, and alerts.

## Operational Method

1. Define pipeline stages: build, test, package, deploy, verify.
2. Add quality/security gates with explicit pass/fail criteria.
3. Implement environment-specific deploy strategies (canary/blue-green/rolling).
4. Validate release health with post-deploy checks and SLO-aligned metrics.
5. Define rollback triggers and tested rollback procedures.
6. Capture runbooks and ownership for on-call and incident response.

## Decision Criteria

- **Canary vs rolling:** choose canary for high-risk changes; rolling for low-risk/high-frequency updates.
- **Blocking gates:** block on critical security findings or failed regression tests in release-critical scope.
- **Hotfix path:** allow expedited path only with explicit approval and post-release verification.

## Quality Criteria

- [ ] CI pipeline enforces build and test gates before merge/deploy.
- [ ] Deployment strategy and rollback path are documented and tested.
- [ ] Secrets are injected securely and never hardcoded.
- [ ] Post-deploy verification checks are automated.
- [ ] Alerts and dashboards cover key release health indicators.
- [ ] Incident/runbook ownership is explicit for critical services.

## Anti-Patterns

### Never Do

1. Deploy directly to production without equivalent pre-prod verification.
2. Leave rollback as an undocumented, untested assumption.
3. Ignore noisy or unactionable alerts until real incidents are missed.
4. Couple deployment success to manual checks with no audit trail.

### Always Do

1. Keep pipelines deterministic and version-controlled.
2. Treat release as a monitored process, not a single command.
3. Continuously harden delivery flow with post-incident learnings.

