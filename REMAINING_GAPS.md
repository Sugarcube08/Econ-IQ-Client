# Remaining Gaps & Recommendations

This document details outstanding backend issues, database schema errors, and architectural recommendations that should be resolved before transitioning the Econiq application to public production environments.

---

## 1. Critical Backend Gaps

### 1.1. High Default Risk Queue Crash (500 Internal Server Error)
- **Observed Behavior**: Requests to `GET /dashboard/high-risk-customers` crash with a 500 status code.
- **Root Cause**: The FastAPI server log indicates a database SQL statement failure when computing the customer risk profile ranking. A query references a missing database column or joins data on conflicting data types.
- **Frontend Mitigation**: The frontend widget is protected from crashing by query error handlers that render a degraded status notification.
- **Production Recommendation**: Auditing is required on the backend SQL/ORM mapper in `core/routers/dashboard.py` or the underlying risk assessment database queries to correct the column naming.

### 1.2. Longitudinal Graph Date Parsing & Empty States
- **Observed Behavior**: Period starts and ends are served as ISO dates strings (e.g., `2025-06-13`). Granularity shifts are supported by backend arguments, but the response schema doesn't output empty periods.
- **Production Recommendation**: Integrate period padding inside the backend API responses. If a customer has zero sales for a week, the backend should return `0` purchase amounts rather than omitting the period, preventing charts from distorting time spans.

---

## 2. Security & Operations Recommendations

### 2.1. CORS Policy Validation
- **Current Setup**: FastAPI development servers run with wildcard origins (`allow_origins=["*"]`).
- **Production Recommendation**: Restrict CORS headers to authorized domain addresses only.

### 2.2. Session Security (HttpOnly Cookies)
- **Current Setup**: Refresh tokens are persistent inside browser local storage to maintain session states.
- **Production Recommendation**: Transition refresh token exchanges to HttpOnly cookies. This blocks access to session secrets from JavaScript contexts, eliminating XSS token theft vectors.

### 2.3. CSRF (Cross-Site Request Forgery) Protection
- **Production Recommendation**: Implement CSRF tokens for state-modifying endpoints (such as API key creation and user registration) when shifting to cookie-based sessions.

---

## 3. Deployment & Cache Optimization

### 3.1. CDN Caching & Edge Optimization
- Next.js static layouts (matrix tables, login forms) are built statically. We recommend routing asset delivery through a Content Delivery Network (CDN) like Cloudflare to cache layouts at the edge.

### 3.2. Server-Side Logging & Diagnostics
- Log React runtime errors captured by our `ErrorBoundary` to a centralized error aggregator (such as Sentry or LogRocket) for real-time observability.
- Configure backend logging to capture and alert on database query exceptions (such as the `/dashboard/high-risk-customers` crash) automatically.
