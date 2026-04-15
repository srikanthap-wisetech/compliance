const roleSelect = document.getElementById("role-select");
const footprintFilterSelect = document.getElementById("footprint-filter");
const roleNameNode = document.getElementById("role-name");
const roleDescriptionNode = document.getElementById("role-description");
const scopeTagsNode = document.getElementById("scope-tags");
const regionGridNode = document.getElementById("region-grid");
const countryNameNode = document.getElementById("country-name");
const countryMetaNode = document.getElementById("country-meta");
const countryRegionNode = document.getElementById("country-region");
const countryStatusNode = document.getElementById("country-status");
const headcountBandNode = document.getElementById("headcount-band");
const supportSignalNode = document.getElementById("support-signal");
const tabBarNode = document.getElementById("tab-bar");
const tabContentNode = document.getElementById("tab-content");
const headcountInput = document.getElementById("headcount");
const entitySelect = document.getElementById("entity-select");
const workerTypeSelect = document.getElementById("worker-type");
const urgencySelect = document.getElementById("urgency");
const notesInput = document.getElementById("notes");
const entityStatusNode = document.getElementById("entity-status");
const gapShortcutButton = document.getElementById("gap-shortcut");
const acquisitionShortcutButton = document.getElementById("acquisition-shortcut");
const dashboardTitleNode = document.getElementById("dashboard-title");
const dashboardRegionsNode = document.getElementById("dashboard-regions");
const dashboardCountriesNode = document.getElementById("dashboard-countries");
const dashboardEntitiesNode = document.getElementById("dashboard-entities");
const dashboardSummaryNode = document.getElementById("dashboard-summary");
const dashboardRegionsListNode = document.getElementById("dashboard-regions-list");
const openToolSummaryButton = document.getElementById("open-tool-summary");
const toolSummaryModal = document.getElementById("tool-summary-modal");
const toolSummaryBackdrop = document.getElementById("tool-summary-backdrop");
const closeToolSummaryButton = document.getElementById("close-tool-summary");

const { roles, countries, tabs } = window.complianceData;
const state = { roleId: roles[0].id, countryCode: countries[0].code, entityId: "", tabId: "general", footprintFilter: "all", gapCategoryId: "labor_statutory", regionId: "" };
const storageKeys = {
  assessment: "gwct-assessment-store-v3",
  documents: "gwct-document-store-v3",
  minimums: "gwct-minimum-store-v3",
  comments: "gwct-comment-store-v3",
  proofs: "gwct-proof-store-v3"
};

function countryRiskLevel(country) {
  return country.riskLevel || (country.highRisk ? "high" : "moderate");
}

function countryRiskLabel(country) {
  const labels = {
    high: "High termination / restructuring risk",
    moderate: "Moderate termination / restructuring risk",
    lower: "Lower termination / restructuring risk"
  };
  return labels[countryRiskLevel(country)] || labels.moderate;
}

function countryRiskCounts(countriesInScope) {
  return countriesInScope.reduce((summary, country) => {
    const level = countryRiskLevel(country);
    summary[level] = (summary[level] || 0) + 1;
    return summary;
  }, { high: 0, moderate: 0, lower: 0 });
}

function setToolSummaryOpen(nextOpen) {
  toolSummaryModal.classList.toggle("hidden", !nextOpen);
}

const complianceCategories = {
  labor_statutory: {
    label: "Labor & statutory compliance",
    minimums: [
      "Locally compliant employment terms and templates are approved.",
      "Core hiring, discipline, performance, and termination process rules are documented.",
      "Employee classification, working time, leave, consultation-sensitive risks, registrations, and statutory obligations are understood."
    ],
    requiredDocuments: ["Approved local contract template", "Employee handbook or policy pack", "Termination / ER process guide", "Statutory registration certificates"]
  },
  payroll: {
    label: "Payroll compliance",
    minimums: [
      "Payroll is registered and configured for the entity.",
      "Mandatory pay elements, deductions, and approvals are operational.",
      "Payroll controls exist for final pay, audits, and reconciliation."
    ],
    requiredDocuments: ["Payroll registration evidence", "Payroll controls matrix", "Latest payroll reconciliation sample"]
  },
  legal: {
    label: "Legal compliance",
    minimums: [
      "Local legal templates and playbooks are approved.",
      "Delegations, approvals, and claims or litigation tracking exist.",
      "Acquisition or inherited-risk issues have legal review."
    ],
    requiredDocuments: ["Delegation of authority matrix", "Approved legal templates", "Claims / litigation tracker"]
  },
  hr_records: {
    label: "HR operations / employee records",
    minimums: [
      "Employee files are complete and auditable.",
      "Signed contracts, acknowledgements, and onboarding/offboarding records are retained.",
      "Active case documentation is centrally tracked."
    ],
    requiredDocuments: ["Employee file checklist", "Signed contract sample pack", "Onboarding / offboarding audit log"]
  },
  immigration: {
    label: "Immigration / mobility compliance",
    minimums: [
      "Sponsored populations and work authorization dependencies are known.",
      "Mobility arrangements have tax, payroll, and immigration review.",
      "Permit expiry and sponsorship obligations are tracked."
    ],
    requiredDocuments: ["Visa / work authorization tracker", "Mobility approvals log", "Expiry and renewal tracker"]
  },
  data_privacy: {
    label: "Data privacy / employee data compliance",
    minimums: [
      "Employee data flows and storage locations are known.",
      "Access, transfer, and retention controls are documented.",
      "Sensitive employee data handling has legal or privacy oversight."
    ],
    requiredDocuments: ["Employee data map", "Retention and access control policy", "Cross-border data transfer assessment"]
  }
};

const statutoryBenefitsLibrary = {
  AU: ["Superannuation contributions", "Paid annual leave", "Personal / sick leave", "Parental leave entitlements", "Long service leave considerations"],
  IN: ["Provident fund", "Employee state insurance where applicable", "Gratuity", "Earned / privilege leave", "Maternity benefit entitlements"],
  SG: ["Central Provident Fund contributions where applicable", "Annual leave", "Sick leave and hospitalization leave", "Childcare and parental leave", "Public holiday entitlements"],
  UK: ["Pension auto-enrolment", "Statutory sick pay", "Statutory maternity / paternity / shared parental pay", "Holiday entitlement", "Redundancy pay where applicable"],
  FR: ["Social security contributions", "Paid leave", "Public holiday treatment", "Supplementary benefits depending on collective framework", "Family and health-related leave entitlements"],
  NL: ["Holiday allowance", "Paid leave entitlements", "Sick pay obligations", "Pension depending on scheme / sector", "Parental and care leave entitlements"],
  US: ["State or local paid sick leave where applicable", "Benefits plan participation where offered", "Workers compensation coverage", "Unemployment insurance", "Leave entitlements based on federal and state thresholds"],
  DE: ["Social insurance contributions", "Paid annual leave", "Public holiday entitlements", "Sick pay continuation", "Parental and family-related leave entitlements"],
  CA: ["Provincial employment standards leaves", "Vacation entitlements", "Public holiday treatment", "Statutory benefits and insurance deductions", "Province-specific sick or emergency leave entitlements"]
};

