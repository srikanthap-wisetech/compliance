
const roleSelect = document.getElementById("acquisition-role");
const countrySelect = document.getElementById("acquisition-country");
const entitySelect = document.getElementById("acquisition-entity");
const targetCompanyNameInput = document.getElementById("target-company-name");
const transactionStageSelect = document.getElementById("transaction-stage");
const targetHeadcountInput = document.getElementById("target-headcount");
const acquisitionNotesInput = document.getElementById("acquisition-notes");
const targetProfileNameNode = document.getElementById("target-profile-name");
const targetProfileSummaryNode = document.getElementById("target-profile-summary");
const targetProfileTagsNode = document.getElementById("target-profile-tags");
const roleNameNode = document.getElementById("acquisition-role-name");
const roleSummaryNode = document.getElementById("acquisition-role-summary");
const roleTagsNode = document.getElementById("acquisition-role-tags");
const processContentNode = document.getElementById("acquisition-process-content");
const categoryTabsNode = document.getElementById("diligence-category-tabs");
const categoryContentNode = document.getElementById("diligence-category-content");
const summaryNode = document.getElementById("acquisition-summary");
const submissionBannerNode = document.getElementById("submission-banner");
const submissionSummaryNode = document.getElementById("submission-summary-content");
const saveDraftButton = document.getElementById("save-draft-button");
const submitReviewButton = document.getElementById("submit-review-button");
const exportSummaryButton = document.getElementById("export-summary-button");
const openIntakeModalButton = document.getElementById("open-intake-modal-button");
const intakeModalShell = document.getElementById("intake-modal-shell");
const intakeModalBackdrop = document.getElementById("intake-modal-backdrop");
const closeIntakeModalButton = document.getElementById("close-intake-modal-button");
const cancelIntakeModalButton = document.getElementById("cancel-intake-modal-button");
const saveIntakeModalButton = document.getElementById("save-intake-modal-button");

const { roles, countries } = window.complianceData;
const query = new URLSearchParams(window.location.search);

const storageKey = "gwct-acquisition-review-v2";
const state = {
  roleId: query.get("role") || roles[0].id,
  countryCode: query.get("country") || countries[0].code,
  entityId: query.get("entity") || "",
  categoryId: "entity_structure",
  intakeModalOpen: false
};

const entityLibrary = {
  AU: [{ id: "au-wtg", name: "WiseTech Global Australia Pty Ltd" }, { id: "au-acq", name: "Blueship Acquisition Australia" }],
  IN: [{ id: "in-wtg", name: "WiseTech Global India Pvt Ltd" }],
  SG: [{ id: "sg-hub", name: "WiseTech Global Singapore Pte Ltd" }],
  UK: [{ id: "uk-wtg", name: "WiseTech Global UK Ltd" }, { id: "uk-acq", name: "ClearChain UK Holdings" }],
  FR: [{ id: "fr-wtg", name: "WiseTech Global France SAS" }, { id: "fr-acq", name: "ParcelFlow France SAS" }],
  NL: [{ id: "nl-wtg", name: "WiseTech Global Netherlands BV" }],
  US: [{ id: "us-wtg", name: "WiseTech Global US Inc" }],
  DE: [{ id: "de-targetco", name: "Germany TargetCo GmbH" }],
  CA: [{ id: "ca-targetco", name: "Canada TargetCo Ltd" }]
};

const categories = {
  entity_structure: { label: "Entity and workforce structure" },
  labor_payroll: { label: "Labor and payroll compliance" },
  er_legal: { label: "Employee relations and legal risk" },
  immigration: { label: "Immigration and mobility" },
  privacy_integration: { label: "Privacy and integration readiness" }
};

