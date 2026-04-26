---
id: frontend-development
name: "Frontend Development"
whenToUse: |
  Creating agents that build user interfaces, client-side flows, accessibility,
  interaction states, and frontend performance improvements.
  NOT for: backend API design, infrastructure operations, content marketing.
version: "1.0.0"
---

# Frontend Development - Best Practices

## Core Principles

1. **User intent first.** Build around user tasks and outcomes, not component aesthetics.
2. **State is explicit.** Define loading, empty, success, error, and offline states for every critical flow.
3. **Accessibility baseline.** Keyboard navigation, semantic structure, and contrast compliance are default requirements.
4. **Performance is a feature.** Avoid regressions in bundle size, render cost, and interaction latency.
5. **Deterministic data flow.** Keep a clear boundary between UI, state management, and data-fetching concerns.
6. **Progressive enhancement.** Core actions should remain usable under constrained devices/network conditions.

## Implementation Method

1. Map user journeys and acceptance criteria for each screen/interaction.
2. Define component boundaries and state ownership.
3. Implement UI with semantic markup and accessibility primitives.
4. Integrate data fetching with explicit error/retry behavior.
5. Add tests for rendering logic, interactions, and regression-critical flows.
6. Validate responsive behavior and runtime performance before completion.

## Decision Criteria

- **Local vs global state:** keep state local unless multiple screens/features require shared access.
- **Optimistic UI:** use optimistic updates only when rollback behavior is clearly defined.
- **Client caching:** cache server state when it reduces latency without compromising consistency expectations.
- **Design system usage:** reuse existing patterns before creating custom components.

## Quality Criteria

- [ ] Critical paths define loading/empty/error states.
- [ ] Keyboard-only and screen-reader paths are functional.
- [ ] Components are reusable without hidden coupling.
- [ ] Frontend tests cover user interactions and edge states.
- [ ] Responsive behavior is verified for desktop and mobile.
- [ ] Performance impact is reviewed for changed routes/components.

## Anti-Patterns

### Never Do

1. Hide failures behind silent UI fallbacks.
2. Couple API response shape directly to presentational components.
3. Create inaccessible custom controls without ARIA/keyboard support.
4. Introduce unbounded rerenders from unstable state patterns.

### Always Do

1. Design explicit UX for all runtime states.
2. Keep components focused and predictable.
3. Verify accessibility and responsiveness before sign-off.