const recordCategoryMap = {
  "employment-contract-template": "labor_statutory",
  "award-classification-register": "labor_statutory",
  "super-payroll-setup": "payroll",
  "termination-playbook": "legal",
  "legacy-policy-mapping": "hr_records",
  "delegation-of-authority": "legal",
  "employee-record-audit": "hr_records",
  "payroll-benefits-reconciliation": "payroll",
  "state-registration-pack": "labor_statutory",
  "appointment-letter-template": "labor_statutory",
  "settlement-checklist": "payroll",
  "disciplinary-procedure": "legal",
  "contract-template": "labor_statutory",
  "work-pass-tracker": "immigration",
  "termination-template": "legal",
  "manager-guidance": "hr_records",
  "right-to-work-process": "immigration",
  "pension-autoenrolment": "labor_statutory",
  "redundancy-playbook": "legal",
  "settlement-agreement-template": "legal",
  "inherited-contract-audit": "labor_statutory",
  "policy-harmonisation": "hr_records",
  "employee-data-transfer": "data_privacy",
  "er-case-register": "hr_records",
  "state-law-matrix": "legal",
  "i9-audit": "immigration",
  "termination-approval-memo": "legal",
  "leave-accommodation-log": "hr_records",
  "target-entity-structure": "legal",
  "employment-contract-sample": "labor_statutory",
  "payroll-social-insurance-audit": "payroll",
  "works-council-risk-review": "labor_statutory",
  "province-mapping": "legal",
  "payroll-tax-audit": "payroll",
  "target-contract-set": "labor_statutory",
  "active-er-case-review": "hr_records"
};

const entityLibrary = {
  AU: [
    {
      id: "au-wtg",
      name: "WiseTech Global Australia Pty Ltd",
      origin: "Core entity",
      sourceTeams: ["Australia People Team", "Australia Legal Team"],
      mandatoryRecords: [
        { id: "employment-contract-template", label: "Approved local employment contract template", owner: "Legal", sourceTeam: "Australia Legal Team", status: "complete" },
        { id: "award-classification-register", label: "Award and classification register", owner: "People", sourceTeam: "Australia People Team", status: "complete" },
        { id: "super-payroll-setup", label: "Superannuation and payroll setup evidence", owner: "People", sourceTeam: "Australia People Team", status: "complete" },
        { id: "termination-playbook", label: "Termination and employee relations playbook", owner: "Legal", sourceTeam: "Australia Legal Team", status: "in_progress" }
      ]
    },
    {
      id: "au-acq",
      name: "Blueship Acquisition Australia",
      origin: "Acquired entity",
      sourceTeams: ["Integration People Lead", "M&A Legal Team"],
      mandatoryRecords: [
        { id: "legacy-policy-mapping", label: "Legacy policy mapping to group standard", owner: "People", sourceTeam: "Integration People Lead", status: "in_progress" },
        { id: "delegation-of-authority", label: "Delegation of authority for hiring and termination", owner: "Legal", sourceTeam: "M&A Legal Team", status: "complete" },
        { id: "employee-record-audit", label: "Employee file audit for inherited records", owner: "People", sourceTeam: "Integration People Lead", status: "missing" },
        { id: "payroll-benefits-reconciliation", label: "Payroll and benefits reconciliation", owner: "People", sourceTeam: "Integration People Lead", status: "complete" }
      ]
    }
  ],
  IN: [
    {
      id: "in-wtg",
      name: "WiseTech Global India Pvt Ltd",
      origin: "Core entity",
      sourceTeams: ["India People Team", "India Legal Team"],
      mandatoryRecords: [
        { id: "state-registration-pack", label: "State registration pack", owner: "People", sourceTeam: "India People Team", status: "complete" },
        { id: "appointment-letter-template", label: "Approved appointment letter template", owner: "Legal", sourceTeam: "India Legal Team", status: "complete" },
        { id: "settlement-checklist", label: "Full and final settlement checklist", owner: "People", sourceTeam: "India People Team", status: "in_progress" },
        { id: "disciplinary-procedure", label: "Localized disciplinary procedure", owner: "Legal", sourceTeam: "India Legal Team", status: "missing" }
      ]
    }
  ],
  SG: [
    {
      id: "sg-hub",
      name: "WiseTech Global Singapore Pte Ltd",
      origin: "Regional hub",
      sourceTeams: ["Singapore People Team", "Singapore Legal Team"],
      mandatoryRecords: [
        { id: "contract-template", label: "Approved Singapore contract template", owner: "Legal", sourceTeam: "Singapore Legal Team", status: "complete" },
        { id: "work-pass-tracker", label: "Work pass tracker", owner: "People", sourceTeam: "Singapore People Team", status: "complete" },
        { id: "termination-template", label: "Termination document set", owner: "Legal", sourceTeam: "Singapore Legal Team", status: "complete" },
        { id: "manager-guidance", label: "Manager guidance for performance and exits", owner: "People", sourceTeam: "Singapore People Team", status: "complete" }
      ]
    }
  ],
  UK: [
    {
      id: "uk-wtg",
      name: "WiseTech Global UK Ltd",
      origin: "Core entity",
      sourceTeams: ["UK People Team", "UK Legal Team"],
      mandatoryRecords: [
        { id: "right-to-work-process", label: "Right-to-work process evidence", owner: "People", sourceTeam: "UK People Team", status: "complete" },
        { id: "pension-autoenrolment", label: "Pension auto-enrolment setup", owner: "People", sourceTeam: "UK People Team", status: "complete" },
        { id: "redundancy-playbook", label: "Redundancy and consultation playbook", owner: "Legal", sourceTeam: "UK Legal Team", status: "missing" },
        { id: "settlement-agreement-template", label: "Settlement agreement template", owner: "Legal", sourceTeam: "UK Legal Team", status: "in_progress" }
      ]
    },
    {
      id: "uk-acq",
      name: "ClearChain UK Holdings",
      origin: "Acquired entity",
      sourceTeams: ["UK Integration People Team", "M&A Legal Team"],
      mandatoryRecords: [
        { id: "inherited-contract-audit", label: "Inherited contract audit", owner: "Legal", sourceTeam: "M&A Legal Team", status: "in_progress" },
        { id: "policy-harmonisation", label: "Policy harmonisation tracker", owner: "People", sourceTeam: "UK Integration People Team", status: "missing" },
        { id: "employee-data-transfer", label: "Employee data transfer approvals", owner: "Legal", sourceTeam: "M&A Legal Team", status: "complete" },
        { id: "er-case-register", label: "Employee relations case register", owner: "People", sourceTeam: "UK Integration People Team", status: "complete" }
      ]
    }
  ],
  FR: [
    {
      id: "fr-wtg",
      name: "WiseTech Global France SAS",
      origin: "Core entity",
      sourceTeams: ["France People Team", "France Legal Team"],
      mandatoryRecords: [
        { id: "employment-contract-template-fr", label: "French employment contract template", owner: "Legal", sourceTeam: "France Legal Team", status: "complete", category: "labor_statutory" },
        { id: "working-time-framework-fr", label: "Working time and leave framework", owner: "People", sourceTeam: "France People Team", status: "in_progress", category: "labor_statutory" },
        { id: "social-insurance-setup-fr", label: "Payroll and social insurance setup", owner: "People", sourceTeam: "France People Team", status: "complete", category: "labor_statutory" },
        { id: "consultation-playbook-fr", label: "Consultation and representation playbook", owner: "Legal", sourceTeam: "France Legal Team", status: "missing", category: "legal" }
      ]
    },
    {
      id: "fr-acq",
      name: "ParcelFlow France SAS",
      origin: "Acquired entity",
      sourceTeams: ["France Integration Lead", "M&A Legal Team"],
      mandatoryRecords: [
        { id: "inherited-contract-audit-fr", label: "Inherited French contract audit", owner: "Legal", sourceTeam: "M&A Legal Team", status: "in_progress", category: "labor_statutory" },
        { id: "employee-file-audit-fr", label: "Employee file and record audit", owner: "People", sourceTeam: "France Integration Lead", status: "missing", category: "hr_records" },
        { id: "payroll-reconciliation-fr", label: "Payroll reconciliation", owner: "People", sourceTeam: "France Integration Lead", status: "in_progress", category: "payroll" },
        { id: "data-transfer-review-fr", label: "Employee data transfer review", owner: "Legal", sourceTeam: "M&A Legal Team", status: "complete", category: "data_privacy" }
      ]
    }
  ],
  NL: [
    {
      id: "nl-wtg",
      name: "WiseTech Global Netherlands BV",
      origin: "Core entity",
      sourceTeams: ["Netherlands People Team", "Netherlands Legal Team"],
      mandatoryRecords: [
        { id: "contract-template-nl", label: "Dutch employment contract template", owner: "Legal", sourceTeam: "Netherlands Legal Team", status: "complete", category: "labor_statutory" },
        { id: "payroll-setup-nl", label: "Payroll and social insurance setup", owner: "People", sourceTeam: "Netherlands People Team", status: "complete", category: "payroll" },
        { id: "termination-guidance-nl", label: "Termination guidance and approval path", owner: "Legal", sourceTeam: "Netherlands Legal Team", status: "complete", category: "legal" },
        { id: "employee-file-check-nl", label: "Employee file and acknowledgement check", owner: "People", sourceTeam: "Netherlands People Team", status: "complete", category: "hr_records" }
      ]
    }
  ],
  US: [
    {
      id: "us-wtg",
      name: "WiseTech Global US Inc",
      origin: "Core entity",
      sourceTeams: ["US People Team", "US Legal Team"],
      mandatoryRecords: [
        { id: "state-law-matrix", label: "State law compliance matrix", owner: "Legal", sourceTeam: "US Legal Team", status: "in_progress" },
        { id: "i9-audit", label: "I-9 and work authorization audit", owner: "People", sourceTeam: "US People Team", status: "complete" },
        { id: "termination-approval-memo", label: "Termination approval memo workflow", owner: "Legal", sourceTeam: "US Legal Team", status: "complete" },
        { id: "leave-accommodation-log", label: "Leave and accommodation tracking log", owner: "People", sourceTeam: "US People Team", status: "missing" }
      ]
    }
  ],
  DE: [
    {
      id: "de-targetco",
      name: "Germany TargetCo GmbH",
      origin: "Potential acquisition target",
      sourceTeams: ["Germany Due Diligence Lead", "Germany External Counsel"],
      mandatoryRecords: [
        { id: "target-entity-structure", label: "Target entity structure and workforce map", owner: "Legal", sourceTeam: "Germany External Counsel", status: "in_progress" },
        { id: "employment-contract-sample", label: "Sample target employment contracts and addenda", owner: "Legal", sourceTeam: "Germany External Counsel", status: "missing" },
        { id: "payroll-social-insurance-audit", label: "Payroll and social insurance compliance audit", owner: "People", sourceTeam: "Germany Due Diligence Lead", status: "in_progress" },
        { id: "works-council-risk-review", label: "Works council and consultation risk review", owner: "Legal", sourceTeam: "Germany External Counsel", status: "missing" }
      ]
    }
  ],
  CA: [
    {
      id: "ca-targetco",
      name: "Canada TargetCo Ltd",
      origin: "Potential acquisition target",
      sourceTeams: ["Canada Due Diligence Lead", "Canada External Counsel"],
      mandatoryRecords: [
        { id: "province-mapping", label: "Province-specific compliance mapping", owner: "Legal", sourceTeam: "Canada External Counsel", status: "in_progress" },
        { id: "payroll-tax-audit", label: "Payroll and tax compliance audit", owner: "People", sourceTeam: "Canada Due Diligence Lead", status: "missing" },
        { id: "target-contract-set", label: "Target employment contract set", owner: "Legal", sourceTeam: "Canada External Counsel", status: "missing" },
        { id: "active-er-case-review", label: "Active employee relations case review", owner: "People", sourceTeam: "Canada Due Diligence Lead", status: "in_progress" }
      ]
    }
  ]
};

