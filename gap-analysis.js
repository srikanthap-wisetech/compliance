const roleSelect = document.getElementById("assessment-role");
const countrySelect = document.getElementById("assessment-country");
const entitySelect = document.getElementById("assessment-entity");
const headcountInput = document.getElementById("assessment-headcount");
const workerTypeSelect = document.getElementById("assessment-worker-type");
const urgencySelect = document.getElementById("assessment-urgency");
const notesInput = document.getElementById("assessment-notes");
const permissionRoleNameNode = document.getElementById("permission-role-name");
const permissionSummaryNode = document.getElementById("permission-summary");
const permissionTagsNode = document.getElementById("permission-tags");
const requirementTabsNode = document.getElementById("requirement-source-tabs");
const requirementContentNode = document.getElementById("requirement-source-content");
const categoryTabsNode = document.getElementById("gap-category-tabs");
const categoryContentNode = document.getElementById("gap-category-content");
const assessmentDashboardTitleNode = document.getElementById("assessment-dashboard-title");
const assessmentDashboardSummaryNode = document.getElementById("assessment-dashboard-summary");
const assessmentDashboardListNode = document.getElementById("assessment-dashboard-list");

const { roles, countries } = window.complianceData;
const query = new URLSearchParams(window.location.search);
const state = {
  roleId: query.get("role") || roles[0].id,
  countryCode: query.get("country") || countries[0].code,
  entityId: query.get("entity") || "",
  headcount: Number(query.get("headcount") || 45),
  workerType: query.get("workerType") || "employee",
  urgency: query.get("urgency") || "standard",
  notes: query.get("notes") || "",
  sourceTabId: "general",
  categoryId: "labor_statutory"
};
const storageKeys = {
  assessment: "gwct-assessment-store-v3",
  documents: "gwct-document-store-v3",
  minimums: "gwct-minimum-store-v3",
  comments: "gwct-comment-store-v3",
  proofs: "gwct-proof-store-v3"
};

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
  return roles.find((role) => role.id === state.roleId) || roles[0];
}

function currentCapabilities() {
  return currentRole().capabilities;
}

function accessibleCountries(role) {
  return role.scope.countries.includes("all")
    ? countries
    : countries.filter((country) => role.scope.countries.includes(country.code));
}

function entitiesForCountry(countryCode) {
  return entityLibrary[countryCode] || [];
}

function currentCountry() {
  return countries.find((country) => country.code === state.countryCode) || countries[0];
}

function currentEntity() {
  return entitiesForCountry(state.countryCode).find((entity) => entity.id === state.entityId) || entitiesForCountry(state.countryCode)[0];
}

function syncState() {
  const allowed = accessibleCountries(currentRole());
  if (!allowed.some((country) => country.code === state.countryCode)) {
    state.countryCode = allowed[0]?.code || countries[0].code;
  }
  const entities = entitiesForCountry(state.countryCode);
  if (!entities.some((entity) => entity.id === state.entityId)) {
    state.entityId = entities[0]?.id || "";
  }
  if (!Object.keys(complianceCategories).includes(state.categoryId)) {
    state.categoryId = Object.keys(complianceCategories)[0];
  }
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
  const count = Math.max(Number(state.headcount) || 0, 0);
  const thresholdHits = decision.thresholds.filter((rule) => count >= rule.minHeadcount);
  const requirements = [...decision.requirements];
  const documents = [...decision.documents];
  const process = [...decision.process];
  const support = [...decision.support];

  if (state.workerType === "contractor") {
    requirements.push("Validate worker-classification risk and confirm contractor documentation is fit for the local market.");
    documents.push("Independent contractor agreement or services agreement");
  }

  if (state.workerType === "senior") {
    requirements.push("Escalate for executive compensation, board, communication, and restraint considerations.");
    support.push("Senior stakeholder alignment across legal, HR, finance, and communications.");
  }

  if (state.urgency !== "standard") {
    process.unshift("Run fast-track legal intake and preserve the decision rationale before business communication.");
  }

  thresholdHits.forEach((item) => requirements.push(item.note));

  return {
    count,
    requirements,
    documents,
    process,
    support,
    thresholdHits,
    risk: riskLevel(decision.baseRisk, state.urgency, state.workerType, thresholdHits)
  };
}

function categoryAssessment(entity, categoryId, countryCode = state.countryCode) {
  const category = complianceCategories[categoryId];
  const records = entity.mandatoryRecords.filter((record) => record.category === categoryId);
  const recordStatuses = records.map((record) => assessmentStore[countryCode][entity.id][record.id]);
  const minimumStatuses = category.minimums.map((minimum) => minimumResponseStore[countryCode][entity.id][categoryId][minimum]);
  const documentStatuses = category.requiredDocuments.map((documentLabel) => documentUploadStore[countryCode][entity.id][categoryId][documentLabel]);
  const completeRecords = recordStatuses.filter((status) => status === "complete").length;
  const inProgressRecords = recordStatuses.filter((status) => status === "in_progress").length;
  const missingRecords = recordStatuses.filter((status) => status === "missing").length;
  const completeMinimums = minimumStatuses.filter((status) => status === "complete").length;
  const inProgressMinimums = minimumStatuses.filter((status) => status === "in_progress").length;
  const missingMinimums = minimumStatuses.filter((status) => status === "missing").length;
  const uploadedDocuments = documentStatuses.filter((status) => status === "uploaded").length;
  const totalChecks = records.length + category.minimums.length + category.requiredDocuments.length;
  const completeChecks = completeRecords + completeMinimums + uploadedDocuments;
  const missingChecks = missingRecords + missingMinimums + (category.requiredDocuments.length - uploadedDocuments);
  const inProgressChecks = inProgressRecords + inProgressMinimums;
  const completionPercent = totalChecks ? Math.round((completeChecks / totalChecks) * 100) : 0;
  let label = "Compliant";
  if (missingChecks > 0) label = "Gap identified";
  else if (inProgressChecks > 0) label = "Review in progress";
  return {
    records,
    label,
    completionPercent,
    completeChecks,
    missingChecks,
    inProgressChecks,
    uploadedDocuments,
    totalDocuments: category.requiredDocuments.length,
    totalMinimums: category.minimums.length
  };
}

