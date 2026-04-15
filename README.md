# Global Labour Compliance Navigator

This repository contains a lightweight prototype for a global labour compliance app. The current version is intentionally dependency-free so it can be opened locally and extended quickly.

## What the prototype does

- Consolidates example labour compliance requirements by country.
- Adjusts review output based on latest headcount, decision type, worker category, and urgency.
- Surfaces key requirements, required documents, process steps, and external support needs.
- Demonstrates the structure needed for hiring and termination workflows.

## Files

- `index.html`: Application shell and UI layout.
- `styles.css`: Visual design and responsive layout.
- `data.js`: Example country rules and decision datasets.
- `app.js`: Client-side rules engine and rendering logic.

## How to run

Open `index.html` directly in a browser, or serve the folder with Python:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Suggested production architecture

1. Use an HRIS integration layer to ingest live headcount by country, entity, and worker type.
2. Store compliance rules in a governed content model with version history, owners, effective dates, and source links.
3. Add workflow states for draft, legal review, approved, and archived decisions.
4. Separate legal content into reusable modules:
   - hiring
   - termination
   - documentation
   - approvals
   - external advisor triggers
5. Add role-based views for HR operations, legal, people leaders, and finance.
6. Add an audit trail for who reviewed a decision and which rule version was applied.

## Important note

The legal content in `data.js` is sample guidance for prototyping the app shape. Before real-world use, each jurisdiction should be validated against current employment law requirements and maintained through an update process with legal review.