const defaultAssessmentStore = Object.fromEntries(
  Object.entries(entityLibrary).map(([countryCode, entities]) => [
    countryCode,
    Object.fromEntries(
      entities.map((entity) => [
        entity.id,
        Object.fromEntries(entity.mandatoryRecords.map((record) => [record.id, record.status]))
      ])
    )
  ])
);

const defaultDocumentUploadStore = Object.fromEntries(
  Object.entries(entityLibrary).map(([countryCode, entities]) => [
    countryCode,
    Object.fromEntries(
      entities.map((entity) => [
        entity.id,
        Object.fromEntries(
          Object.entries(complianceCategories).map(([categoryId, category]) => [
            categoryId,
            Object.fromEntries(
              category.requiredDocuments.map((documentLabel, index) => [
                documentLabel,
                entity.origin === "Core entity" && index === 0 ? "uploaded" : "pending"
              ])
            )
          ])
        )
      ])
    )
  ])
);

defaultDocumentUploadStore.AU["au-wtg"]["labor_statutory"]["Approved local contract template"] = "uploaded";
defaultDocumentUploadStore.AU["au-wtg"]["labor_statutory"]["Employee handbook or policy pack"] = "uploaded";
defaultDocumentUploadStore.AU["au-wtg"]["labor_statutory"]["Termination / ER process guide"] = "pending";
defaultDocumentUploadStore.AU["au-wtg"]["labor_statutory"]["Statutory registration certificates"] = "uploaded";
defaultDocumentUploadStore.SG["sg-hub"]["labor_statutory"]["Approved local contract template"] = "uploaded";
defaultDocumentUploadStore.SG["sg-hub"]["labor_statutory"]["Employee handbook or policy pack"] = "uploaded";
defaultDocumentUploadStore.SG["sg-hub"]["labor_statutory"]["Termination / ER process guide"] = "uploaded";
defaultDocumentUploadStore.SG["sg-hub"]["labor_statutory"]["Statutory registration certificates"] = "uploaded";
defaultDocumentUploadStore.SG["sg-hub"]["payroll"]["Payroll registration evidence"] = "uploaded";
defaultDocumentUploadStore.SG["sg-hub"]["payroll"]["Payroll controls matrix"] = "uploaded";
defaultDocumentUploadStore.SG["sg-hub"]["payroll"]["Latest payroll reconciliation sample"] = "uploaded";
defaultDocumentUploadStore.NL["nl-wtg"]["labor_statutory"]["Approved local contract template"] = "uploaded";
defaultDocumentUploadStore.NL["nl-wtg"]["labor_statutory"]["Employee handbook or policy pack"] = "uploaded";
defaultDocumentUploadStore.NL["nl-wtg"]["labor_statutory"]["Termination / ER process guide"] = "uploaded";
defaultDocumentUploadStore.NL["nl-wtg"]["labor_statutory"]["Statutory registration certificates"] = "uploaded";
defaultDocumentUploadStore.NL["nl-wtg"]["legal"]["Delegation of authority matrix"] = "uploaded";
defaultDocumentUploadStore.NL["nl-wtg"]["legal"]["Approved legal templates"] = "uploaded";
defaultDocumentUploadStore.NL["nl-wtg"]["legal"]["Claims / litigation tracker"] = "uploaded";