function entityAssessment(entity, countryCode = state.countryCode) {
  const categorySummaries = Object.keys(complianceCategories).map((categoryId) => categoryAssessment(entity, categoryId, countryCode));
  const totalChecks = categorySummaries.reduce((sum, summary) => sum + summary.completeChecks + summary.missingChecks + summary.inProgressChecks, 0);
  const completeChecks = categorySummaries.reduce((sum, summary) => sum + summary.completeChecks, 0);
  let label = "Compliant";
  if (categorySummaries.some((summary) => summary.label === "Gap identified")) label = "Gap identified";
  else if (categorySummaries.some((summary) => summary.label === "Review in progress")) label = "Review in progress";
  return {
    label,
    percent: totalChecks ? Math.round((completeChecks / totalChecks) * 100) : 0,
    categorySummaries
  };
}

function countryAssessment(countryCode) {
  const entities = entitiesForCountry(countryCode);
  const entitySummaries = entities.map((entity) => entityAssessment(entity, countryCode));
  const percent = entitySummaries.length
    ? Math.round(entitySummaries.reduce((sum, summary) => sum + summary.percent, 0) / entitySummaries.length)
    : 0;
  let label = "Compliant";
  if (entitySummaries.some((summary) => summary.label === "Gap identified")) label = "Gap identified";
  else if (entitySummaries.some((summary) => summary.label === "Review in progress")) label = "Review in progress";
  return {
    label,
    percent,
    entityCount: entities.length
  };
}

function regionAssessment(regionName, countriesInRegion) {
  const countrySummaries = countriesInRegion.map((country) => ({
    country,
    summary: countryAssessment(country.code)
  }));
  let label = "Compliant";
  if (countrySummaries.some((item) => item.summary.label === "Gap identified")) label = "Gap identified";
  else if (countrySummaries.some((item) => item.summary.label === "Review in progress")) label = "Review in progress";
  return {
    region: regionName,
    label,
    countryCount: countriesInRegion.length,
    compliantCount: countrySummaries.filter((item) => item.summary.label === "Compliant").length,
    reviewCount: countrySummaries.filter((item) => item.summary.label === "Review in progress").length,
    gapCount: countrySummaries.filter((item) => item.summary.label === "Gap identified").length
  };
}