const questionLibrary = {
  entity_structure: [
    { id: "entity_map", label: "Entity structure and employing footprint", help: "Map all employing entities, branches, offices, and employee locations in scope.", proofs: ["Corporate structure chart", "Employee location census", "Entity ownership summary"] },
    { id: "worker_mix", label: "Worker population and worker mix", help: "Confirm permanent, fixed-term, contractor, agency worker, and leadership populations.", proofs: ["Employee census file", "Worker mix summary", "Leadership roster"] },
    { id: "rep_bodies", label: "Representative bodies and collective structures", help: "Identify unions, works councils, employee representatives, or collective bargaining coverage.", proofs: ["Representative body summary", "Collective agreement list", "Counsel note"] }
  ],
  labor_payroll: [
    { id: "contracts_terms", label: "Contracts, terms, and statutory registrations", help: "Review local contracts, statutory registrations, benefits setup, and payroll contribution obligations.", proofs: ["Contract sample set", "Registration certificates", "Payroll setup summary"] },
    { id: "payroll_controls", label: "Payroll operations and liabilities", help: "Assess payroll controls, accruals, contributions, tax setup, and leave or severance liabilities.", proofs: ["Payroll controls matrix", "Liability schedule", "Sample payroll reconciliation"] },
    { id: "subnational", label: "State, province, or multi-location overlays", help: "Where applicable, review state or province-specific compliance differences across the target footprint.", proofs: ["State or province matrix", "Location-based compliance tracker", "Local counsel advice"] }
  ],
  er_legal: [
    { id: "claims_cases", label: "Active disputes, cases, and government activity", help: "Review employee disputes, claims, investigations, and regulator notices or inspections.", proofs: ["Claims register", "Investigation summary", "Government notice file"] },
    { id: "termination_restructuring", label: "Termination, redundancy, and restructuring exposure", help: "Check open exits, planned layoffs, consultation duties, and inherited ER matters.", proofs: ["ER case log", "Termination samples", "Restructuring note"] },
    { id: "approval_governance", label: "Decision authority and legal governance", help: "Understand who can hire, terminate, sign contracts, and settle disputes within the target.", proofs: ["Delegation matrix", "Approval workflow", "Settlement authority note"] }
  ],
  immigration: [
    { id: "sponsored_pop", label: "Sponsored workers and permit dependencies", help: "Identify visa populations, expiry dates, sponsor obligations, and work authorization gaps.", proofs: ["Visa or permit tracker", "Sponsored population list", "Immigration adviser summary"] },
    { id: "mobility_cases", label: "Cross-border assignments and mobility", help: "Review secondments, remote work, and transfers that affect immigration, tax, or payroll after closing.", proofs: ["Assignment tracker", "Mobility review memo", "Tax or payroll sign-off"] }
  ],
  privacy_integration: [
    { id: "employee_data", label: "Employee data transfer and privacy controls", help: "Assess where employee data sits, what can transfer, and what approvals or restrictions apply.", proofs: ["Employee data map", "Transfer assessment", "Privacy counsel note"] },
    { id: "integration_plan", label: "Post-close integration and remediation readiness", help: "Confirm the plan for contract harmonization, payroll transition, document remediation, and manager communications.", proofs: ["Integration plan", "Remediation tracker", "People and Legal workplan"] }
  ]
};
const countryRules = {
  AU: [
    {
      when: () => true,
      workstream: "Fair Work records, payslips, superannuation, and any award or classification exposure must be reviewed.",
      docs: ["Payslip sample", "Superannuation setup evidence", "Award or classification tracker"]
    }
  ],
  IN: [
    {
      when: (p) => p.locations > 1 || p.multiRegion,
      workstream: "State-by-state registration review is required across all operating locations.",
      docs: ["State registration certificates", "State compliance tracker", "Office mapping"]
    },
    {
      when: () => true,
      workstream: "EPFO, ESIC, professional tax, appointment-letter, and settlement practices must be validated.",
      docs: ["EPFO or ESIC evidence", "Appointment-letter sample", "Settlement checklist"]
    }
  ],
  SG: [
    {
      when: () => true,
      workstream: "Key employment terms, CPF setup, itemised payslips, and work-pass exposure must be checked.",
      docs: ["KET template", "CPF setup evidence", "Work-pass tracker"]
    }
  ],
  UK: [
    {
      when: () => true,
      workstream: "Right-to-work, PAYE, pension auto-enrolment, and core UK employment records should be reviewed.",
      docs: ["Right-to-work audit sample", "PAYE setup evidence", "Pension auto-enrolment file"]
    }
  ],
  FR: [
    {
      when: () => true,
      workstream: "DPAE, personnel-register, social declarations, and representative-body exposure must be reviewed.",
      docs: ["DPAE sample", "Personnel register extract", "Representative-body summary"]
    }
  ],
  NL: [
    {
      when: () => true,
      workstream: "Payroll-tax setup, employee files, absence processes, and pension handling should be reviewed.",
      docs: ["Payroll-tax setup", "Employee file checklist", "Absence or pension note"]
    }
  ],
  US: [
    {
      when: (p) => p.multiRegion,
      workstream: "Multi-state registration, wage notice, leave, and workers-compensation review is required.",
      docs: ["State registration tracker", "State notice pack", "Workers compensation evidence"]
    },
    {
      when: () => true,
      workstream: "I-9, work authorization, and wage-hour exposure should be reviewed.",
      docs: ["I-9 audit sample", "Classification memo", "Claims summary"]
    }
  ],
  DE: [
    {
      when: () => true,
      workstream: "Contracts, payroll and social-security setup, and works-council or consultation exposure must be reviewed.",
      docs: ["Target workforce map", "Payroll and social insurance file", "Works council risk note"]
    }
  ],
  CA: [
    {
      when: (p) => p.multiRegion,
      workstream: "Province-specific employment standards and payroll setup require a province-by-province review.",
      docs: ["Province matrix", "CRA payroll account evidence", "Provincial liability summary"]
    },
    {
      when: () => true,
      workstream: "Vacation, leave, severance, and contract localization should be validated.",
      docs: ["Contract sample set", "Accrual schedule", "Leave and severance note"]
    }
  ]
};

