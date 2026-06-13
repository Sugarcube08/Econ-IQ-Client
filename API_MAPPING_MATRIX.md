# API Mapping Matrix

This document maps each frontend component and route to its corresponding backend API endpoint, detailing the HTTP method, request parameters, and response fields.

---

## 1. Authentication Views (`/login`, `/`)

### Email Form & OTP Trigger
- **Frontend Component**: `LoginForm` (Email Input)
- **Backend Endpoint**: `POST /api/v1/auth/request-otp`
- **Request Payload**:
  ```json
  {
    "email": "test_user@econiq.core"
  }
  ```
- **Response Fields**:
  - `success`: `boolean` (OTP generation success)
  - `message`: `string`
  - `data.email`: `string` (sent verification target)

### OTP Code Verification
- **Frontend Component**: `OtpSection` (OTP Token Inputs)
- **Backend Endpoint**: `POST /api/v1/auth/verify-otp`
- **Request Payload**:
  ```json
  {
    "email": "test_user@econiq.core",
    "otp": "735011"
  }
  ```
- **Response Fields**:
  - `data.access_token`: `string` (EdDSA JWT)
  - `data.refresh_token`: `string` (UUID session token)
  - `data.token_type`: `string` ("bearer")
  - `data.expires_in`: `number` (3600 seconds)

### Active Analyst Session (Header)
- **Frontend Component**: `TopNavBar` (Profile Display)
- **Backend Endpoint**: `GET /api/v1/auth/me`
- **Response Fields**:
  - `data.email`: `string`
  - `data.first_name`: `string`
  - `data.last_name`: `string`
  - `data.role`: `string` (e.g. `SUPER_ADMIN`, `ANALYST`)

---

## 2. Dashboard Views (`/dashboard`)

### KPI Indicator Cards
- **Frontend Component**: `OverviewCards`
- **Backend Endpoint**: `GET /api/v1/dashboard/overview`
- **Response Fields**:
  - `data.active_customers`: `number`
  - `data.sales_total`: `number`
  - `data.collections_total`: `number`
  - `data.outstanding_exposure`: `number`
  - `data.health_index`: `number`

### Commercial Pulse Line Chart
- **Frontend Component**: `CommercialPulseChart`
- **Backend Endpoint**: `GET /api/v1/dashboard/commercial-flow`
- **Response Fields**:
  - `data`: List of `{"period_start": string, "sales_volume": float, "collection_volume": float, "outstanding_exposure": float}`

### Aging Distribution Bar Chart
- **Frontend Component**: `AgingReceivablesChart`
- **Backend Endpoint**: `GET /api/v1/dashboard/aging-distribution`
- **Response Fields**:
  - `data`: Dictionary of buckets: `current`, `overdue_30`, `overdue_60`, `overdue_90`, `overdue_120`, `overdue_120_plus`

### Behavioral State Segments
- **Frontend Component**: `StateDistributionChart`
- **Backend Endpoint**: `GET /api/v1/dashboard/state-distribution`
- **Response Fields**:
  - `data`: Map of segments (`HEALTHY`, `MONITOR`, `CONTRACT`, `LIQUIDITY_STRESS`) to count and percentage.

### Attention Tables (Bento Grid)
- **Frontend Component**: `DeterioratingCustomers`, `ImprovingCustomers`, `HighRiskCustomers`
- **Backend Endpoints**:
  - `GET /api/v1/dashboard/deteriorating-customers`
  - `GET /api/v1/dashboard/improving-customers`
  - `GET /api/v1/dashboard/high-risk-customers`
- **Response Fields**:
  - List of customer summaries containing: `customer_id`, `customer_name`, `trust_score`, `outstanding_current`, `state`

---

## 3. Customer Intelligence Listing (`/customers`)

### Accounts Datatable
- **Frontend Component**: `CustomerTable` (with Server Search, Sort, Paging, Filter)
- **Backend Endpoint**: `GET /api/v1/customers`
- **Query Parameters**:
  - `page`: `number`
  - `limit`: `number`
  - `sort_by`: `string`
  - `sort_order`: `string`
  - `search`: `string`
  - `current_state`: `string` (comma-separated list)
- **Response Fields**:
  - `data.customers`: List of `Customer`
  - `metadata.pagination`: `{ page, limit, total_records, total_pages, has_next, has_previous }`

---

## 4. Customer Analytics Detail (`/customer/[id]`)

### Core Metrics Scorecard
- **Frontend Component**: `CustomerScorecard`
- **Backend Endpoint**: `GET /api/v1/customer/{id}`
- **Response Fields**:
  - `data.customer.scores`: `health_score`, `risk_score`, `growth_score`, `trust_score`, `opportunity_score`, `credit_score`, `collection_score`, `relationship_score`
  - `data.customer.deltas`: Offset values for each score.
  - `data.customer.behavior_state`: `string`

### Analytical Timelines
- **Frontend Component**: `CustomerTimelineCharts`
- **Backend Endpoints**:
  - `GET /api/v1/customer/{id}/purchase-graph`
  - `GET /api/v1/customer/{id}/payment-graph`
  - `GET /api/v1/customer/{id}/rg-graph`
  - `GET /api/v1/customer/{id}/outstanding-graph`

### Future Predictions Panel
- **Frontend Component**: `PredictionsPanel`
- **Backend Endpoint**: `GET /api/v1/customer/{id}/predictions`
- **Response Fields**:
  - `data.risk`, `data.growth`, `data.health`, `data.churn`, `data.collection`, `data.opportunity` outputs.

### Recommendations List
- **Frontend Component**: `RecommendationsPanel`
- **Backend Endpoint**: `GET /api/v1/customer/{id}/recommendations`
- **Response Fields**:
  - `data.recommendations`: List of `{ type, priority, reason, affected_score, expected_impact, confidence, action_category, value }`