function renderList(items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  const className = ordered ? "process-list" : "result-list";
  return `<${tag} class="${className}">${items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
}

function requirementSections(country) {
  const hiring = decisionSummary(country.hiring);
  const termination = decisionSummary(country.termination);
  const sections = [
    {
      id: "general",
      label: "General",
      title: "General Country Compliance Context",
      summary: country.labourCode.overview,
      bullets: country.labourCode.keyThemes,
      secondaryTitle: "Regulators / authorities",
      secondaryItems: country.labourCode.regulators,
      tertiaryTitle: "Core compliance documents",
      tertiaryItems: country.labourCode.coreDocuments
    },
    {
      id: "labor-code",
      label: "Labor Code",
      title: "Labor Code Summary",
      summary: country.labourCode.overview,
      bullets: country.labourCode.keyThemes,
      secondaryTitle: "Core documents",
      secondaryItems: country.labourCode.coreDocuments,
      tertiaryTitle: "Country risk posture",
      tertiaryItems: [country.highRisk ? "High-risk jurisdiction requiring tighter review" : "Standard risk jurisdiction", country.statusLabel, country.entityModel]
    },
    {
      id: "benefits",
      label: "Benefits",
      title: "Statutory Benefits",
      summary: `Baseline statutory benefits that should be understood and validated for ${country.name}.`,
      bullets: statutoryBenefitsLibrary[country.code] || ["Country-specific statutory benefit review required"],
      secondaryTitle: "Entity checks",
      secondaryItems: [
        "Confirm benefit setup in payroll and policies.",
        "Check whether benefits differ by employee type, threshold, or location.",
        "Validate inherited or acquired-entity benefit arrangements against local minimums."
      ],
      tertiaryTitle: "Evidence expected",
      tertiaryItems: ["Payroll setup evidence", "Benefit policy references", "Vendor or fund registration confirmations"]
    },
    {
      id: "hiring",
      label: "Hiring",
      title: "Hiring Requirements",
      summary: `Risk signal: ${hiring.risk}. Threshold triggers: ${hiring.thresholdHits.length ? hiring.thresholdHits.map((item) => item.note).join(" ") : "No additional headcount trigger for the current scenario."}`,
      bullets: hiring.requirements,
      secondaryTitle: "Required documents",
      secondaryItems: hiring.documents,
      tertiaryTitle: "Process",
      tertiaryItems: hiring.process,
      timing: country.timeTaken.hiring
    },
    {
      id: "termination",
      label: "Termination",
      title: "Termination Requirements",
      summary: `Risk signal: ${termination.risk}. Scenario note: ${state.notes.trim() || "No scenario note captured."}`,
      bullets: termination.requirements,
      secondaryTitle: "Required documents",
      secondaryItems: termination.documents,
      tertiaryTitle: "Termination grounds",
      tertiaryItems: country.terminationGrounds.grounds.map((ground) => `${ground.title}: ${ground.notes}`),
      timing: country.timeTaken.termination
    },
    {
      id: "visa",
      label: "Visa",
      title: "Visa Process Requirements",
      summary: country.visa.timeTaken,
      bullets: country.visa.requirements,
      secondaryTitle: "Required documents",
      secondaryItems: country.visa.documents,
      tertiaryTitle: "Why it matters",
      tertiaryItems: ["Immigration gaps can delay hiring and mobility timing.", "Sponsored populations need tracked obligations, expiries, and approvals."]
    },
    {
      id: "mobility",
      label: "Mobility",
      title: "Global Mobility Guidelines",
      summary: country.mobility.timeTaken,
      bullets: country.mobility.guidelines,
      secondaryTitle: "Assessment cues",
      secondaryItems: ["Check tax, payroll, immigration, and benefits alignment.", "Review host-entity, payroll, and sponsorship decisions before approval."],
      tertiaryTitle: "Documents often needed",
      tertiaryItems: ["Mobility approvals log", "Assignment letter", "Tax and payroll review summary"]
    },
    {
      id: "performance",
      label: "Performance",
      title: "Performance Management Guidelines",
      summary: country.performance.timeTaken,
      bullets: country.performance.guidelines,
      secondaryTitle: "Evidence expected",
      secondaryItems: ["Objectives and review notes", "Support offered and checkpoints", "Escalation trail before termination action"],
      tertiaryTitle: "Country reminders",
      tertiaryItems: ["Manager training matters", "Documentation quality drives defensibility"]
    }
  ];

  return sections;
}

function toneClass(label) {
  if (label === "Compliant") return "success";
  if (label === "Review in progress") return "warning";
  return "danger";
}

const sectionDetailLibrary = {
  general: [
    {
      title: "Employing entity and local registrations",
      detail: "Confirm the employing entity is correctly set up for the workforce footprint in that country and that the core labour, tax, and payroll registrations are complete for each operating location.",
      proof: ["Entity registration extract", "Local registration tracker", "Country People or Legal sign-off"]
    },
    {
      title: "Employee records and mandatory notices",
      detail: "Validate that the entity can keep the mandatory employee records, statutory notices, and onboarding documentation expected by the local labour framework.",
      proof: ["Employee file checklist", "Record retention matrix", "Notice or poster register"]
    },
    {
      title: "Benefits, payroll, and social contributions",
      detail: "Check whether statutory benefits, contributions, insurance, or fund registrations are fully aligned to the local workforce model and employee categories.",
      proof: ["Payroll setup evidence", "Benefits configuration summary", "Contribution or insurance registration evidence"]
    }
  ],
  "labor-code": [
    {
      title: "Core labour rules that drive compliance",
      detail: "This section should explain the practical labour code themes that affect hiring, working time, leave, employee relations, and termination decisions in-country.",
      proof: ["Local legal summary", "Policy crosswalk", "Country compliance guidance note"]
    },
    {
      title: "Required local templates and process documents",
      detail: "The entity should hold localized contracts, handbook content, process guides, and escalation paths rather than relying on global-only templates.",
      proof: ["Approved template pack", "Localized handbook references", "Escalation or approval workflow"]
    }
  ],
  benefits: [
    {
      title: "Minimum statutory benefits",
      detail: "Identify the minimum leave, insurance, pension, provident-fund, holiday, or sick-pay obligations that the entity must provide by law or local mandatory scheme.",
      proof: ["Benefit policy schedule", "Payroll deduction setup", "Scheme enrollment evidence"]
    },
    {
      title: "Entity-level benefit readiness",
      detail: "Confirm that statutory benefits are not only referenced in policy but also configured operationally in payroll, onboarding, and employee communications.",
      proof: ["Payroll screenshots", "Vendor enrollment files", "Employee communication sample"]
    }
  ],
  hiring: [
    {
      title: "Pre-hire compliance gate",
      detail: "Before an offer is approved, confirm the employing entity, contract model, payroll readiness, worker classification, and any local registration or quota dependency.",
      proof: ["Hiring approval workflow", "Offer checklist", "Payroll or registration readiness sign-off"]
    },
    {
      title: "Contract and onboarding package",
      detail: "The offer and onboarding documents should reflect local terms, mandatory clauses, benefits, policies, and identity or work authorization checks for that country.",
      proof: ["Signed contract sample", "Onboarding checklist", "Identity or right-to-work evidence"]
    }
  ],
  termination: [
    {
      title: "Termination basis and process",
      detail: "The entity should be able to explain which termination routes are legally available, what evidence is needed, and which approvals or consultation steps apply.",
      proof: ["Termination playbook", "Case chronology", "Approval and legal review trail"]
    },
    {
      title: "Final pay and exit controls",
      detail: "Validate local notice, severance, settlement, final pay timing, benefits cessation, and record-retention obligations before an exit is finalized.",
      proof: ["Final pay checklist", "Severance or notice calculation", "Exit checklist"]
    }
  ],
  visa: [
    {
      title: "Work authorization readiness",
      detail: "Confirm whether the entity can lawfully hire or transfer workers through the available immigration routes and whether sponsorship or quota controls apply.",
      proof: ["Visa or work authorization tracker", "Immigration provider note", "Sponsorship approval trail"]
    }
  ],
  mobility: [
    {
      title: "Cross-border employment impact",
      detail: "Mobility reviews should connect immigration, payroll, tax, social security, and host-entity responsibilities rather than treating them as separate decisions.",
      proof: ["Mobility assessment memo", "Tax and payroll review summary", "Assignment approval pack"]
    }
  ],
  performance: [
    {
      title: "Documented performance framework",
      detail: "Managers should have a local process that records expectations, coaching, checkpoints, and escalation before a performance matter becomes a termination case.",
      proof: ["Performance plan template", "Manager guidance note", "Review note sample"]
    }
  ]
};

const countryDetailOverrides = {
  AU: {
    general: [
      {
        title: "Fair Work records and payslips",
        detail: "Check that the entity can keep employee, time, wage, and leave records in the format expected under Fair Work rules and issue compliant payslips.",
        proof: ["Employee and wage record template", "Payslip sample", "Record-retention control"]
      },
      {
        title: "Superannuation and payroll registrations",
        detail: "Confirm superannuation setup, fund-choice handling, and payroll processes are aligned to the employing entity and current worker population.",
        proof: ["Super fund registration evidence", "STP or payroll setup confirmation", "Super contribution workflow"]
      },
      {
        title: "Award or classification mapping",
        detail: "Where relevant, the entity should be able to show how roles are classified, how leave and hours are handled, and how employee-relations issues are escalated.",
        proof: ["Award review tracker", "Classification matrix", "ER escalation guide"]
      }
    ]
  },
  IN: {
    general: [
      {
        title: "State Shops and Establishments or local registration",
        detail: "Validate the state-specific establishment registration or labour registration required for each office or employing location. In India this often differs by state and branch footprint.",
        proof: ["State registration certificate or acknowledgement", "State-wise entity tracker", "Office-location mapping"]
      },
      {
        title: "EPFO and ESIC registrations",
        detail: "Check whether provident fund and employee state insurance registrations are required based on headcount, wages, and employee profile, and confirm deduction controls are active where applicable.",
        proof: ["EPFO registration evidence", "ESIC registration evidence", "Payroll deduction setup or applicability memo"]
      },
      {
        title: "Professional tax, labour welfare fund, and local notices",
        detail: "Confirm whether state-specific professional tax, labour welfare fund, standing orders, or mandatory notice obligations apply to the entity and current workforce.",
        proof: ["Professional tax registration", "State compliance tracker", "Notice display or local filing evidence"]
      }
    ],
    hiring: [
      {
        title: "State-ready hiring pack",
        detail: "Each hire should be checked for the right state entity setup, appointment-letter language, statutory deductions, and any location-specific registration dependency before joining.",
        proof: ["Appointment-letter template", "State onboarding checklist", "PF or insurance setup confirmation"]
      }
    ],
    termination: [
      {
        title: "Separation route and settlement readiness",
        detail: "India terminations often depend on employee category, state practice, gratuity exposure, and full-and-final settlement timing, so the route should be documented before action.",
        proof: ["Full-and-final settlement checklist", "Gratuity assessment", "Termination approval record"]
      }
    ]
  },
  SG: {
    general: [
      {
        title: "Key employment terms and itemised payslips",
        detail: "Confirm the entity can issue the required employment terms and maintain payroll records and itemised payslips expected for local employees.",
        proof: ["Key employment terms template", "Payslip sample", "Payroll record checklist"]
      },
      {
        title: "CPF and employee-status setup",
        detail: "Check CPF handling for eligible employees and ensure the entity can distinguish local employees, pass holders, and other worker categories correctly.",
        proof: ["CPF setup confirmation", "Payroll configuration summary", "Worker-category matrix"]
      },
      {
        title: "Work pass and MOM process readiness",
        detail: "For sponsored populations, maintain a tracked pass process, expiry management, and internal approval route before employment or mobility decisions are finalized.",
        proof: ["Work pass tracker", "MOM filing log", "Immigration approval workflow"]
      }
    ]
  },
  UK: {
    general: [
      {
        title: "Right-to-work and onboarding evidence",
        detail: "Confirm the entity can complete compliant right-to-work checks and retain the evidence before employment starts.",
        proof: ["Right-to-work checklist", "Check evidence sample", "Onboarding approval log"]
      },
      {
        title: "PAYE and RTI payroll readiness",
        detail: "The employing entity should be ready to operate payroll through PAYE, keep pay records, and run Real Time Information submissions on schedule.",
        proof: ["PAYE setup evidence", "Payroll calendar", "RTI filing control"]
      },
      {
        title: "Pension auto-enrolment and statutory terms",
        detail: "Validate auto-enrolment handling and ensure contracts and employee terms reflect holiday, sick pay, and other local statutory entitlements.",
        proof: ["Pension provider setup", "Auto-enrolment assessment file", "Contract template pack"]
      }
    ]
  },
  FR: {
    general: [
      {
        title: "Pre-hire declaration and social registration",
        detail: "Confirm the entity can complete the DPAE process and maintain the employment-start formalities expected before the employee begins work.",
        proof: ["DPAE submission sample", "URSSAF registration evidence", "Pre-hire formalities checklist"]
      },
      {
        title: "Personnel register and employee records",
        detail: "The entity should maintain the registre unique du personnel and the employment records needed for inspections and employee lifecycle changes.",
        proof: ["Personnel register extract", "Employee file checklist", "Inspection-readiness note"]
      },
      {
        title: "Payroll, social declarations, and health-service links",
        detail: "Validate that payroll and social-insurance processes are operational and that occupational-health or onboarding health requirements are built into the process.",
        proof: ["Payroll declaration process note", "Social-insurance setup evidence", "Occupational-health provider setup"]
      }
    ]
  },
  NL: {
    general: [
      {
        title: "Payroll tax and wage-heffings setup",
        detail: "Confirm the entity is ready to operate loonheffingen and maintain the payroll-tax records required for the Dutch employing model.",
        proof: ["Payroll tax registration", "Wage-tax process note", "Payroll provider setup"]
      },
      {
        title: "Contract, ID, and right-to-work records",
        detail: "Check that the employee file includes the employment agreement, identity evidence, and any work authorization records required for local compliance.",
        proof: ["Contract template", "ID verification checklist", "Employee file sample"]
      },
      {
        title: "Absence, pension, and working-conditions processes",
        detail: "Where applicable, confirm absence-management, pension participation, and occupational-health arrangements are embedded in the local process.",
        proof: ["Absence process guide", "Pension setup evidence", "Arbo provider or process note"]
      }
    ]
  },
  US: {
    general: [
      {
        title: "Federal and state employer registrations",
        detail: "Confirm the entity has the federal and state registrations needed for payroll, unemployment, and local employment operations in each hiring state.",
        proof: ["EIN confirmation", "State unemployment registration", "State setup tracker"]
      },
      {
        title: "I-9 and work authorization process",
        detail: "The entity should be able to complete Form I-9 on time, retain supporting records, and manage E-Verify or state verification steps where used.",
        proof: ["I-9 process guide", "I-9 audit checklist", "E-Verify workflow if applicable"]
      },
      {
        title: "State wage notices, leave, and workers compensation",
        detail: "Check that state-specific wage notices, leave policies, pay timing, and workers-compensation coverage are reflected in local onboarding and recordkeeping.",
        proof: ["State notice pack", "Leave policy matrix", "Workers compensation evidence"]
      }
    ]
  },
  DE: {
    general: [
      {
        title: "Payroll tax and social-security registration",
        detail: "For Germany, confirm the employing structure can support payroll tax, social-security registration, and the employee onboarding records required for a local employer.",
        proof: ["Social-security registration evidence", "Payroll setup memo", "Employee onboarding checklist"]
      },
      {
        title: "Employment terms, working time, and documentation",
        detail: "Check that local employment terms, working-time records, and employee file documentation are in place before operational activity begins or transfers post-close.",
        proof: ["Local contract sample", "Working-time recording process", "Employee file checklist"]
      },
      {
        title: "Works council or consultation exposure",
        detail: "Where relevant, identify whether employee representation or consultation rights affect workforce changes, integration steps, or inherited case management.",
        proof: ["Works council risk memo", "Consultation map", "Counsel advice note"]
      }
    ]
  },
  CA: {
    general: [
      {
        title: "CRA payroll account and provincial setup",
        detail: "Confirm the entity has payroll account readiness and the province-specific registrations or insurance arrangements needed for the employing footprint.",
        proof: ["CRA payroll account evidence", "Provincial registration tracker", "Workers compensation or insurance setup"]
      },
      {
        title: "Province-specific employment standards controls",
        detail: "Check that contracts, leave, vacation, holiday, and termination practices are mapped to the right province rather than treated as one national standard.",
        proof: ["Province matrix", "Contract template pack", "Leave and vacation setup note"]
      },
      {
        title: "Employee records and pay statement readiness",
        detail: "The entity should maintain employee-file, payroll, and pay-statement records in the format needed for provincial compliance and audit response.",
        proof: ["Employee file checklist", "Pay statement sample", "Payroll record retention note"]
      }
    ]
  }
};

const minimumRequirementGuidance = {
  labor_statutory: [
    {
      detail: "This asks whether local contract terms, handbook content, and mandatory labour-facing documents have been reviewed and approved for the entity rather than borrowed from another country.",
      proof: ["Approved local template pack", "Legal review note", "Template version tracker"]
    },
    {
      detail: "This covers the operating rules managers rely on in practice, including hiring approvals, employee relations, performance handling, leave, and termination governance.",
      proof: ["Manager process guide", "ER playbook", "Policy acknowledgement record"]
    },
    {
      detail: "This checks whether the entity has mapped the local statutory obligations that affect day-to-day employment operations, including registrations and workforce classification.",
      proof: ["Country obligations tracker", "Registration matrix", "Local legal summary"]
    }
  ],
  payroll: [
    {
      detail: "This requirement is about core payroll readiness for the entity, including registrations, pay calendar, and the ability to process the local worker population correctly.",
      proof: ["Payroll setup approval", "Payroll provider confirmation", "Entity payroll calendar"]
    },
    {
      detail: "This validates whether mandatory deductions, benefit elements, and approval checkpoints are actually configured in the payroll process.",
      proof: ["Deduction setup sheet", "Payroll controls matrix", "Test payroll output"]
    },
    {
      detail: "This focuses on ongoing payroll control: reconciliations, audit support, and final-pay handling rather than first-time setup only.",
      proof: ["Payroll reconciliation sample", "Audit checklist", "Final pay procedure"]
    }
  ],
  legal: [
    {
      detail: "Confirm local legal templates, playbooks, and fallback positions are approved for the entity and current workforce model.",
      proof: ["Counsel-approved template pack", "Legal guidance note", "Template owner register"]
    },
    {
      detail: "This is about governance, including delegated authorities, approval routing, and claim or dispute visibility.",
      proof: ["Delegation matrix", "Approval workflow", "Claims tracker"]
    },
    {
      detail: "Where the entity is inherited or acquired, local legal review should identify unresolved liabilities, legacy contracts, or consultation risks.",
      proof: ["Due diligence summary", "Inherited risk register", "Post-close remediation plan"]
    }
  ],
  hr_records: [
    {
      detail: "Employee files should be complete enough for audit and day-to-day case handling, not just partially assembled onboarding folders.",
      proof: ["Employee file audit", "File checklist", "Sample completed personnel file"]
    },
    {
      detail: "This checks whether signed contracts and acknowledgements can be produced consistently across the employee population.",
      proof: ["Signed contract repository extract", "Acknowledgement tracker", "Onboarding file sample"]
    },
    {
      detail: "Active and historical case documentation should be traceable so the entity can defend decisions and show consistent handling.",
      proof: ["Case register", "ER case folder structure", "Document retention note"]
    }
  ],
  immigration: [
    {
      detail: "Confirm the entity knows which workers depend on immigration approval and which roles cannot proceed without sponsorship or permit action.",
      proof: ["Immigration population tracker", "Role sponsorship matrix", "People team review note"]
    },
    {
      detail: "This covers cross-functional review for mobility and sponsored cases, especially where payroll, tax, and immigration decisions must line up.",
      proof: ["Mobility review checklist", "Tax and payroll sign-off", "Immigration approval pack"]
    },
    {
      detail: "Expiry management should be operational rather than manual so permit renewals and sponsor actions are not missed.",
      proof: ["Expiry tracker", "Renewal calendar", "Escalation workflow"]
    }
  ],
  data_privacy: [
    {
      detail: "The entity should understand where employee data sits, who has access, and whether transfers occur across borders or systems.",
      proof: ["Employee data map", "System access matrix", "Cross-border transfer inventory"]
    },
    {
      detail: "Retention, access, and deletion controls should be documented for employee records and case files, not handled ad hoc.",
      proof: ["Retention policy", "Access control policy", "Deletion or archive process note"]
    },
    {
      detail: "Sensitive employee data needs legal or privacy oversight where local law, transfers, or integration work create additional risk.",
      proof: ["Privacy review note", "DPIA or transfer assessment", "Sensitive-data handling guidance"]
    }
  ]
};

function detailedRequirementsFor(country, sectionId) {
  return countryDetailOverrides[country.code]?.[sectionId] || sectionDetailLibrary[sectionId] || [];
}

function renderDetailedRequirementCards(items) {
  if (!items.length) return `<p class="muted-copy">Detailed requirement notes are still being configured for this section.</p>`;
  return `<div class="detail-card-grid">${items.map((item) => `
    <article class="detail-note-card">
      <h4>${item.title}</h4>
      <p class="muted-copy">${item.detail}</p>
      <p class="detail-proof-label">Document proof to request</p>
      ${renderList(item.proof)}
    </article>
  `).join("")}</div>`;
}
function renderDashboard() {
  const inScopeCountries = accessibleCountries(currentRole());
  const regionNames = [...new Set(inScopeCountries.map((country) => country.region))];
  const regionEntries = regionNames.map((regionName) =>
    regionAssessment(regionName, inScopeCountries.filter((country) => country.region === regionName))
  );
  const compliantCount = regionEntries.filter((entry) => entry.label === "Compliant").length;
  const reviewCount = regionEntries.filter((entry) => entry.label === "Review in progress").length;
  const gapCount = regionEntries.filter((entry) => entry.label === "Gap identified").length;

  assessmentDashboardTitleNode.textContent = `${regionNames.length} in-scope regions`;

  assessmentDashboardSummaryNode.innerHTML = `
    <div class="dashboard-pill success">${compliantCount} compliant</div>
    <div class="dashboard-pill warning">${reviewCount} in review</div>
    <div class="dashboard-pill danger">${gapCount} gap identified</div>
  `;

  assessmentDashboardListNode.innerHTML = regionEntries.map((entry) => `
        <article class="dashboard-region-card">
          <div>
            <strong>${entry.region}</strong>
            <span>${entry.countryCount} countries in scope</span>
          </div>
          <div>
            <strong>${entry.label}</strong>
            <span>${entry.compliantCount} compliant | ${entry.reviewCount} review | ${entry.gapCount} gaps</span>
          </div>
        </article>
  `).join("");
}

function renderPermissions() {
  const role = currentRole();
  const allowed = accessibleCountries(role);
  permissionRoleNameNode.textContent = role.name;
  permissionSummaryNode.textContent = `${role.description} Countries in scope: ${allowed.map((country) => country.name).join(", ")}.`;
  permissionTagsNode.innerHTML = [
    role.capabilities.review ? "Can review" : "View-only review status",
    role.capabilities.upload ? "Can upload proofs" : "No proof upload rights",
    role.capabilities.comment ? "Can comment" : "No comment rights"
  ].map((tag) => `<span class="scope-tag">${tag}</span>`).join("");
}

function renderRequirementCoverage() {
  const country = currentCountry();
  const sections = requirementSections(country);
  if (!sections.some((section) => section.id === state.sourceTabId)) {
    state.sourceTabId = sections[0].id;
  }
  const active = sections.find((section) => section.id === state.sourceTabId);
  const activeDetailedItems = detailedRequirementsFor(country, active.id);

  requirementTabsNode.innerHTML = sections.map((section) => `
    <button type="button" class="assessment-source-tab ${state.sourceTabId === section.id ? "active" : ""}" data-source-tab="${section.id}">
      ${section.label}
    </button>
  `).join("");

  requirementContentNode.innerHTML = `
    <section class="content-panel">
      <div class="section-head-row">
        <div>
          <h3>${active.title}</h3>
          <p class="muted-copy">${active.summary}</p>
        </div>
        ${active.timing ? `<div class="timing-pill">${active.timing}</div>` : ""}
      </div>
      <div class="content-grid">
        <article class="content-panel">
          <h3>Primary requirements</h3>
          ${renderList(active.bullets)}
        </article>
        <article class="content-panel">
          <h3>${active.secondaryTitle}</h3>
          ${renderList(active.secondaryItems, active.id === "hiring")}
        </article>
        <article class="content-panel">
          <h3>${active.tertiaryTitle}</h3>
          ${renderList(active.tertiaryItems)}
        </article>
      </div>
      <article class="content-panel">
        <h3>Detailed requirement guidance</h3>
        ${renderDetailedRequirementCards(activeDetailedItems)}
      </article>
    </section>
  `;

  requirementTabsNode.querySelectorAll("[data-source-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sourceTabId = button.dataset.sourceTab;
      renderRequirementCoverage();
    });
  });
}

function renderGapAssessment() {
  const country = currentCountry();
  const entity = currentEntity();
  const capabilities = currentCapabilities();
  const categoryEntries = Object.entries(complianceCategories);
  const activeCategory = complianceCategories[state.categoryId];
  const summary = categoryAssessment(entity, state.categoryId);

  categoryTabsNode.innerHTML = categoryEntries.map(([categoryId, category]) => {
    const itemSummary = categoryAssessment(entity, categoryId);
    return `
      <button type="button" class="category-tab ${toneClass(itemSummary.label)} ${state.categoryId === categoryId ? "active" : ""}" data-category-tab="${categoryId}">
        <span>${category.label}</span>
        <strong>${itemSummary.label === "Compliant" ? "100% compliant" : `${itemSummary.completionPercent}% complete`}</strong>
      </button>
    `;
  }).join("");

  const minimumRows = activeCategory.minimums.map((minimum) => {
    const commentKey = `${state.categoryId}::${minimum}`;
    const value = minimumResponseStore[country.code][entity.id][state.categoryId][minimum];
    const comment = commentStore[country.code][entity.id].minimums[commentKey];
    const guidance = minimumRequirementGuidance[state.categoryId]?.[activeCategory.minimums.indexOf(minimum)];
    return `
      <article class="record-card">
        <div class="record-head">
          <div>
            <h3>${minimum}</h3>
            <p class="muted-copy">Bare minimum requirement for ${activeCategory.label.toLowerCase()}.</p>
            ${guidance ? `<p class="muted-copy">${guidance.detail}</p>
            <p class="detail-proof-label">Document proof to request</p>
            ${renderList(guidance.proof)}` : ""}
          </div>
          <select class="record-select" data-minimum-id="${minimum}" ${capabilities.review ? "" : "disabled"}>
            <option value="complete" ${value === "complete" ? "selected" : ""}>Met</option>
            <option value="in_progress" ${value === "in_progress" ? "selected" : ""}>Partially met</option>
            <option value="missing" ${value === "missing" ? "selected" : ""}>Gap identified</option>
          </select>
        </div>
        <textarea class="comment-box" data-minimum-comment="${minimum}" placeholder="Add evidence note, remediation comment, or source reference." ${capabilities.comment ? "" : "disabled"}>${comment}</textarea>
      </article>
    `;
  }).join("");

  const recordRows = summary.records.map((record) => {
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
        <textarea class="comment-box" data-record-comment="${record.id}" placeholder="Capture legal, People, or remediation comments." ${capabilities.comment ? "" : "disabled"}>${comment}</textarea>
      </article>
    `;
  }).join("");

  const documentRows = activeCategory.requiredDocuments.map((documentLabel) => {
    const proof = proofStore[country.code][entity.id][state.categoryId][documentLabel];
    const uploadValue = documentUploadStore[country.code][entity.id][state.categoryId][documentLabel];
    const commentKey = `${state.categoryId}::${documentLabel}`;
    const comment = commentStore[country.code][entity.id].documents[commentKey];
    return `
      <article class="document-card">
        <div class="record-head">
          <div>
            <h3>${documentLabel}</h3>
            <p class="muted-copy">Required document proof for category completion.</p>
          </div>
          <select class="record-select" data-document-id="${documentLabel}" ${capabilities.upload ? "" : "disabled"}>
            <option value="uploaded" ${uploadValue === "uploaded" ? "selected" : ""}>Uploaded</option>
            <option value="pending" ${uploadValue === "pending" ? "selected" : ""}>Pending</option>
          </select>
        </div>
        <div class="form-inline-grid">
          <label class="field compact-field">
            <span>Proof file</span>
            <input type="file" data-document-file="${documentLabel}" ${capabilities.upload ? "" : "disabled"}>
          </label>
          <label class="field compact-field">
            <span>Uploaded by</span>
            <input type="text" data-document-owner="${documentLabel}" value="${proof.uploadedBy}" placeholder="Name or team" ${capabilities.upload ? "" : "disabled"}>
          </label>
        </div>
        <div class="upload-meta">
          <span><strong>Stored file name:</strong> ${proof.fileName || "No file selected in this session"}</span>
          <span><strong>Last updated:</strong> ${proof.uploadedAt || "-"}</span>
        </div>
        <textarea class="comment-box" data-document-note="${documentLabel}" placeholder="Capture proof notes, missing items, or remediation details." ${capabilities.comment ? "" : "disabled"}>${comment || proof.evidenceNote}</textarea>
      </article>
    `;
  }).join("");

  categoryContentNode.innerHTML = `
    <section class="content-panel">
      <div class="section-head-row">
        <div>
          <h3>${activeCategory.label}</h3>
          <p class="muted-copy">Status: ${summary.label} | Completion: ${summary.completionPercent}% | Source teams: ${currentEntity().sourceTeams.join(" and ")}</p>
        </div>
        <div class="dashboard-summary">
          <div class="dashboard-pill ${toneClass(summary.label)}">${summary.label}</div>
          <div class="dashboard-pill neutral">${summary.completeChecks} completed checks</div>
          <div class="dashboard-pill neutral">${summary.missingChecks} open gaps</div>
        </div>
      </div>
      <div class="info-banner">
        <strong>How to use this form:</strong> Review the country requirements above, capture whether the bare minimum controls are met, update record status, and upload document proof references. This prototype stores file names and notes in the browser, not the actual files.
      </div>
      <div class="content-grid assessment-form-grid">
        <article class="content-panel">
          <h3>Bare Minimum Requirements</h3>
          <div class="record-grid">${minimumRows}</div>
        </article>
        <article class="content-panel">
          <h3>Mandatory Records</h3>
          <div class="record-grid">${recordRows || `<p class="muted-copy">No record set has been configured for this category yet.</p>`}</div>
        </article>
      </div>
      <article class="content-panel">
        <h3>Document Proofs</h3>
        <div class="record-grid">${documentRows}</div>
      </article>
    </section>
  `;

  categoryTabsNode.querySelectorAll("[data-category-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.categoryId = button.dataset.categoryTab;
      renderGapAssessment();
      
    });
  });

  categoryContentNode.querySelectorAll("[data-minimum-id]").forEach((select) => {
    select.addEventListener("input", (event) => {
      minimumResponseStore[country.code][entity.id][state.categoryId][event.target.dataset.minimumId] = event.target.value;
      saveStore(storageKeys.minimums, minimumResponseStore);
      renderGapAssessment();
      
      renderSummary();
    });
  });

  categoryContentNode.querySelectorAll("[data-minimum-comment]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const key = `${state.categoryId}::${event.target.dataset.minimumComment}`;
      commentStore[country.code][entity.id].minimums[key] = event.target.value;
      saveStore(storageKeys.comments, commentStore);
    });
  });

  categoryContentNode.querySelectorAll("[data-record-id]").forEach((select) => {
    select.addEventListener("input", (event) => {
      assessmentStore[country.code][entity.id][event.target.dataset.recordId] = event.target.value;
      saveStore(storageKeys.assessment, assessmentStore);
      renderGapAssessment();
      
      renderSummary();
    });
  });

  categoryContentNode.querySelectorAll("[data-record-comment]").forEach((input) => {
    input.addEventListener("input", (event) => {
      commentStore[country.code][entity.id].records[event.target.dataset.recordComment] = event.target.value;
      saveStore(storageKeys.comments, commentStore);
    });
  });

  categoryContentNode.querySelectorAll("[data-document-id]").forEach((select) => {
    select.addEventListener("input", (event) => {
      documentUploadStore[country.code][entity.id][state.categoryId][event.target.dataset.documentId] = event.target.value;
      if (event.target.value !== "uploaded") {
        proofStore[country.code][entity.id][state.categoryId][event.target.dataset.documentId].fileName = "";
        proofStore[country.code][entity.id][state.categoryId][event.target.dataset.documentId].uploadedAt = "";
      }
      saveStore(storageKeys.documents, documentUploadStore);
      saveStore(storageKeys.proofs, proofStore);
      renderGapAssessment();
      
      renderSummary();
    });
  });

  categoryContentNode.querySelectorAll("[data-document-file]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      documentUploadStore[country.code][entity.id][state.categoryId][event.target.dataset.documentFile] = "uploaded";
      proofStore[country.code][entity.id][state.categoryId][event.target.dataset.documentFile].fileName = file.name;
      proofStore[country.code][entity.id][state.categoryId][event.target.dataset.documentFile].uploadedAt = new Date().toLocaleString("en-IN");
      saveStore(storageKeys.documents, documentUploadStore);
      saveStore(storageKeys.proofs, proofStore);
      renderGapAssessment();
      
      renderSummary();
    });
  });

  categoryContentNode.querySelectorAll("[data-document-owner]").forEach((input) => {
    input.addEventListener("input", (event) => {
      proofStore[country.code][entity.id][state.categoryId][event.target.dataset.documentOwner].uploadedBy = event.target.value;
      saveStore(storageKeys.proofs, proofStore);
    });
  });

  categoryContentNode.querySelectorAll("[data-document-note]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const documentLabel = event.target.dataset.documentNote;
      const key = `${state.categoryId}::${documentLabel}`;
      commentStore[country.code][entity.id].documents[key] = event.target.value;
      proofStore[country.code][entity.id][state.categoryId][documentLabel].evidenceNote = event.target.value;
      saveStore(storageKeys.comments, commentStore);
      saveStore(storageKeys.proofs, proofStore);
    });
  });
}