const profileDefaults = {
  targetCompanyName: "",
  transactionStage: "due_diligence",
  targetHeadcount: 75,
  entityCount: 1,
  locations: 1,
  multiRegion: false,
  workerMix: "permanent-heavy",
  contractorCount: 0,
  sponsoredWorkerCount: 0,
  leadersCount: 5,
  employeeRepresentatives: "unknown",
  collectiveCoverage: "unknown",
  payrollModel: "unknown",
  benefitsKnown: "unknown",
  templateContracts: "unknown",
  remoteWorkforce: "unknown",
  activeDisputesCount: 0,
  governmentInspections: "unknown",
  recentRestructure: "unknown",
  knownPayrollIssues: "unknown",
  knownMisclassification: "unknown",
  knownImmigrationIssues: "unknown",
  knownPrivacyIssues: "unknown",
  notes: "",
  workflowStatus: "draft",
  submittedAt: "",
  submittedBy: "",
  locked: false
};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function loadStore() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || "{}");
  } catch {
    return {};
  }
}

function saveStore(data) {
  window.localStorage.setItem(storageKey, JSON.stringify(data));
}

const store = loadStore();

function ensureReview(countryCode, entityId) {
  store[countryCode] ||= {};
  store[countryCode][entityId] ||= {
    profile: clone(profileDefaults),
    answers: {},
    proofs: {},
    comments: {}
  };

  Object.entries(questionLibrary).forEach(([categoryId, questions]) => {
    questions.forEach((question) => {
      const key = `${categoryId}::${question.id}`;
      store[countryCode][entityId].answers[key] ||= "unknown";
      store[countryCode][entityId].proofs[key] ||= { fileName: "", uploadedBy: "", uploadedAt: "" };
      store[countryCode][entityId].comments[key] ||= "";
    });
  });

  saveStore(store);
  return store[countryCode][entityId];
}
function currentRole() {
  return roles.find((role) => role.id === state.roleId) || roles[0];
}

function accessibleCountries(role) {
  return role.scope.countries.includes("all") ? countries : countries.filter((country) => role.scope.countries.includes(country.code));
}

function entitiesForCountry(countryCode) {
  return entityLibrary[countryCode] || [];
}

function currentCountry() {
  return countries.find((country) => country.code === state.countryCode) || countries[0];
}

function syncState() {
  const allowed = accessibleCountries(currentRole());
  if (!allowed.some((country) => country.code === state.countryCode)) state.countryCode = allowed[0]?.code || countries[0].code;
  const entities = entitiesForCountry(state.countryCode);
  if (!entities.some((entity) => entity.id === state.entityId)) state.entityId = entities[0]?.id || "";
}

function currentReview() {
  return ensureReview(state.countryCode, state.entityId);
}

