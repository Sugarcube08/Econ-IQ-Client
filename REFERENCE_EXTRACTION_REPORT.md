# Reference Extraction Report

This report catalogs all source documents, Google Stitch exported visuals, design layouts, and backend schema files originally situated in the `ref/` directory. It documents the purpose of each reference, whether its knowledge was extracted, its new permanent location, and confirms that it has been safely decommissioned from the active client codebase.

---

## 1. Reference Extraction Log

| File / Folder Path | Purpose | Still Needed? | Migrated To | Safe to Remove? |
| :--- | :--- | :--- | :--- | :--- |
| `ref/backend_docs/BACKEND_ENDPOINT_INVENTORY.md` | Lists API router endpoints, parameters, query modifiers, and responses. | Yes (Static Reference) | [docs/api/BACKEND_ENDPOINT_INVENTORY.md](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/docs/api/BACKEND_ENDPOINT_INVENTORY.md) | **Yes** |
| `ref/backend_docs/API_ALIGNMENT_REPORT.md` | Outlines REST routing corrections, status codes, and type checks. | Yes (Static Reference) | [docs/api/API_ALIGNMENT_REPORT.md](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/docs/api/API_ALIGNMENT_REPORT.md) | **Yes** |
| `ref/backend_docs/DATABASE_API_TRACEABILITY.md` | Traces FastAPI controllers to PostgreSQL database tables and columns. | Yes (Static Reference) | [docs/api/DATABASE_API_TRACEABILITY.md](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/docs/api/DATABASE_API_TRACEABILITY.md) | **Yes** |
| `ref/backend_docs/FRONTEND_CONTEXT.md` | Development context for App Router, routing states, and visual themes. | Yes (Consolidated) | [docs/frontend/FRONTEND_CONTEXT.md](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/docs/frontend/FRONTEND_CONTEXT.md) | **Yes** |
| `ref/backend_docs/README.md` | Backend core readme and startup instructions. | Yes (Static Reference) | [docs/api/BACKEND_README.md](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/docs/api/BACKEND_README.md) | **Yes** |
| `ref/executive_intelligence_system_1/DESIGN.md` | Visual guidelines and layout instructions. | Yes (Static Reference) | [docs/design/EXECUTIVE_INTEL_SYSTEM_1_DESIGN.md](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/docs/design/EXECUTIVE_INTEL_SYSTEM_1_DESIGN.md) | **Yes** |
| `ref/executive_intelligence_system_2/DESIGN.md` | Dashboard panel structure notes. | Yes (Static Reference) | [docs/design/EXECUTIVE_INTEL_SYSTEM_2_DESIGN.md](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/docs/design/EXECUTIVE_INTEL_SYSTEM_2_DESIGN.md) | **Yes** |
| `ref/intelligent_commerce_architecture/DESIGN.md` | Core layout styling guidelines and visual token specs. | Yes (Static Reference) | [docs/architecture/INTELLIGENT_COMMERCE_ARCHITECTURE_DESIGN.md](file:///home/sugarcube/Desktop/Documents/Code-Server/Hackathon%20Projects/India-Runs/ECON-IQ/Econ-Client/docs/architecture/INTELLIGENT_COMMERCE_ARCHITECTURE_DESIGN.md) | **Yes** |
| `ref/stitch-export/` | Stitch layout screenshots and visual mock HTML files. | No | Extracted into visual layouts (Tailwind classes, page views) | **Yes** |
| `ref/customer_analytics_detail/` | Stitch details page design mock and markup. | No | Implemented as `/customer/[id]` routing layout | **Yes** |
| `ref/intelligence_reports/` | Stitch reports design mock and markup. | No | Implemented as `/reports` layout | **Yes** |
| `ref/econ_iq_commercial_intelligence/` | Stitch portal dashboard mock and markup. | No | Implemented as `/dashboard` bento cards | **Yes** |
| `ref/system_health_command_center/` | Stitch health view design mock and markup. | No | Implemented inside system health screens | **Yes** |
| `ref/executive_dashboard/` | Stitch main dashboard mock and markup. | No | Implemented inside `/dashboard` layout | **Yes** |
| `ref/organization_control_command_center/` | Stitch user directory mock and markup. | No | Implemented as `/users` view | **Yes** |
| `ref/commercial_intelligence_table/` | Stitch datatable layout mock and markup. | No | Implemented as `/customers` view | **Yes** |
| `ref/login_econ_iq_command_center/` | Stitch login screen mock and markup. | No | Implemented as `/login` page | **Yes** |

---

## 2. Extraction & Decommission Verification

1. **No Code Dependency**: Verified that no typescript components, import headers, layout stylesheets, or webpack assets reference the `ref/` folder.
2. **Archival Snapshot**: Moved all visual mocks, HTML code, and images into an archive location outside the development tree (`../archive/ref_snapshot/`).
3. **Clean Code Compilation**: Confirmed that the application compiles 100% cleanly following folder removal.
