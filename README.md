# Namaste! :)
# GloWoCo

GloWoCo is the Global Workforce Compliance Tool. This repository contains a dependency-free web prototype for navigating workforce compliance across regions, countries, and legal entities, with dedicated assessment flows for current-entity compliance review and acquisition due diligence.

## What the tool does

- Provides role-based access across global, regional, and country teams.
- Organizes the company footprint by region, country, and entity.
- Differentiates between current operations and potential acquisition countries.
- Surfaces country guidance for:
  - general compliance context
  - labor code summary
  - statutory benefits
  - hiring
  - termination
  - visa process
  - global mobility
  - performance management
- Supports entity-level Compliance Gap Analysis with:
  - six compliance categories
  - bare minimum requirements
  - mandatory records
  - document proof capture
  - comments and status updates
- Supports Acquisition Review with:
  - target entity intake
  - country-specific diligence workstreams
  - evidence review
  - submission workflow
  - exportable diligence summary

## Current product structure

### Home workspace

The home page is the main navigation layer. It includes:

- a compact compliance dashboard
- role and footprint filtering
- region-based footprint navigation
- country and entity selection
- country-level workflow tabs
- direct links to the two dedicated assessment pages

### Compliance Gap Analysis

This dedicated page is used for current owned entities. It includes:

- an in-scope regional hero dashboard
- assessment context controls
- country requirement coverage tabs
- compliance category tabs
- proof and comment capture for each category

### Acquisition Review

This dedicated page is used for target-company workforce due diligence. It includes:

- target profile intake via modal
- generated diligence workstreams based on target facts
- evidence review by diligence category
- draft, submit, and export actions

## Main files

- `index.html`: Home page for GloWoCo.
- `app.js`: Main workspace rendering, role logic, country workspace, home-page dashboard, and modal behavior.
- `compliance-gap-analysis.html`: Dedicated page for compliance review of current entities.
- `gap-analysis.js`: Compliance Gap Analysis page logic, assessment scoring, and in-scope regional dashboard.
- `acquisition-review.html`: Dedicated page for acquisition due diligence.
- `acquisition-review.js`: Acquisition Review logic, target profile handling, diligence workstreams, submission flow, and summary export.
- `data.js`: Example regions, countries, roles, entities, and workflow content.
- `styles.css`: Shared styling across the home page and both dedicated assessment pages.
- `DEMO-SCRIPT.md`: Presenter-ready script for recording a product demo.

## How to run

Open `index.html` directly in a browser, or serve the folder locally:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes on the prototype

- The app is currently client-side only.
- Assessment state is stored in browser local storage.
- File uploads in the assessment flows are prototype-level and do not persist to a shared backend.
- Country and entity content is sample product content for structure and design, not production legal advice.


## Important note

Sri: This project is a prototype for product design and workflow modeling. Before production use, each jurisdiction, requirement, and decision flow should be validated against current law and maintained through a controlled update process with legal review.