function renderList(items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  const className = ordered ? "process-list" : "result-list";
  return `<${tag} class="${className}">${items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
}

function severityTone(label) {
  if (label === "Ready") return "success";
  if (label === "In review") return "warning";
  return "danger";
}

function workflowTone(status) {
  if (status === "approved_with_remediation") return "success";
  if (status === "high_risk") return "danger";
  return "warning";
}

function prettyWorkflowStatus(status) {
  return ({
    draft: "Draft",
    submitted: "Submitted",
    under_review: "Under review",
    approved_with_remediation: "Approved with remediation",
    high_risk: "High risk / escalate"
  })[status] || "Draft";
}

function triggeredWorkstreams(profile, countryCode) {
  const workstreams = [];
  const add = (categoryId, reason, docs, source = "Triggered from target facts") => {
    workstreams.push({ categoryId, reason, docs, source });
  };

  add("entity_structure", "Base diligence always starts with target legal structure, workforce composition, and representative-body mapping.", ["Corporate structure chart", "Employee census", "Representative-body summary"]);
  add("labor_payroll", "Base diligence must validate contracts, statutory registrations, payroll setup, and liabilities in-country.", ["Contract sample set", "Payroll setup summary", "Liability schedule"]);
  add("er_legal", "Base diligence should review claims, disputes, governance, and inherited ER issues.", ["Claims register", "Approval matrix", "ER case summary"]);
  add("privacy_integration", "Base diligence should assess employee-data handling and post-close remediation readiness.", ["Data map", "Integration plan", "Remediation tracker"]);

  if (profile.sponsoredWorkerCount > 0 || profile.knownImmigrationIssues === "yes") {
    add("immigration", "Sponsored workers or known immigration issues trigger immigration and mobility diligence.", ["Visa tracker", "Immigration adviser note", "Assignment summary"]);
  }
  if (profile.targetHeadcount >= 250) {
    add("er_legal", "A larger workforce increases the need to review disputes, consultation exposure, and governance consistency at scale.", ["Leadership approvals map", "Large-workforce ER summary", "Escalation framework"]);
  }
  if (profile.multiRegion || profile.locations > 1) {
    add("labor_payroll", "Multiple locations or states/provinces require sub-national compliance review.", ["Location matrix", "State or province tracker", "Local counsel note"], "Triggered by multi-location footprint");
  }
  if (profile.contractorCount > 0 || profile.knownMisclassification === "yes") {
    add("labor_payroll", "Contractor presence or misclassification concerns trigger worker-classification review.", ["Contractor list", "Classification memo", "Vendor contract samples"], "Triggered by worker mix");
  }
  if (profile.employeeRepresentatives === "yes" || profile.collectiveCoverage === "yes") {
    add("er_legal", "Representative bodies or collective coverage trigger consultation and transfer-risk review.", ["Collective agreement copies", "Representative-body map", "Consultation risk note"], "Triggered by representative-body presence");
  }
  if (profile.activeDisputesCount > 0 || profile.governmentInspections === "yes") {
    add("er_legal", "Open disputes or inspections trigger litigation and regulator deep-dive review.", ["Dispute register", "Inspection notices", "Outside counsel summary"], "Triggered by live risk matters");
  }
  if (profile.recentRestructure === "yes") {
    add("er_legal", "Recent or pending restructures require redundancy and termination-process diligence.", ["Restructure plan", "Termination samples", "Consultation materials"], "Triggered by restructuring activity");
  }
  if (profile.payrollModel === "fragmented" || profile.knownPayrollIssues === "yes") {
    add("labor_payroll", "Fragmented payroll or known payroll issues trigger deeper payroll-controls review.", ["Payroll controls matrix", "Reconciliation samples", "Issue log"], "Triggered by payroll model");
  }
  if (profile.knownPrivacyIssues === "yes") {
    add("privacy_integration", "Known privacy issues trigger employee-data transfer and privacy-controls diligence.", ["Transfer assessment", "Privacy incident summary", "Retention policy"], "Triggered by privacy concerns");
  }
  if (profile.transactionStage === "integration") {
    add("privacy_integration", "Integration planning stage requires post-close remediation, system migration, and employee-data transition readiness.", ["Integration workplan", "System migration note", "Remediation tracker"], "Triggered by transaction stage");
  }

  (countryRules[countryCode] || []).forEach((rule) => {
    if (rule.when(profile)) add(Object.keys(categories).find((key) => key === rule.categoryId) || inferCategory(rule.workstream), rule.workstream, rule.docs, "Country overlay");
  });

  return workstreams;
}

function inferCategory(text) {
  if (/immigration|visa|assignment/i.test(text)) return "immigration";
  if (/privacy|data|integration/i.test(text)) return "privacy_integration";
  if (/claim|dispute|consultation|works council|union|redundancy|termination/i.test(text)) return "er_legal";
  if (/payroll|registration|contract|leave|severance|super|cpf|epfo|esic/i.test(text)) return "labor_payroll";
  return "entity_structure";
}

function categorySummary(categoryId) {
  const review = currentReview();
  const questions = questionLibrary[categoryId];
  const answers = questions.map((question) => review.answers[`${categoryId}::${question.id}`]);
  const proofs = questions.filter((question) => review.proofs[`${categoryId}::${question.id}`].fileName).length;
  const ready = answers.filter((value) => value === "ready").length;
  const partial = answers.filter((value) => value === "partial").length;
  const gaps = answers.filter((value) => value === "unknown").length;
  const total = questions.length * 2;
  const score = Math.round((((ready * 2) + partial + proofs) / total) * 100);
  const label = gaps > 0 ? "Gap identified" : (partial > 0 || proofs < questions.length ? "In review" : "Ready");
  return { ready, partial, gaps, proofs, totalQuestions: questions.length, score, label };
}

function recommendation() {
  const review = currentReview();
  const summaries = Object.keys(categories).map(categorySummary);
  const redFlags = [
    review.profile.employeeRepresentatives === "yes",
    review.profile.activeDisputesCount > 0,
    review.profile.sponsoredWorkerCount > 0,
    review.profile.knownPayrollIssues === "yes",
    review.profile.knownMisclassification === "yes",
    review.profile.knownPrivacyIssues === "yes"
  ].filter(Boolean).length;
  const overall = summaries.some((item) => item.label === "Gap identified") ? "Further diligence required" : summaries.some((item) => item.label === "In review") ? "Proceed with remediation plan" : "Proceed";
  if (redFlags >= 4) return { overall: "Material workforce risk", completion: averageScore(summaries), redFlags };
  return { overall, completion: averageScore(summaries), redFlags };
}

function averageScore(items) {
  return Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);
}

function currentUserLabel() {
  return currentRole().name;
}

function missingCriticalProofs() {
  const review = currentReview();
  return Object.entries(questionLibrary).flatMap(([categoryId, questions]) =>
    questions
      .filter((question) => !review.proofs[`${categoryId}::${question.id}`].fileName)
      .map((question) => `${categories[categoryId].label}: ${question.label}`)
  );
}

function remediationItems() {
  const review = currentReview();
  return Object.entries(questionLibrary).flatMap(([categoryId, questions]) =>
    questions
      .filter((question) => review.answers[`${categoryId}::${question.id}`] !== "ready")
      .map((question) => `${categories[categoryId].label}: ${question.label}`)
  );
}

function buildSubmissionSnapshot() {
  const review = currentReview();
  const result = recommendation();
  const workstreams = triggeredWorkstreams(review.profile, state.countryCode);
  return {
    country: currentCountry().name,
    entityContext: entitiesForCountry(state.countryCode).find((entity) => entity.id === state.entityId)?.name || "Not set",
    targetCompany: review.profile.targetCompanyName || "Not yet captured",
    workflowStatus: prettyWorkflowStatus(review.profile.workflowStatus),
    submittedAt: review.profile.submittedAt || "Not submitted",
    submittedBy: review.profile.submittedBy || "Not submitted",
    recommendation: result.overall,
    completion: `${result.completion}%`,
    redFlags: result.redFlags,
    triggeredWorkstreams: workstreams.map((item) => `${categories[item.categoryId].label}: ${item.reason}`),
    missingProofs: missingCriticalProofs(),
    remediation: remediationItems()
  };
}

function exportSummary() {
  const snapshot = buildSubmissionSnapshot();
  const lines = [
    "GloWoCo",
    "Acquisition Review Summary",
    "",
    `Country: ${snapshot.country}`,
    `Current entity context: ${snapshot.entityContext}`,
    `Target company: ${snapshot.targetCompany}`,
    `Workflow status: ${snapshot.workflowStatus}`,
    `Submitted at: ${snapshot.submittedAt}`,
    `Submitted by: ${snapshot.submittedBy}`,
    `Recommendation: ${snapshot.recommendation}`,
    `Completion: ${snapshot.completion}`,
    `Red flags: ${snapshot.redFlags}`,
    "",
    "Triggered workstreams:",
    ...snapshot.triggeredWorkstreams.map((item) => `- ${item}`),
    "",
    "Missing critical proofs:",
    ...(snapshot.missingProofs.length ? snapshot.missingProofs.map((item) => `- ${item}`) : ["- None"]),
    "",
    "Remediation items:",
    ...(snapshot.remediation.length ? snapshot.remediation.map((item) => `- ${item}`) : ["- None"])
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = (snapshot.targetCompany || "target-company").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  link.href = url;
  link.download = `${safeName || "acquisition-review"}-summary.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
function renderRoleCard() {
  const role = currentRole();
  const allowed = accessibleCountries(role);
  roleNameNode.textContent = role.name;
  roleSummaryNode.textContent = `${role.description} Countries in scope: ${allowed.map((country) => country.name).join(", ")}.`;
  roleTagsNode.innerHTML = [
    role.capabilities.review ? "Can review" : "View-only review status",
    role.capabilities.upload ? "Can upload proofs" : "No proof upload rights",
    role.capabilities.comment ? "Can comment" : "No comment rights"
  ].map((tag) => `<span class="scope-tag">${tag}</span>`).join("");
}

function renderTargetProfileCard() {
  const review = currentReview();
  targetProfileNameNode.textContent = review.profile.targetCompanyName || "Not yet captured";
  targetProfileSummaryNode.textContent = `Stage: ${review.profile.transactionStage.replace(/_/g, " ")} | Workforce: ${review.profile.targetHeadcount} | Locations: ${review.profile.locations}.`;
  targetProfileTagsNode.innerHTML = [
    `${review.profile.entityCount} entities`,
    review.profile.multiRegion ? "Multi-state / province" : "Single-state / province",
    `${review.profile.contractorCount} contractors`,
    `${review.profile.sponsoredWorkerCount} sponsored workers`
  ].map((tag) => `<span class="scope-tag">${tag}</span>`).join("");
}

function renderSummary() {
  const review = currentReview();
  const result = recommendation();
  summaryNode.innerHTML = [
    { label: "Country", value: currentCountry().name },
    { label: "Target Company", value: review.profile.targetCompanyName || "Not yet captured" },
    { label: "Recommendation", value: result.overall },
    { label: "Completion", value: `${result.completion}%` }
  ].map((item) => `
    <article class="summary-card">
      <span class="summary-label">${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join("");
}

function renderSubmissionBanner() {
  const review = currentReview();
  const result = recommendation();
  const status = review.profile.workflowStatus;
  const lockedNote = review.profile.locked ? "This review is locked after submission. Save Draft will reopen editing if you need to continue working." : "This review is editable. Save Draft keeps it in working mode until you submit a review version.";
  submissionBannerNode.innerHTML = `
    <section class="submission-banner ${workflowTone(status)}">
      <div class="submission-banner-header">
        <div>
          <span class="kicker">Current Workflow Status</span>
          <h3>${prettyWorkflowStatus(status)}</h3>
        </div>
        <div class="dashboard-pill ${result.overall === "Proceed" ? "success" : result.overall === "Material workforce risk" ? "danger" : "warning"}">${result.overall}</div>
      </div>
      <p class="summary-note">Submitted by: <strong>${review.profile.submittedBy || "Not yet submitted"}</strong> | Submitted at: <strong>${review.profile.submittedAt || "-"}</strong></p>
      <p class="summary-note">${lockedNote}</p>
    </section>
  `;
}

function renderSubmissionSummary() {
  const snapshot = buildSubmissionSnapshot();
  submissionSummaryNode.innerHTML = `
    <section class="content-panel summary-block">
      <div class="detail-grid">
        <article class="mini-card"><span class="summary-label">Workflow Status</span><strong>${snapshot.workflowStatus}</strong></article>
        <article class="mini-card"><span class="summary-label">Recommendation</span><strong>${snapshot.recommendation}</strong></article>
        <article class="mini-card"><span class="summary-label">Completion</span><strong>${snapshot.completion}</strong></article>
      </div>
      <div class="summary-grid-dual">
        <article class="summary-list-card">
          <h4>Triggered workstreams</h4>
          ${renderList(snapshot.triggeredWorkstreams.length ? snapshot.triggeredWorkstreams : ["No triggered workstreams yet."])}
        </article>
        <article class="summary-list-card">
          <h4>Missing critical proofs</h4>
          ${renderList(snapshot.missingProofs.length ? snapshot.missingProofs : ["No missing proofs at this stage."])}
        </article>
      </div>
      <article class="summary-list-card">
        <h4>Post-close remediation focus</h4>
        ${renderList(snapshot.remediation.length ? snapshot.remediation : ["No remediation items identified from the current inputs."])}
      </article>
    </section>
  `;
}

function setModalOpen(nextOpen) {
  state.intakeModalOpen = nextOpen;
  intakeModalShell.classList.toggle("hidden", !nextOpen);
}

function saveTargetProfileFromModal() {
  const review = currentReview();
  review.profile.targetCompanyName = targetCompanyNameInput.value.trim();
  review.profile.transactionStage = transactionStageSelect.value;
  review.profile.targetHeadcount = Number(targetHeadcountInput.value) || 0;
  review.profile.entityCount = Number(document.getElementById("profile-entityCount").value) || 0;
  review.profile.locations = Number(document.getElementById("profile-locations").value) || 0;
  review.profile.multiRegion = document.getElementById("profile-multiRegion").value === "yes";
  review.profile.employeeRepresentatives = document.getElementById("profile-employeeRepresentatives").value;
  review.profile.collectiveCoverage = document.getElementById("profile-collectiveCoverage").value;
  review.profile.payrollModel = document.getElementById("profile-payrollModel").value;
  review.profile.sponsoredWorkerCount = Number(document.getElementById("profile-sponsoredWorkerCount").value) || 0;
  review.profile.contractorCount = Number(document.getElementById("profile-contractorCount").value) || 0;
  review.profile.activeDisputesCount = Number(document.getElementById("profile-activeDisputesCount").value) || 0;
  review.profile.governmentInspections = document.getElementById("profile-governmentInspections").value;
  review.profile.recentRestructure = document.getElementById("profile-recentRestructure").value;
  review.profile.knownPayrollIssues = document.getElementById("profile-knownPayrollIssues").value;
  review.profile.knownMisclassification = document.getElementById("profile-knownMisclassification").value;
  review.profile.knownImmigrationIssues = document.getElementById("profile-knownImmigrationIssues").value;
  review.profile.knownPrivacyIssues = document.getElementById("profile-knownPrivacyIssues").value;
  review.profile.notes = acquisitionNotesInput.value;
  saveStore(store);
}

function renderProcessSection() {
  const review = currentReview();
  const result = recommendation();
  const workstreams = triggeredWorkstreams(review.profile, state.countryCode);
  processContentNode.innerHTML = `
    <section class="content-panel">
      <div class="section-head-row">
        <div>
          <h3>Generated diligence scope</h3>
          <p class="muted-copy">These workstreams are triggered from the target facts you entered, plus local-country overlays for ${currentCountry().name}.</p>
        </div>
        <div class="dashboard-summary">
          <div class="dashboard-pill neutral">${workstreams.length} workstreams triggered</div>
          <div class="dashboard-pill ${result.overall === "Proceed" ? "success" : result.overall === "Material workforce risk" ? "danger" : "warning"}">${result.overall}</div>
          <div class="dashboard-pill neutral">${result.redFlags} red flags</div>
        </div>
      </div>
      <div class="info-banner">
        <strong>How this works:</strong> capture target facts first, let the tool generate the diligence scope, then complete evidence review against the triggered workstreams below.
      </div>
      <div class="detail-grid">
        <article class="mini-card"><span class="summary-label">Headcount</span><strong>${review.profile.targetHeadcount}</strong></article>
        <article class="mini-card"><span class="summary-label">Transaction Stage</span><strong>${review.profile.transactionStage.replace(/_/g, " ")}</strong></article>
        <article class="mini-card"><span class="summary-label">Locations</span><strong>${review.profile.locations}</strong></article>
      </div>
      <div class="detail-card-grid">
        ${workstreams.map((item) => `
          <article class="detail-note-card">
            <h4>${categories[item.categoryId].label}</h4>
            <p class="muted-copy">${item.reason}</p>
            <p class="detail-proof-label">Why triggered</p>
            <p class="muted-copy">${item.source}</p>
            <p class="detail-proof-label">Document proof to request</p>
            ${renderList(item.docs)}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function questionCard(categoryId, question, review, canReview, canUpload, canComment) {
  const key = `${categoryId}::${question.id}`;
  const answer = review.answers[key];
  const proof = review.proofs[key];
  const comment = review.comments[key];
  return `
    <article class="record-card">
      <div class="record-head">
        <div>
          <h3>${question.label}</h3>
          <p class="muted-copy">${question.help}</p>
          <p class="detail-proof-label">Document proof to request</p>
          ${renderList(question.proofs)}
        </div>
        <select class="record-select" data-answer-key="${key}" ${canReview ? "" : "disabled"}>
          <option value="ready" ${answer === "ready" ? "selected" : ""}>Ready / reviewed</option>
          <option value="partial" ${answer === "partial" ? "selected" : ""}>Partially reviewed</option>
          <option value="unknown" ${answer === "unknown" ? "selected" : ""}>Gap / unknown</option>
        </select>
      </div>
      <div class="form-inline-grid">
        <label class="field compact-field">
          <span>Proof file</span>
          <input type="file" data-proof-key="${key}" ${canUpload ? "" : "disabled"}>
        </label>
        <label class="field compact-field">
          <span>Uploaded by</span>
          <input type="text" data-owner-key="${key}" value="${proof.uploadedBy}" placeholder="Name or team" ${canUpload ? "" : "disabled"}>
        </label>
      </div>
      <div class="upload-meta">
        <span><strong>Stored file name:</strong> ${proof.fileName || "No file selected in this session"}</span>
        <span><strong>Last updated:</strong> ${proof.uploadedAt || "-"}</span>
      </div>
      <textarea class="comment-box" data-comment-key="${key}" placeholder="Capture findings, risks, or follow-up actions." ${canComment ? "" : "disabled"}>${comment}</textarea>
    </article>
  `;
}
function renderCategorySection() {
  const review = currentReview();
  const role = currentRole();
  const summary = categorySummary(state.categoryId);
  const questions = questionLibrary[state.categoryId];
  const isLocked = review.profile.locked;
  const canReview = role.capabilities.review && !isLocked;
  const canUpload = role.capabilities.upload && !isLocked;
  const canComment = role.capabilities.comment && !isLocked;

  categoryTabsNode.innerHTML = Object.entries(categories).map(([categoryId, category]) => {
    const item = categorySummary(categoryId);
    return `
      <button type="button" class="category-tab ${severityTone(item.label)} ${state.categoryId === categoryId ? "active" : ""}" data-tab="${categoryId}">
        <span>${category.label}</span>
        <strong>${item.score}% complete</strong>
      </button>
    `;
  }).join("");

  categoryContentNode.innerHTML = `
    <section class="content-panel">
      <div class="section-head-row">
        <div>
          <h3>${categories[state.categoryId].label}</h3>
          <p class="muted-copy">Status: ${summary.label} | Ready: ${summary.ready}/${summary.totalQuestions} | Proofs: ${summary.proofs}/${summary.totalQuestions}</p>
        </div>
        <button type="button" class="button-secondary" id="edit-target-profile-inline">Edit Target Profile</button>
      </div>
      ${isLocked ? `<p class="readonly-note">Editing is paused because this assessment version has been submitted. Select Save Draft to reopen the review and continue updating inputs.</p>` : ""}
      <article class="content-panel">
        <h3>Evidence review</h3>
        <div class="record-grid">${questions.map((question) => questionCard(state.categoryId, question, review, canReview, canUpload, canComment)).join("")}</div>
      </article>
    </section>
  `;

  categoryTabsNode.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => {
    state.categoryId = button.dataset.tab;
    renderCategorySection();
  }));

  document.getElementById("edit-target-profile-inline")?.addEventListener("click", () => {
    setModalOpen(true);
  });

  categoryContentNode.querySelectorAll("[data-answer-key]").forEach((node) => node.addEventListener("input", (event) => {
    currentReview().answers[event.target.dataset.answerKey] = event.target.value;
    saveStore(store);
    rerenderAssessment();
  }));

  categoryContentNode.querySelectorAll("[data-proof-key]").forEach((node) => node.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const key = event.target.dataset.proofKey;
    currentReview().proofs[key].fileName = file.name;
    currentReview().proofs[key].uploadedAt = new Date().toLocaleString("en-IN");
    saveStore(store);
    rerenderAssessment();
  }));

  categoryContentNode.querySelectorAll("[data-owner-key]").forEach((node) => node.addEventListener("input", (event) => {
    currentReview().proofs[event.target.dataset.ownerKey].uploadedBy = event.target.value;
    saveStore(store);
  }));

  categoryContentNode.querySelectorAll("[data-comment-key]").forEach((node) => node.addEventListener("input", (event) => {
    currentReview().comments[event.target.dataset.commentKey] = event.target.value;
    saveStore(store);
  }));

}

function rerenderAssessment() {
  renderSummary();
  renderSubmissionBanner();
  renderProcessSection();
  renderCategorySection();
  renderSubmissionSummary();
}

function renderSelectors() {
  const role = currentRole();
  const allowed = accessibleCountries(role);
  const review = currentReview();
  const isLocked = review.profile.locked;
  roleSelect.innerHTML = roles.map((item) => `<option value="${item.id}">${item.name}</option>`).join("");
  roleSelect.value = state.roleId;
  countrySelect.innerHTML = allowed.map((country) => `<option value="${country.code}">${country.name}</option>`).join("");
  countrySelect.value = state.countryCode;
  entitySelect.innerHTML = entitiesForCountry(state.countryCode).map((entity) => `<option value="${entity.id}">${entity.name}</option>`).join("");
  entitySelect.value = state.entityId;
  targetCompanyNameInput.value = review.profile.targetCompanyName;
  transactionStageSelect.value = review.profile.transactionStage;
  targetHeadcountInput.value = String(review.profile.targetHeadcount);
  acquisitionNotesInput.value = review.profile.notes;
  document.getElementById("profile-entityCount").value = String(review.profile.entityCount);
  document.getElementById("profile-locations").value = String(review.profile.locations);
  document.getElementById("profile-multiRegion").value = review.profile.multiRegion ? "yes" : "no";
  document.getElementById("profile-employeeRepresentatives").value = review.profile.employeeRepresentatives;
  document.getElementById("profile-collectiveCoverage").value = review.profile.collectiveCoverage;
  document.getElementById("profile-payrollModel").value = review.profile.payrollModel;
  document.getElementById("profile-sponsoredWorkerCount").value = String(review.profile.sponsoredWorkerCount);
  document.getElementById("profile-contractorCount").value = String(review.profile.contractorCount);
  document.getElementById("profile-activeDisputesCount").value = String(review.profile.activeDisputesCount);
  document.getElementById("profile-governmentInspections").value = review.profile.governmentInspections;
  document.getElementById("profile-recentRestructure").value = review.profile.recentRestructure;
  document.getElementById("profile-knownPayrollIssues").value = review.profile.knownPayrollIssues;
  document.getElementById("profile-knownMisclassification").value = review.profile.knownMisclassification;
  document.getElementById("profile-knownImmigrationIssues").value = review.profile.knownImmigrationIssues;
  document.getElementById("profile-knownPrivacyIssues").value = review.profile.knownPrivacyIssues;
  targetCompanyNameInput.disabled = isLocked;
  transactionStageSelect.disabled = isLocked;
  targetHeadcountInput.disabled = isLocked;
  acquisitionNotesInput.disabled = isLocked;
  saveIntakeModalButton.disabled = isLocked;
  submitReviewButton.disabled = isLocked;
  [
    "profile-entityCount",
    "profile-locations",
    "profile-multiRegion",
    "profile-employeeRepresentatives",
    "profile-collectiveCoverage",
    "profile-payrollModel",
    "profile-sponsoredWorkerCount",
    "profile-contractorCount",
    "profile-activeDisputesCount",
    "profile-governmentInspections",
    "profile-recentRestructure",
    "profile-knownPayrollIssues",
    "profile-knownMisclassification",
    "profile-knownImmigrationIssues",
    "profile-knownPrivacyIssues"
  ].forEach((id) => {
    document.getElementById(id).disabled = isLocked;
  });
}

function render() {
  syncState();
  ensureReview(state.countryCode, state.entityId);
  renderSelectors();
  renderTargetProfileCard();
  renderRoleCard();
  rerenderAssessment();
}

roleSelect.addEventListener("input", () => { state.roleId = roleSelect.value; render(); });
countrySelect.addEventListener("input", () => { state.countryCode = countrySelect.value; render(); });
entitySelect.addEventListener("input", () => { state.entityId = entitySelect.value; render(); });

openIntakeModalButton.addEventListener("click", () => {
  setModalOpen(true);
});

closeIntakeModalButton.addEventListener("click", () => {
  renderSelectors();
  setModalOpen(false);
});

cancelIntakeModalButton.addEventListener("click", () => {
  renderSelectors();
  setModalOpen(false);
});

intakeModalBackdrop.addEventListener("click", () => {
  renderSelectors();
  setModalOpen(false);
});

saveIntakeModalButton.addEventListener("click", () => {
  saveTargetProfileFromModal();
  render();
  setModalOpen(false);
});

saveDraftButton.addEventListener("click", () => {
  const review = currentReview();
  review.profile.workflowStatus = "draft";
  review.profile.locked = false;
  review.profile.submittedAt = "";
  review.profile.submittedBy = "";
  saveStore(store);
  render();
});

submitReviewButton.addEventListener("click", () => {
  const review = currentReview();
  const result = recommendation();
  review.profile.workflowStatus = result.overall === "Material workforce risk" ? "high_risk" : "submitted";
  review.profile.locked = true;
  review.profile.submittedAt = new Date().toLocaleString("en-IN");
  review.profile.submittedBy = currentUserLabel();
  saveStore(store);
  render();
});

exportSummaryButton.addEventListener("click", () => {
  exportSummary();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.intakeModalOpen) {
    renderSelectors();
    setModalOpen(false);
  }
});

render();