const defaultMinimumResponseStore = Object.fromEntries(
  Object.entries(entityLibrary).map(([countryCode, entities]) => [
    countryCode,
    Object.fromEntries(
      entities.map((entity) => [
        entity.id,
        Object.fromEntries(
          Object.entries(complianceCategories).map(([categoryId, category]) => [
            categoryId,
            Object.fromEntries(
              category.minimums.map((minimum, index) => [
                minimum,
                entity.origin === "Core entity" && index === 0 ? "complete" : "in_progress"
              ])
            )
          ])
        )
      ])
    )
  ])
);

const defaultCommentStore = Object.fromEntries(
  Object.entries(entityLibrary).map(([countryCode, entities]) => [
    countryCode,
    Object.fromEntries(
      entities.map((entity) => [
        entity.id,
        {
          minimums: Object.fromEntries(
            Object.entries(complianceCategories).flatMap(([categoryId, category]) =>
              category.minimums.map((minimum) => [`${categoryId}::${minimum}`, ""])
            )
          ),
          records: Object.fromEntries(entity.mandatoryRecords.map((record) => [record.id, ""])),
          documents: Object.fromEntries(
            Object.entries(complianceCategories).flatMap(([categoryId, category]) =>
              category.requiredDocuments.map((documentLabel) => [`${categoryId}::${documentLabel}`, ""])
            )
          )
        }
      ])
    )
  ])
);

const defaultProofStore = Object.fromEntries(
  Object.entries(entityLibrary).map(([countryCode, entities]) => [
    countryCode,
    Object.fromEntries(
      entities.map((entity) => [
        entity.id,
        Object.fromEntries(
          Object.entries(complianceCategories).map(([categoryId, category]) => [
            categoryId,
            Object.fromEntries(
              category.requiredDocuments.map((documentLabel) => [
                documentLabel,
                {
                  fileName: defaultDocumentUploadStore[countryCode][entity.id][categoryId][documentLabel] === "uploaded"
                    ? `${documentLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`
                    : "",
                  uploadedBy: "",
                  uploadedAt: "",
                  evidenceNote: ""
                }
              ])
            )
          ])
        )
      ])
    )
  ])
);

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function mergeStores(base, incoming) {
  if (Array.isArray(base) || Array.isArray(incoming) || typeof base !== "object" || base === null) {
    return incoming === undefined ? base : incoming;
  }
  const merged = { ...base };
  Object.keys(incoming || {}).forEach((key) => {
    merged[key] = key in base ? mergeStores(base[key], incoming[key]) : incoming[key];
  });
  return merged;
}

function loadStore(key, defaults) {
  const fallback = clone(defaults);
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return mergeStores(fallback, JSON.parse(raw));
  } catch (error) {
    return fallback;
  }
}