function renderSelectors() {
  const role = currentRole();
  const allowedCountries = accessibleCountries(role);
  roleSelect.innerHTML = roles.map((item) => `<option value="${item.id}">${item.name}</option>`).join("");
  roleSelect.value = state.roleId;
  countrySelect.innerHTML = allowedCountries.map((country) => `<option value="${country.code}">${country.name}</option>`).join("");
  countrySelect.value = state.countryCode;
  entitySelect.innerHTML = entitiesForCountry(state.countryCode).map((entity) => `<option value="${entity.id}">${entity.name}</option>`).join("");
  entitySelect.value = state.entityId;
  headcountInput.value = String(state.headcount);
  workerTypeSelect.value = state.workerType;
  urgencySelect.value = state.urgency;
  notesInput.value = state.notes;
}

function render() {
  syncState();
  renderSelectors();
  renderPermissions();
  renderDashboard();
  renderRequirementCoverage();
  renderGapAssessment();
  
}

roleSelect.addEventListener("input", () => {
  state.roleId = roleSelect.value;
  syncState();
  render();
});

countrySelect.addEventListener("input", () => {
  state.countryCode = countrySelect.value;
  syncState();
  render();
});

entitySelect.addEventListener("input", () => {
  state.entityId = entitySelect.value;
  render();
});

headcountInput.addEventListener("input", () => {
  state.headcount = Math.max(Number(headcountInput.value) || 0, 0);
  renderRequirementCoverage();
});

workerTypeSelect.addEventListener("input", () => {
  state.workerType = workerTypeSelect.value;
  renderRequirementCoverage();
});

urgencySelect.addEventListener("input", () => {
  state.urgency = urgencySelect.value;
  renderRequirementCoverage();
});

notesInput.addEventListener("input", () => {
  state.notes = notesInput.value;
  renderRequirementCoverage();
});

render();