function saveStore(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

const assessmentStore = loadStore(storageKeys.assessment, defaultAssessmentStore);
const documentUploadStore = loadStore(storageKeys.documents, defaultDocumentUploadStore);
const minimumResponseStore = loadStore(storageKeys.minimums, defaultMinimumResponseStore);
const commentStore = loadStore(storageKeys.comments, defaultCommentStore);
const proofStore = loadStore(storageKeys.proofs, defaultProofStore);

Object.values(entityLibrary).forEach((entities) => {
  entities.forEach((entity) => {
    entity.mandatoryRecords.forEach((record) => {
      record.category = record.category || recordCategoryMap[record.id] || "legal";
    });
  });
});

function currentRole() {
  return roles.find((role) => role.id === state.roleId);
}

function currentCapabilities() {
  return currentRole().capabilities;
}

function accessibleCountries(role) {
  const scopedCountries = role.scope.countries.includes("all")
    ? countries
    : countries.filter((country) => role.scope.countries.includes(country.code));

  if (state.footprintFilter === "all") return scopedCountries;
  return scopedCountries.filter((country) => country.operatingStatus === state.footprintFilter);
}

function currentCountry() {
  return accessibleCountries(currentRole()).find((country) => country.code === state.countryCode);
}

function entitiesForCountry(countryCode) {
  return entityLibrary[countryCode] || [];
}

function currentEntity() {
  return entitiesForCountry(state.countryCode).find((entity) => entity.id === state.entityId);
}

function entitySplit(countryCode) {
  const entities = entitiesForCountry(countryCode);
  const core = entities.filter((entity) => entity.origin === "Core entity" || entity.origin === "Regional hub").length;
  const acquired = entities.filter((entity) => entity.origin.toLowerCase().includes("acquired")).length;
  const target = entities.filter((entity) => entity.origin.toLowerCase().includes("target")).length;
  return { total: entities.length, core, acquired, target };
}

function entityAssessment(entity, countryCode = state.countryCode) {
  const categorySummaries = Object.keys(complianceCategories).map((categoryId) => categoryAssessment(entity, categoryId, countryCode));
  const total = categorySummaries.reduce((sum, summary) => sum + summary.totalChecks, 0);
  const complete = categorySummaries.reduce((sum, summary) => sum + summary.completeChecks, 0);
  const inProgress = categorySummaries.reduce((sum, summary) => sum + summary.inProgressChecks, 0);
  const missing = categorySummaries.reduce((sum, summary) => sum + summary.missingChecks, 0);

  let label = "Compliant";
  if (categorySummaries.some((summary) => summary.label === "Gap identified")) {
    label = "Gap identified";
  } else if (categorySummaries.some((summary) => summary.label === "Review in progress")) {
    label = "Review in progress";
  }

  return {
    label,
    total,
    complete,
    inProgress,
    missing,
    percent: total ? Math.round((complete / total) * 100) : 0,
    categorySummaries
  };
}

function categoryAssessment(entity, categoryId, countryCode = state.countryCode) {
  const category = complianceCategories[categoryId];
  const records = entity.mandatoryRecords.filter((record) => record.category === categoryId);
  const statuses = records.map((record) => assessmentStore[countryCode][entity.id][record.id]);
  const minimumResponses = category.minimums.map((minimum) => minimumResponseStore[countryCode][entity.id][categoryId][minimum]);
  const total = records.length;
  const complete = statuses.filter((status) => status === "complete").length;
  const missing = statuses.filter((status) => status === "missing").length;
  const inProgress = statuses.filter((status) => status === "in_progress").length;
  const completeMinimums = minimumResponses.filter((status) => status === "complete").length;
  const missingMinimums = minimumResponses.filter((status) => status === "missing").length;
  const inProgressMinimums = minimumResponses.filter((status) => status === "in_progress").length;
  const documentStatuses = category.requiredDocuments.map((documentLabel) => documentUploadStore[countryCode][entity.id][categoryId][documentLabel]);
  const uploadedDocuments = documentStatuses.filter((status) => status === "uploaded").length;
  const totalChecks = total + category.requiredDocuments.length + category.minimums.length;
  const completeChecks = complete + uploadedDocuments + completeMinimums;
  const missingChecks = missing + (category.requiredDocuments.length - uploadedDocuments) + missingMinimums;
  const inProgressChecks = inProgress + inProgressMinimums;
  const completionPercent = totalChecks ? Math.round((completeChecks / totalChecks) * 100) : 0;
  let label = "Compliant";
  if (missingChecks > 0) label = "Gap identified";
  else if (inProgressChecks > 0) label = "Review in progress";
  return {
    records,
    minimumResponses,
    total,
    complete,
    missing,
    inProgress,
    completeMinimums,
    missingMinimums,
    inProgressMinimums,
    uploadedDocuments,
    totalDocuments: category.requiredDocuments.length,
    totalMinimums: category.minimums.length,
    totalChecks,
    completeChecks,
    missingChecks,
    inProgressChecks,
    completionPercent,
    label
  };
}

function renderHeroDashboard(allowedCountries) {
  const regions = [...new Set(allowedCountries.map((country) => country.region))];
  const allEntities = allowedCountries.flatMap((country) =>
    entitiesForCountry(country.code).map((entity) => ({ country, entity, assessment: entityAssessment(entity, country.code) }))
  );
  const compliantEntities = allEntities.filter((item) => item.assessment.label === "Compliant").length;
  const reviewEntities = allEntities.filter((item) => item.assessment.label === "Review in progress").length;
  const gapEntities = allEntities.filter((item) => item.assessment.label === "Gap identified").length;
  const riskCounts = countryRiskCounts(allowedCountries);

  dashboardTitleNode.textContent = currentRole().type === "global"
    ? "Global workforce compliance oversight"
    : `${currentRole().name} compliance snapshot`;
  dashboardRegionsNode.textContent = String(regions.length);
  dashboardCountriesNode.textContent = String(allowedCountries.length);
  dashboardEntitiesNode.textContent = String(allEntities.length);
  dashboardSummaryNode.innerHTML = `
    <div class="dashboard-pill success">${compliantEntities} compliant</div>
    <div class="dashboard-pill warning">${reviewEntities} in review</div>
    <div class="dashboard-pill danger">${gapEntities} gaps</div>
    <div class="dashboard-pill neutral">${riskCounts.high} high | ${riskCounts.moderate} moderate | ${riskCounts.lower} lower</div>
  `;

  const grouped = regions.map((region) => {
    const regionCountries = allowedCountries.filter((country) => country.region === region);
    const regionEntities = regionCountries.flatMap((country) =>
      entitiesForCountry(country.code).map((entity) => ({ country, assessment: entityAssessment(entity, country.code) }))
    );
    const compliant = regionEntities.filter((item) => item.assessment.label === "Compliant").length;
    const total = regionEntities.length;
    return {
      region,
      countries: regionCountries.length,
      compliant,
      total,
      risks: countryRiskCounts(regionCountries)
    };
  });

  dashboardRegionsListNode.innerHTML = grouped.map((item) => `
    <article class="dashboard-region-card">
      <div>
        <strong>${item.region}</strong>
        <span>${item.countries} countries | ${item.risks.high} high | ${item.risks.moderate} moderate | ${item.risks.lower} lower</span>
      </div>
      <div>
        <strong>${item.compliant}/${item.total}</strong>
        <span>entities compliant</span>
      </div>
    </article>
  `).join("");
}

function headcountBand(country, count) {
  return country.headcountBands.find((band) => count <= band.max) || country.headcountBands.at(-1);
}

function riskLevel(baseRisk, urgency, workerType, thresholdHits) {
  const scoreMap = { low: 1, medium: 2, high: 3 };
  let score = scoreMap[baseRisk] || 2;
  if (urgency === "time-sensitive") score += 1;
  if (urgency === "high-risk") score += 2;
  if (workerType === "senior") score += 1;
  if (workerType === "contractor") score -= 1;
  score += thresholdHits.length;
  if (score >= 5) return "High";
  if (score >= 3) return "Medium";
  return "Low";
}

function decisionSummary(decision) {
  const count = Math.max(Number(headcountInput.value) || 0, 0);
  const workerType = workerTypeSelect.value;
  const urgency = urgencySelect.value;
  const thresholdHits = decision.thresholds.filter((rule) => count >= rule.minHeadcount);
  const requirements = [...decision.requirements];
  const documents = [...decision.documents];
  const process = [...decision.process];
  const support = [...decision.support];

  if (workerType === "contractor") {
    requirements.push("Validate worker-classification risk and confirm contractor documentation is fit for the local market.");
    documents.push("Independent contractor agreement or services agreement");
  }

  if (workerType === "senior") {
    requirements.push("Escalate for executive compensation, board, communication, and restraint considerations.");
    support.push("Senior stakeholder alignment across legal, HR, finance, and communications.");
  }

  if (urgency !== "standard") {
    process.unshift("Run fast-track legal intake and preserve the decision rationale before business communication.");
  }

  thresholdHits.forEach((item) => requirements.push(item.note));

  return {
    count,
    thresholdHits,
    risk: riskLevel(decision.baseRisk, urgency, workerType, thresholdHits),
    requirements,
    documents,
    process,
    support
  };
}

function renderList(items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  const className = ordered ? "process-list" : "result-list";
  return `<${tag} class="${className}">${items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
}

function metricCards(metrics) {
  return `<div class="detail-grid">${metrics.map((metric) => `
    <article class="mini-card">
      <span class="summary-label">${metric.label}</span>
      <strong>${metric.value}</strong>
    </article>
  `).join("")}</div>`;
}

function openGapAnalysisPage() {
  const params = new URLSearchParams({
    role: state.roleId,
    country: state.countryCode,
    entity: state.entityId,
    footprint: state.footprintFilter,
    headcount: headcountInput.value || "0",
    workerType: workerTypeSelect.value,
    urgency: urgencySelect.value,
    notes: notesInput.value || ""
  });
  window.location.href = `compliance-gap-analysis.html?${params.toString()}`;
}

function openAcquisitionReviewPage() {
  const params = new URLSearchParams({
    role: state.roleId,
    country: state.countryCode,
    entity: state.entityId,
    footprint: state.footprintFilter,
    headcount: headcountInput.value || "0",
    workerType: workerTypeSelect.value,
    urgency: urgencySelect.value,
    notes: notesInput.value || ""
  });
  window.location.href = `acquisition-review.html?${params.toString()}`;
}

function generalTab(country) {
  const entity = currentEntity();
  const assessment = entityAssessment(entity);
  return `
    <div class="content-stack">
      <section class="content-panel">
        <h3>Labour Code Overview</h3>
        <p class="muted-copy">${country.labourCode.overview}</p>
        ${metricCards([{ label: "Entity Model", value: country.entityModel }, { label: "Region", value: country.region }, { label: "Entity Status", value: assessment.label }])}
      </section>
      <section class="content-grid">
        <article class="content-panel"><h3>Key Compliance Themes</h3>${renderList(country.labourCode.keyThemes)}</article>
        <article class="content-panel"><h3>Regulators / Authorities</h3>${renderList(country.labourCode.regulators)}</article>
        <article class="content-panel"><h3>Core Documents</h3>${renderList(country.labourCode.coreDocuments)}<p class="muted-copy"><strong>Selected entity:</strong> ${entity.name}</p></article>
      </section>
    </div>`;
}

function laborCodeTab(country) {
  return `
    <div class="content-stack">
      <section class="content-panel">
        <h3>Labor Code Summary</h3>
        <p class="muted-copy">${country.labourCode.overview}</p>
      </section>
      <section class="content-grid">
        <article class="content-panel"><h3>Key Themes</h3>${renderList(country.labourCode.keyThemes)}</article>
        <article class="content-panel"><h3>Primary Authorities</h3>${renderList(country.labourCode.regulators)}</article>
        <article class="content-panel"><h3>Core Compliance Documents</h3>${renderList(country.labourCode.coreDocuments)}</article>
      </section>
    </div>`;
}

function statutoryBenefitsTab(country) {
  const benefits = statutoryBenefitsLibrary[country.code] || ["Country-specific statutory benefit review required"];
  return `
    <div class="content-stack">
      <section class="content-panel">
        <h3>Statutory Benefits</h3>
        <p class="muted-copy">Baseline statutory benefits that should be understood, configured, and validated for ${country.name}.</p>
      </section>
      <section class="content-grid">
        <article class="content-panel"><h3>Benefit Summary</h3>${renderList(benefits)}</article>
        <article class="content-panel"><h3>Entity Checklist</h3>${renderList([
          "Confirm benefit setup in payroll and policies.",
          "Check whether benefits differ by employee type, threshold, or location.",
          "Validate inherited or acquired-entity benefit arrangements against local minimums."
        ])}</article>
      </section>
    </div>`;
}

function entryTab(country) {
  return `
    <div class="content-stack">
      ${metricCards([{ label: "Country Status", value: country.statusLabel }, { label: "Entity Model", value: country.entityModel }, { label: "Region", value: country.region }])}
      <section class="content-panel">
        <h3>Acquisition Review Overview</h3>
        <p class="muted-copy">${country.entitySetup.overview}</p>
        <p class="muted-copy"><strong>Typical timing:</strong> ${country.entitySetup.timeTaken}</p>
      </section>
      <section class="content-grid">
        <article class="content-panel"><h3>Due Diligence Process</h3>${renderList(country.entitySetup.process, true)}</article>
        <article class="content-panel"><h3>Guidelines</h3>${renderList(country.entitySetup.guidelines)}</article>
        <article class="content-panel"><h3>External Support</h3>${renderList(country.entitySetup.support)}</article>
      </section>
    </div>`;
}

function gapAnalysisTab(country) {
  const entity = currentEntity();
  const assessment = entityAssessment(entity);
  const capabilities = currentCapabilities();
  const gapCategoryEntries = Object.entries(complianceCategories);
  if (!gapCategoryEntries.some(([categoryId]) => categoryId === state.gapCategoryId)) {
    state.gapCategoryId = gapCategoryEntries[0][0];
  }
  const activeCategory = complianceCategories[state.gapCategoryId];
  const summary = categoryAssessment(entity, state.gapCategoryId);
  const rows = summary.records.map((record) => {
    const value = assessmentStore[country.code][entity.id][record.id];
    const comment = commentStore[country.code][entity.id].records[record.id];
    return `
      <article class="record-card">
        <div class="record-head">
          <div>
            <h3>${record.label}</h3>
            <p class="muted-copy">Owner: ${record.owner} | Source: ${record.sourceTeam}</p>
          </div>
          <select class="record-select" data-record-id="${record.id}" ${capabilities.review ? "" : "disabled"}>
            <option value="complete" ${value === "complete" ? "selected" : ""}>Complete</option>
            <option value="in_progress" ${value === "in_progress" ? "selected" : ""}>In progress</option>
            <option value="missing" ${value === "missing" ? "selected" : ""}>Missing</option>
          </select>
        </div>
        <textarea class="comment-box" data-comment-scope="record" data-record-id="${record.id}" placeholder="Add review or remediation comment" ${capabilities.comment ? "" : "disabled"}>${comment}</textarea>
      </article>
    `;
  }).join("");

  const documentRows = activeCategory.requiredDocuments.map((documentLabel) => {
    const value = documentUploadStore[country.code][entity.id][state.gapCategoryId][documentLabel];
    const comment = commentStore[country.code][entity.id].documents[`${state.gapCategoryId}::${documentLabel}`];
    return `
      <article class="document-card">
        <div class="record-head">
          <div>
            <h3>${documentLabel}</h3>
            <p class="muted-copy">Required upload for category completion</p>
          </div>
          <select class="record-select" data-category-id="${state.gapCategoryId}" data-document-id="${documentLabel}" ${capabilities.upload ? "" : "disabled"}>
            <option value="uploaded" ${value === "uploaded" ? "selected" : ""}>Uploaded</option>
            <option value="pending" ${value === "pending" ? "selected" : ""}>Pending</option>
          </select>
        </div>
        <textarea class="comment-box" data-comment-scope="document" data-category-id="${state.gapCategoryId}" data-document-id="${documentLabel}" placeholder="Add upload or review comment" ${capabilities.comment ? "" : "disabled"}>${comment}</textarea>
      </article>
    `;
  }).join("");

  const categoryTabs = gapCategoryEntries.map(([categoryId, category]) => {
    const categorySummary = categoryAssessment(entity, categoryId);
    const toneClass = categorySummary.label === "Compliant"
      ? "success"
      : categorySummary.label === "Review in progress"
        ? "warning"
        : "danger";
    const tabText = categorySummary.label === "Compliant"
      ? "100% compliant"
      : `${100 - categorySummary.completionPercent}% gap identified`;
    return `
      <button class="category-tab ${toneClass} ${state.gapCategoryId === categoryId ? "active" : ""}" type="button" data-gap-category="${categoryId}">
        <span>${category.label}</span>
        <strong>${tabText}</strong>
      </button>
    `;
  }).join("");

  return `
    <div class="content-stack">
      ${metricCards([
        { label: "Entity", value: entity.name },
        { label: "Compliance Status", value: assessment.label },
        { label: "Completion", value: `${assessment.percent}%` }
      ])}
      <section class="content-panel">
        <h3>Due Diligence Gap Analysis</h3>
        <p class="muted-copy">${entity.name} is being assessed against mandatory records supplied by ${entity.sourceTeams.join(" and ")}.</p>
        <p class="muted-copy"><strong>Your access:</strong> ${capabilities.review ? "Review" : "View only"} | ${capabilities.upload ? "Upload updates" : "No upload rights"} | ${capabilities.comment ? "Can comment" : "No comment rights"}</p>
        <p class="muted-copy"><strong>Missing:</strong> ${assessment.missing} | <strong>In progress:</strong> ${assessment.inProgress} | <strong>Complete:</strong> ${assessment.complete}</p>
      </section>
      <section class="content-panel">
        <div class="gap-tab-bar">${categoryTabs}</div>
        <div class="category-head">
          <div>
            <h3>${activeCategory.label}</h3>
            <p class="muted-copy"><strong>Status:</strong> ${summary.label} | <strong>Records complete:</strong> ${summary.complete}/${summary.total} | <strong>Documents uploaded:</strong> ${summary.uploadedDocuments}/${summary.totalDocuments}</p>
          </div>
        </div>
        <div class="minimums-block">
          <p class="muted-copy"><strong>Bare minimum requirements</strong></p>
          ${renderList(activeCategory.minimums)}
        </div>
        <div class="content-grid">
          <article class="content-panel">
            <h3>Mandatory Records</h3>
            <div class="record-grid">${rows || `<p class="muted-copy">No records configured in this category yet.</p>`}</div>
          </article>
          <article class="content-panel">
            <h3>Required Uploads</h3>
            <div class="record-grid">${documentRows}</div>
          </article>
        </div>
      </section>
    </div>`;
}

function workflowTab(country, key, title) {
  const summary = decisionSummary(country[key]);
  const thresholdText = summary.thresholdHits.length
    ? summary.thresholdHits.map((item) => item.note).join(" ")
    : "No additional threshold-based trigger is active for the current headcount.";
  const noteText = notesInput.value.trim() ? `Scenario note: \"${notesInput.value.trim()}\".` : "No scenario-specific note captured.";
  const timingText = key === "hiring" ? country.timeTaken.hiring : country.timeTaken.termination;
  const groundsSection = key === "termination"
    ? `<section class="content-panel"><h3>Termination Grounds</h3><div class="content-grid">${country.terminationGrounds.grounds.map((ground) => `<article class="content-panel"><h3>${ground.title}</h3><p class="muted-copy">${ground.notes}</p></article>`).join("")}</div></section>`
    : "";

  return `
    <div class="content-stack">
      ${metricCards([{ label: "Decision Type", value: title }, { label: "Risk Signal", value: summary.risk }, { label: "Headcount", value: String(summary.count) }])}
      <section class="content-grid">
        <article class="content-panel"><h3>Requirements</h3>${renderList(summary.requirements)}</article>
        <article class="content-panel"><h3>Documents</h3>${renderList(summary.documents)}</article>
        <article class="content-panel"><h3>Process</h3>${renderList(summary.process, true)}</article>
        <article class="content-panel"><h3>External Support</h3>${renderList(summary.support)}</article>
      </section>
      <section class="content-panel"><h3>Advisory Notes</h3><p class="muted-copy"><strong>Typical timing:</strong> ${timingText}</p><p class="muted-copy">${thresholdText}</p><p class="muted-copy">${noteText}</p></section>
      ${groundsSection}
    </div>`;
}

function simpleTab(title, items) {
  return `<section class="content-panel"><h3>${title}</h3>${renderList(items)}</section>`;
}

function tabContent(country) {
  if (state.tabId === "general") return generalTab(country);
  if (state.tabId === "labor-code") return laborCodeTab(country);
  if (state.tabId === "statutory-benefits") return statutoryBenefitsTab(country);
  if (state.tabId === "gap") return gapAnalysisTab(country);
  if (state.tabId === "entry") return entryTab(country);
  if (state.tabId === "hiring") return workflowTab(country, "hiring", "Hiring");
  if (state.tabId === "termination") return workflowTab(country, "termination", "Termination");
  if (state.tabId === "visa") return `<div class="content-grid"><article class="content-panel"><h3>Visa Process Requirements</h3>${renderList(country.visa.requirements)}</article><article class="content-panel"><h3>Required Documents</h3>${renderList(country.visa.documents)}<p class="muted-copy"><strong>Typical timing:</strong> ${country.visa.timeTaken}</p></article></div>`;
  if (state.tabId === "mobility") return `<section class="content-panel"><h3>Global Mobility Guidelines</h3>${renderList(country.mobility.guidelines)}<p class="muted-copy"><strong>Typical timing:</strong> ${country.mobility.timeTaken}</p></section>`;
  if (state.tabId === "performance") return `<section class="content-panel"><h3>Performance Management Guidelines</h3>${renderList(country.performance.guidelines)}<p class="muted-copy"><strong>Typical timing:</strong> ${country.performance.timeTaken}</p></section>`;
  return "";
}

function renderEntityOptions(countryCode) {
  const entities = entitiesForCountry(countryCode);
  entitySelect.innerHTML = entities.map((entity) => `<option value="${entity.id}">${entity.name}</option>`).join("");
  entitySelect.value = state.entityId;
}

function renderRoleCard(role, allowedCountries) {
  roleSelect.innerHTML = roles.map((item) => `<option value="${item.id}">${item.name}</option>`).join("");
  roleSelect.value = role.id;
  footprintFilterSelect.value = state.footprintFilter;
  roleNameNode.textContent = role.name;
  roleDescriptionNode.textContent = role.description;
  const regionTags = role.scope.regions.includes("all") ? ["All regions"] : role.scope.regions;
  const countryTags = role.scope.countries.includes("all") ? ["All countries"] : allowedCountries.map((country) => country.name);
  const capabilityTags = [
    role.capabilities.review ? "Can review" : "No review rights",
    role.capabilities.upload ? "Can upload" : "No upload rights",
    role.capabilities.comment ? "Can comment" : "No comment rights"
  ];
  scopeTagsNode.innerHTML = [...regionTags, ...countryTags, ...capabilityTags].map((tag) => `<span class="scope-tag">${tag}</span>`).join("");
}

function renderRegions(allowedCountries) {
  const grouped = allowedCountries.reduce((acc, country) => {
    acc[country.region] ||= [];
    acc[country.region].push(country);
    return acc;
  }, {});
  const regions = Object.keys(grouped).sort();
  if (!regions.includes(state.regionId)) {
    state.regionId = regions[0] || "";
  }
  const activeRegionCountries = grouped[state.regionId] || [];

  regionGridNode.innerHTML = `
    <div class="region-tab-bar">
      ${regions.map((region) => `
        <button class="region-tab ${state.regionId === region ? "active" : ""}" type="button" data-region="${region}">
          <span>${region}</span>
          <strong>${grouped[region].length} countries</strong>
        </button>
      `).join("")}
    </div>
    <article class="region-card">
      <div class="region-head">
        <div>
          <span class="kicker">${state.regionId}</span>
          <h3>${state.regionId} Countries</h3>
          <p class="muted-copy">Termination / restructuring risk: ${countryRiskCounts(activeRegionCountries).high} high | ${countryRiskCounts(activeRegionCountries).moderate} moderate | ${countryRiskCounts(activeRegionCountries).lower} lower</p>
          <p class="muted-copy">Entities: ${activeRegionCountries.reduce((sum, country) => sum + entitySplit(country.code).total, 0)} | Core: ${activeRegionCountries.reduce((sum, country) => sum + entitySplit(country.code).core, 0)} | Acquired: ${activeRegionCountries.reduce((sum, country) => sum + entitySplit(country.code).acquired, 0)} | Targets: ${activeRegionCountries.reduce((sum, country) => sum + entitySplit(country.code).target, 0)}</p>
        </div>
        <span class="region-count">${activeRegionCountries.length}</span>
      </div>
      <div class="country-tab-bar">
        ${activeRegionCountries.map((country) => `
          <button class="country-button ${country.code === state.countryCode ? "active" : ""}" type="button" data-country="${country.code}">
            <strong>${country.name}</strong>
            <span>${country.statusLabel} | ${country.entityModel}</span>
            <span>Entities: ${entitySplit(country.code).total} | Core: ${entitySplit(country.code).core} | Acquired: ${entitySplit(country.code).acquired} | Targets: ${entitySplit(country.code).target}</span>
            <span class="risk-flag">${countryRiskLabel(country)}</span>
          </button>
        `).join("")}
      </div>
    </article>
  `;

  regionGridNode.querySelectorAll("[data-region]").forEach((button) => {
    button.addEventListener("click", () => {
      state.regionId = button.dataset.region;
      const nextCountry = grouped[state.regionId]?.[0];
      if (nextCountry) state.countryCode = nextCountry.code;
      render();
    });
  });

  regionGridNode.querySelectorAll("[data-country]").forEach((button) => {
    button.addEventListener("click", () => {
      state.countryCode = button.dataset.country;
      render();
    });
  });
}

function renderTabs() {
  const groupedTabs = tabs.reduce((acc, tab) => {
    if (tab.id === "gap" || tab.id === "entry" || tab.group === "Standalone") return acc;
    acc[tab.group] ||= [];
    acc[tab.group].push(tab);
    return acc;
  }, {});
  tabBarNode.innerHTML = `
    <div class="tab-groups">
      ${Object.entries(groupedTabs).map(([group, groupTabs]) => `
    <div class="tab-group">
      <span class="tab-group-label">${group}</span>
      <div class="tab-group-buttons">
        ${groupTabs.map((tab) => `<button class="tab-button ${tab.id === state.tabId ? "active" : ""}" type="button" data-tab="${tab.id}">${tab.label}</button>`).join("")}
      </div>
    </div>
      `).join("")}
    </div>
  `;
  tabBarNode.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tabId = button.dataset.tab;
      render();
    });
  });
}

function renderWorkspace(country) {
  const hiring = decisionSummary(country.hiring);
  const termination = decisionSummary(country.termination);
  const entity = currentEntity();
  const assessment = entityAssessment(entity);
  countryNameNode.textContent = country.name;
  countryMetaNode.textContent = `${country.entityModel} | ${countryRiskLabel(country)} | ${country.complexityReason}`;
  countryRegionNode.textContent = country.region;
  countryStatusNode.textContent = country.statusLabel;
  entityStatusNode.textContent = assessment.label;
  headcountBandNode.textContent = headcountBand(country, Math.max(Number(headcountInput.value) || 0, 0)).label;
  supportSignalNode.textContent = hiring.risk === "High" || termination.risk === "High" ? "Specialist review needed" : "Standard support";
  gapShortcutButton.classList.remove("active");
  acquisitionShortcutButton.classList.remove("active");
  tabContentNode.innerHTML = tabContent(country);

  tabContentNode.querySelectorAll("[data-record-id]").forEach((select) => {
    select.addEventListener("input", (event) => {
      assessmentStore[country.code][entity.id][event.target.dataset.recordId] = event.target.value;
      saveStore(storageKeys.assessment, assessmentStore);
      render();
    });
  });

  tabContentNode.querySelectorAll("[data-document-id]").forEach((select) => {
    select.addEventListener("input", (event) => {
      const { categoryId, documentId } = event.target.dataset;
      documentUploadStore[country.code][entity.id][categoryId][documentId] = event.target.value;
      if (event.target.value !== "uploaded") {
        proofStore[country.code][entity.id][categoryId][documentId].fileName = "";
        proofStore[country.code][entity.id][categoryId][documentId].uploadedAt = "";
      }
      saveStore(storageKeys.documents, documentUploadStore);
      saveStore(storageKeys.proofs, proofStore);
      render();
    });
  });

  tabContentNode.querySelectorAll("[data-gap-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.gapCategoryId = button.dataset.gapCategory;
      render();
    });
  });

  tabContentNode.querySelectorAll("[data-comment-scope='record']").forEach((input) => {
    input.addEventListener("input", (event) => {
      commentStore[country.code][entity.id].records[event.target.dataset.recordId] = event.target.value;
      saveStore(storageKeys.comments, commentStore);
    });
  });

  tabContentNode.querySelectorAll("[data-comment-scope='document']").forEach((input) => {
    input.addEventListener("input", (event) => {
      const key = `${event.target.dataset.categoryId}::${event.target.dataset.documentId}`;
      commentStore[country.code][entity.id].documents[key] = event.target.value;
      saveStore(storageKeys.comments, commentStore);
    });
  });
}

function render() {
  const role = currentRole();
  const allowedCountries = accessibleCountries(role);
  if (state.tabId === "gap") state.tabId = "general";
  renderHeroDashboard(allowedCountries);
  if (!allowedCountries.length) {
    regionGridNode.innerHTML = `<article class="content-panel"><h3>No Countries In View</h3><p class="muted-copy">This role does not have any countries in the selected footprint filter.</p></article>`;
    tabBarNode.innerHTML = "";
    entitySelect.innerHTML = "";
    countryNameNode.textContent = "-";
    countryMetaNode.textContent = "Adjust the role or footprint filter to continue.";
    countryRegionNode.textContent = "-";
    countryStatusNode.textContent = "-";
    entityStatusNode.textContent = "-";
    headcountBandNode.textContent = "-";
    supportSignalNode.textContent = "-";
    tabContentNode.innerHTML = "";
    renderRoleCard(role, allowedCountries);
    return;
  }
  if (!allowedCountries.some((country) => country.code === state.countryCode)) state.countryCode = allowedCountries[0].code;
  const countryEntities = entitiesForCountry(state.countryCode);
  if (!countryEntities.some((entity) => entity.id === state.entityId)) state.entityId = countryEntities[0].id;
  const country = currentCountry();
  renderRoleCard(role, allowedCountries);
  renderEntityOptions(country.code);
  renderRegions(allowedCountries);
  renderTabs();
  renderWorkspace(country);
}

roleSelect.addEventListener("input", () => {
  state.roleId = roleSelect.value;
  state.tabId = "general";
  render();
});

footprintFilterSelect.addEventListener("input", () => {
  state.footprintFilter = footprintFilterSelect.value;
  state.tabId = "general";
  render();
});

gapShortcutButton.addEventListener("click", () => {
  openGapAnalysisPage();
});

acquisitionShortcutButton.addEventListener("click", () => {
  openAcquisitionReviewPage();
});

openToolSummaryButton.addEventListener("click", () => {
  setToolSummaryOpen(true);
});

closeToolSummaryButton.addEventListener("click", () => {
  setToolSummaryOpen(false);
});

toolSummaryBackdrop.addEventListener("click", () => {
  setToolSummaryOpen(false);
});

entitySelect.addEventListener("input", () => {
  state.entityId = entitySelect.value;
  render();
});

[headcountInput, workerTypeSelect, urgencySelect, notesInput].forEach((element) => {
  element.addEventListener("input", render);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setToolSummaryOpen(false);
  }
});

render();
