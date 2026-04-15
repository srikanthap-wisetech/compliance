window.complianceData = {
  roles: [
    { id: "global-legal", name: "Global Legal", type: "global", description: "Full visibility across all countries.", scope: { regions: ["all"], countries: ["all"] }, capabilities: { upload: true, review: true, comment: true } },
    { id: "global-hr", name: "Global HR Operations", type: "global", description: "Global operational visibility across the workforce footprint.", scope: { regions: ["all"], countries: ["all"] }, capabilities: { upload: true, review: true, comment: true } },
    { id: "apac-hr", name: "APAC HR Lead", type: "regional", description: "Regional access limited to APAC countries.", scope: { regions: ["APAC"], countries: ["AU", "IN", "SG"] }, capabilities: { upload: true, review: true, comment: true } },
    { id: "emea-hr", name: "EMEA HR Lead", type: "regional", description: "Regional access limited to EMEA countries.", scope: { regions: ["EMEA"], countries: ["UK", "FR", "NL", "DE"] }, capabilities: { upload: true, review: true, comment: true } },
    { id: "americas-hr", name: "Americas HR Lead", type: "regional", description: "Regional access limited to Americas countries.", scope: { regions: ["Americas"], countries: ["US", "CA"] }, capabilities: { upload: true, review: true, comment: true } },
    { id: "australia-hr", name: "Australia HR Manager", type: "country", description: "Country-specific access for Australia only.", scope: { regions: ["APAC"], countries: ["AU"] }, capabilities: { upload: true, review: false, comment: true } },
    { id: "india-hr", name: "India HR Manager", type: "country", description: "Country-specific access for India only.", scope: { regions: ["APAC"], countries: ["IN"] }, capabilities: { upload: true, review: false, comment: true } },
    { id: "us-hr", name: "United States HR Manager", type: "country", description: "Country-specific access for the United States only.", scope: { regions: ["Americas"], countries: ["US"] }, capabilities: { upload: true, review: false, comment: true } }
  ],
  tabs: [
    { id: "general", label: "General", group: "General" },
    { id: "labor-code", label: "Labor Code Summary", group: "General" },
    { id: "statutory-benefits", label: "Statutory Benefits", group: "General" },
    { id: "hiring", label: "Hiring", group: "Internal" },
    { id: "termination", label: "Termination", group: "Internal" },
    { id: "performance", label: "Performance", group: "Internal" },
    { id: "visa", label: "Visa Process", group: "External" },
    { id: "mobility", label: "Global Mobility", group: "External" },
    { id: "gap", label: "Compliance Gap Analysis", group: "Standalone" },
    { id: "entry", label: "Acquisition Review", group: "Standalone" }
  ],
  countries: [
    {
      code: "AU", name: "Australia", region: "APAC", entityModel: "Local employing entity", riskLevel: "moderate", complexityReason: "Awards, procedural fairness, discrimination risk, and redundancy consultation make termination and restructuring decisions materially sensitive.",
      operatingStatus: "current",
      statusLabel: "Current operation",
      labourCode: {
        overview: "Employment compliance is shaped by national standards, awards, and strong employee-relations process expectations.",
        keyThemes: ["Classification and award coverage", "Procedural fairness", "Payroll and superannuation", "Consultation and discrimination risk"],
        regulators: ["Fair Work Ombudsman", "Fair Work Commission", "Australian Taxation Office"],
        coreDocuments: ["Local contract template", "Award review checklist", "Policy pack", "Employee relations case file"]
      },
      headcountBands: [{ max: 14, label: "Small entity" }, { max: 99, label: "Growing entity" }, { max: Infinity, label: "Large workforce" }],
      entitySetup: {
        overview: "Australia is already an operating country, but new-entity style reviews still matter for expansion into a new state, payroll model, or employing structure.",
        process: ["Confirm entity, employment model, and registration path.", "Set up payroll, tax, superannuation, policies, and contract templates.", "Align legal, HR, finance, and mobility owners before first hire."],
        guidelines: ["Use local legal review before changing the employing model.", "Validate whether registrations, insurance, and manager training need refresh.", "Do not issue offers until employing-entity and payroll readiness is complete."],
        support: ["Local employment counsel", "Payroll and tax advisors", "HR operations and mobility leads"],
        timeTaken: "Entity or employing-model changes usually require several weeks of legal, payroll, and operational setup."
      },
      hiring: {
        baseRisk: "medium",
        requirements: ["Confirm award coverage and classification.", "Validate work rights, payroll tax, and superannuation setup.", "Check whether governance or policy controls need to expand."],
        documents: ["Employment agreement", "Position description", "Right-to-work evidence", "Tax and super forms"],
        process: ["Run legal and reward review.", "Issue compliant offer and contract pack.", "Complete payroll and policy acknowledgements."],
        support: ["Employment counsel for award, visa, or executive terms.", "Payroll support for registration or benefits changes."],
        thresholds: [{ minHeadcount: 15, note: "Formal manager guidance and structured employee-relations controls become more important as headcount grows." }]
      },
      termination: {
        baseRisk: "high",
        requirements: ["Assess reason, procedural fairness, notice, and final pay.", "Check discrimination, redundancy, and consultation risk.", "Confirm a documented evidence trail and approvals."],
        documents: ["Termination letter", "Warnings or investigation records", "Final pay calculation", "Exit checklist"],
        process: ["Validate legal basis.", "Prepare script, letter, and pay outputs.", "Conduct the meeting and complete the exit workflow."],
        support: ["Employment counsel for redundancy, misconduct, or senior exits.", "Employee relations support for manager preparation."],
        thresholds: [{ minHeadcount: 15, note: "A formal review gate should apply because claim exposure and consistency expectations increase materially." }]
      },
      visa: { requirements: ["Assess work rights before offer issue.", "Track sponsorship obligations and expiry dates.", "Coordinate with immigration providers for sponsored cases."], documents: ["Visa copy", "Immigration support letter", "Role justification and approval"], timeTaken: "Visa-linked hiring steps usually add 1 to 6+ weeks depending on the sponsorship path and document readiness." },
      timeTaken: { hiring: "Standard hiring setup typically takes 2 to 4 weeks.", termination: "Routine terminations may be prepared within several business days, but misconduct or redundancy matters take longer." },
      mobility: { guidelines: ["Review tax, payroll, and employment-law exposure before cross-border moves.", "Confirm whether the worker remains on the home entity or transfers locally.", "Escalate if the move affects sponsorship or compensation structure."], timeTaken: "Mobility assessments often take 2 to 8 weeks depending on immigration, tax, and payroll complexity." },
      performance: { guidelines: ["Use documented objectives and regular feedback.", "Give managers guidance on timeframes and support offered.", "Escalate before moving from performance management into termination."], timeTaken: "Performance processes generally run over multiple review cycles rather than a few days, especially where formal improvement periods apply." },
      terminationGrounds: { grounds: [{ title: "Performance", notes: "Follow a documented performance process with clear expectations and evidence." }, { title: "Misconduct", notes: "Run fact-finding and provide procedural fairness before deciding." }, { title: "Redundancy", notes: "Review consultation, redeployment, and communication planning." }, { title: "Probation", notes: "Check contract terms and keep decision-making consistent and documented." }] }
    },
    {
      code: "IN", name: "India", region: "APAC", entityModel: "Local entity with state-specific overlays", riskLevel: "high", complexityReason: "Employee-category rules, state-level variation, industrial-relations sensitivity, and settlement requirements create high termination and restructuring risk.",
      operatingStatus: "current",
      statusLabel: "Current operation",
      labourCode: {
        overview: "Labour compliance combines central frameworks with significant state-level variation in registrations, notices, and separation rules.",
        keyThemes: ["State-specific obligations", "Statutory registrations", "Employee-category analysis", "Industrial-relations sensitivity"],
        regulators: ["State labour authorities", "EPFO", "Local registration authorities"],
        coreDocuments: ["Appointment letter", "State registration tracker", "Settlement template", "Disciplinary case record"]
      },
      headcountBands: [{ max: 9, label: "Set-up stage" }, { max: 49, label: "Operating entity" }, { max: Infinity, label: "Scaled operation" }],
      entitySetup: {
        overview: "India is already in the footprint, but expansion into new states or employing structures still needs a setup playbook covering registrations, payroll, and policy localization.",
        process: ["Confirm entity model, work locations, and state registration requirements.", "Set up statutory registrations, payroll, contracts, and policy framework.", "Complete finance, HR, and legal readiness before first local hire."],
        guidelines: ["Treat each work location and state as a compliance design decision, not just an admin step.", "Validate payroll, benefits, and local registrations before offers are approved.", "Use local counsel for state-level labour law interpretation."],
        support: ["Local employment counsel", "Payroll vendor", "Finance and HR operations"],
        timeTaken: "A new setup or major state expansion usually takes multiple weeks because registrations and payroll readiness must be aligned."
      },
      hiring: {
        baseRisk: "medium",
        requirements: ["Check state-specific registrations and benefits setup.", "Review compensation structure for statutory components.", "Confirm whether headcount growth changes local governance obligations."],
        documents: ["Offer and appointment letter", "Proof of identity and address", "PF and insurance data", "Background verification consent"],
        process: ["Confirm entity and work location.", "Validate payroll and statutory setup.", "Issue the contract pack and complete registrations."],
        support: ["Local counsel for state-specific interpretation.", "Payroll support for statutory deductions and registration changes."],
        thresholds: [{ minHeadcount: 10, note: "Operational registration and notice controls become more significant beyond early-stage hiring." }, { minHeadcount: 50, note: "Larger workforces may require additional governance review depending on workforce composition." }]
      },
      termination: {
        baseRisk: "high",
        requirements: ["Assess employee category, notice, gratuity, and settlement timelines.", "Review disciplinary process and industrial-relations implications.", "Check whether retrenchment, misconduct, or performance routes require different controls."],
        documents: ["Warning or investigation records", "Separation letter", "Full-and-final settlement calculation", "Asset return acknowledgement"],
        process: ["Classify the employee and separation path.", "Confirm evidence, approvals, and payment calculations.", "Run the separation meeting and settlement workflow."],
        support: ["External employment lawyer for contested exits or industrial-relations exposure.", "Payroll and HR operations support for settlement timelines."],
        thresholds: [{ minHeadcount: 50, note: "Terminations in larger entities should trigger a more structured legal and industrial-relations review." }]
      },
      visa: { requirements: ["Confirm visa type and sponsorship documentation.", "Align immigration handling with payroll and tax.", "Track validity periods and assignment changes."], documents: ["Passport and visa copies", "Sponsorship note", "Registration records"], timeTaken: "Visa and registration handling can add several weeks depending on the immigration route and supporting registrations." },
      timeTaken: { hiring: "Local hiring can move in 2 to 5 weeks.", termination: "Straightforward exits may be prepared within days, but category review and settlement calculations often extend timelines." },
      mobility: { guidelines: ["Review immigration, payroll, and tax consequences before moves into or out of India.", "Check whether assignment structure changes benefits or registrations.", "Escalate early for long-term secondment issues."], timeTaken: "Global mobility reviews into or out of India often require 3 to 8 weeks when immigration, payroll, and tax planning are involved." },
      performance: { guidelines: ["Use clear written expectations and review checkpoints.", "Align process language with local templates and employee category.", "Legal review is recommended before exiting for performance."], timeTaken: "Performance management usually requires staged review periods and should not be treated as a same-week process." },
      terminationGrounds: { grounds: [{ title: "Performance", notes: "Document expectations, review periods, and support offered." }, { title: "Misconduct", notes: "Investigate carefully and confirm whether a formal inquiry is expected." }, { title: "Retrenchment", notes: "Assess statutory conditions, notice, payment implications, and industrial-relations risk." }, { title: "Abandonment", notes: "Confirm facts and retain outreach records before closing employment." }] }
    },
    {
      code: "SG", name: "Singapore", region: "APAC", entityModel: "Regional hub entity", riskLevel: "lower", complexityReason: "Termination risk is lower because the framework is comparatively contract-driven, though documentation and fair-employment controls still matter.",
      operatingStatus: "current",
      statusLabel: "Current operation",
      labourCode: {
        overview: "A contract-driven environment with strong practical guidance on fair employment, immigration, and compliant separation handling.",
        keyThemes: ["Contractual clarity", "Work-pass compliance", "Fair employment guidance", "Clean documentation"],
        regulators: ["Ministry of Manpower", "TAFEP"],
        coreDocuments: ["Employment contract", "Work-pass tracker", "Termination memo", "Policy pack"]
      },
      headcountBands: [{ max: 24, label: "Lean team" }, { max: 99, label: "Established hub" }, { max: Infinity, label: "Major office" }],
      entitySetup: {
        overview: "Singapore is an existing hub, but any new employing structure, pass strategy, or regional hub redesign should still run through an entity-readiness process.",
        process: ["Confirm entity and employing model.", "Set up contracts, payroll, benefits, pass support, and policy framework.", "Validate internal approvals before first hire or transfer."],
        guidelines: ["Align immigration, payroll, and mobility design early.", "Use local template governance for contracts and policy acknowledgements.", "Do not start hiring until employing structure and onboarding controls are complete."],
        support: ["Local counsel", "Immigration advisor", "HR operations and payroll"],
        timeTaken: "Entity-readiness work commonly takes several weeks when payroll, immigration, and governance all need alignment."
      },
      hiring: {
        baseRisk: "low",
        requirements: ["Validate work-pass strategy where sponsorship is needed.", "Ensure compensation and probation language match the local template.", "Check whether the hire changes quota or fair-employment controls."],
        documents: ["Employment contract", "Work-pass documents", "Data consent", "Benefits and payroll setup forms"],
        process: ["Confirm worker status and immigration path.", "Issue contract and onboard approvals.", "Complete payroll, benefits, and policy setup."],
        support: ["Immigration advisor for sponsored hires.", "Local counsel for non-standard senior terms."],
        thresholds: [{ minHeadcount: 25, note: "Larger teams should formalize consistency checks and manager capability across hiring." }]
      },
      termination: {
        baseRisk: "medium",
        requirements: ["Confirm contractual notice and accrued payments.", "Review discrimination and tripartite guidance considerations.", "Escalate if there is misconduct, seniority, or reputational sensitivity."],
        documents: ["Termination notice", "Final pay worksheet", "Manager decision memo", "Exit checklist"],
        process: ["Check contractual and factual basis.", "Prepare notice and supporting documentation.", "Run employee communication and exit controls."],
        support: ["Employment lawyer for disputed or senior exits.", "Communications support for visible employees."],
        thresholds: [{ minHeadcount: 100, note: "Large-hub exits should involve coordinated legal and communications review." }]
      },
      visa: { requirements: ["Assess pass category, quota, and salary thresholds.", "Track sponsorship timelines and renewals.", "Align immigration sponsorship with mobility processes."], documents: ["Work-pass application file", "Identity documents", "Business justification"], timeTaken: "Pass processing can range from a few business days to several weeks depending on approvals and document completeness." },
      timeTaken: { hiring: "Standard hires often move in 1 to 3 weeks.", termination: "Routine separations can be prepared quickly, though senior or sensitive cases need more review time." },
      mobility: { guidelines: ["Confirm host-entity and payroll approach for moves.", "Review immigration, tax, and benefits alignment for secondments.", "Escalate if mobility changes pass status or compensation structure."], timeTaken: "Mobility planning often takes 2 to 6 weeks depending on pass, payroll, and assignment design." },
      performance: { guidelines: ["Use documented expectations and clear records of support.", "Managers should align on timing and fairness.", "Move to termination only after a defensible record has been built."], timeTaken: "Performance management should run across defined review windows with documented check-ins." },
      terminationGrounds: { grounds: [{ title: "Performance", notes: "Use a structured performance plan and evidence-based review." }, { title: "Misconduct", notes: "Preserve evidence, investigate, and ensure a fair process." }, { title: "Redundancy", notes: "Check communication, selection, and support planning carefully." }, { title: "Mutual separation", notes: "Document voluntary agreement terms and payment treatment clearly." }] }
    },
    {
      code: "UK", name: "United Kingdom", region: "EMEA", entityModel: "UK employing entity", riskLevel: "high", complexityReason: "Fair-process obligations, discrimination and whistleblowing exposure, and collective consultation risk make termination and restructuring high risk.",
      operatingStatus: "current",
      statusLabel: "Current operation",
      labourCode: {
        overview: "A rights-heavy employment environment with strong expectations around process, consultation, worker status, and fair treatment.",
        keyThemes: ["Worker status", "Right-to-work and pension readiness", "Fair reason and fair process", "Collective consultation sensitivity"],
        regulators: ["ACAS", "Home Office", "HMRC"],
        coreDocuments: ["Employment contract", "Right-to-work checklist", "Settlement agreement template", "Consultation pack"]
      },
      headcountBands: [{ max: 19, label: "Early UK footprint" }, { max: 249, label: "Mid-sized UK employer" }, { max: Infinity, label: "Large UK employer" }],
      entitySetup: {
        overview: "The UK is already in the footprint, but a new entity or employing model still requires setup across contracts, pension, payroll, and immigration readiness.",
        process: ["Confirm entity structure and employing model.", "Set up payroll, pension, contracts, policies, and right-to-work controls.", "Complete legal and operational readiness before local hiring begins."],
        guidelines: ["Treat pension and right-to-work readiness as day-one design requirements.", "Use legal review before using non-standard contracts or executive packages.", "Build consultation-sensitive governance early if future scaling is planned."],
        support: ["UK employment counsel", "Payroll and pension providers", "HR operations"],
        timeTaken: "A new UK entity or employing model typically needs several weeks of legal, payroll, and benefits setup."
      },
      hiring: {
        baseRisk: "medium",
        requirements: ["Confirm worker status and right-to-work checks.", "Review offer language for holiday, notice, bonus, and pension readiness.", "Check whether growth changes governance or reporting obligations."],
        documents: ["Offer letter and contract", "Right-to-work evidence", "Pension onboarding forms", "Policy acknowledgements"],
        process: ["Validate role design and compensation terms.", "Run right-to-work and sponsorship checks.", "Complete contract issue and pension onboarding."],
        support: ["Immigration counsel for sponsorship matters.", "Legal support for executive terms or complex covenants."],
        thresholds: [{ minHeadcount: 250, note: "Larger UK entities generally need stronger process governance and reporting discipline." }]
      },
      termination: {
        baseRisk: "high",
        requirements: ["Assess fair reason, consultation, notice, and settlement considerations.", "Check discrimination, whistleblowing, redundancy, and collective consultation risk.", "Review notes, warnings, and investigation materials before approval."],
        documents: ["Invitation and outcome letters", "Settlement agreement", "Holiday and notice pay calculation", "Exit documents"],
        process: ["Determine legal basis and process route.", "Run consultation or disciplinary stages as needed.", "Issue written decision and complete exit steps."],
        support: ["UK employment counsel for redundancy, discrimination, or senior exits.", "Employee relations support for hearings and documentation."],
        thresholds: [{ minHeadcount: 20, note: "Programme-level workforce reductions should trigger immediate consultation analysis and coordinated control." }]
      },
      visa: { requirements: ["Confirm sponsorship route and right-to-work timing.", "Track visa renewals and sponsor obligations.", "Align role changes with sponsorship constraints."], documents: ["Right-to-work evidence", "Sponsorship records", "Visa application file"], timeTaken: "Sponsorship and visa processing can add several weeks and should be planned before offer or transfer commitments." },
      timeTaken: { hiring: "Routine hiring often takes 2 to 4 weeks.", termination: "Simple cases may move in days, but redundancy or sensitive conduct matters require materially longer planning." },
      mobility: { guidelines: ["Review tax, payroll, immigration, and benefits before moves.", "Clarify whether the employee stays with the home entity or transfers.", "Escalate for remote working from overseas or long-term assignments."], timeTaken: "Mobility reviews often take multiple weeks when immigration, tax, and employment structure need alignment." },
      performance: { guidelines: ["Set measurable expectations and document feedback.", "Ensure managers follow a consistent process and maintain notes.", "Escalate before a performance-based dismissal is finalized."], timeTaken: "Capability processes usually require multiple meetings and reasonable review periods rather than an immediate decision." },
      terminationGrounds: { grounds: [{ title: "Capability / performance", notes: "Use a documented capability process with support and clear expectations." }, { title: "Misconduct", notes: "Investigate carefully and align with disciplinary process expectations." }, { title: "Redundancy", notes: "Review consultation, selection, redeployment, and communication planning." }, { title: "SOSR", notes: "Use legal review early because fairness and reasonableness are fact-specific." }] }
    },
    {
      code: "FR", name: "France", region: "EMEA", entityModel: "French employing entity", riskLevel: "high", complexityReason: "Representation, consultation, documentation, and formal termination routes make France high risk for exits and workforce restructuring.",
      operatingStatus: "current",
      statusLabel: "Current operation",
      labourCode: {
        overview: "France is a highly structured employment environment with strong documentation, consultation, and employee-representation expectations.",
        keyThemes: ["Contract and classification precision", "Working time and leave compliance", "Consultation and employee representation", "Termination process rigor"],
        regulators: ["Labour inspectorate", "Social security authorities", "Tax and payroll authorities"],
        coreDocuments: ["French contract template", "Working time tracker", "Consultation playbook", "Termination checklist"]
      },
      headcountBands: [{ max: 10, label: "Lean entity" }, { max: 49, label: "Structured employer" }, { max: Infinity, label: "Representation-sensitive employer" }],
      entitySetup: {
        overview: "France is already in the footprint, but changes to entity structure, payroll, or representation-sensitive governance still need careful setup and legal review.",
        process: ["Confirm entity and employee-representation position.", "Set up payroll, benefits, contracts, and policy controls.", "Validate governance before scaling or restructuring."],
        guidelines: ["Treat consultation and documentation as front-end controls.", "Use local counsel for employee-representation and termination-sensitive topics.", "Do not rely on global templates without localization."],
        support: ["French employment counsel", "Payroll provider", "People operations"],
        timeTaken: "Structural or governance changes usually require several weeks because consultation-sensitive controls need careful setup."
      },
      hiring: {
        baseRisk: "high",
        requirements: ["Use localized contracts and classification controls.", "Confirm payroll and social-insurance readiness before offer issue.", "Check employee-representation and policy implications before scaling."],
        documents: ["French contract template", "Classification guidance", "Payroll onboarding pack", "Policy acknowledgements"],
        process: ["Validate entity and role design.", "Issue locally compliant offer and contract pack.", "Complete payroll and onboarding controls before start date."],
        support: ["French employment counsel", "Payroll and benefits advisors"],
        thresholds: [{ minHeadcount: 11, note: "Growth can trigger stronger representation and consultation expectations, so governance should be tightened early." }]
      },
      termination: {
        baseRisk: "high",
        requirements: ["Use locally reviewed process and documentation before any termination.", "Check consultation, representation, notice, and payment implications.", "Retain a defensible evidence trail for the selected termination ground."],
        documents: ["Termination memo", "Employee relations case file", "Notice and payment analysis", "Exit checklist"],
        process: ["Confirm legal basis and process path.", "Review consultation or representation implications.", "Proceed only after local sign-off and documented approvals."],
        support: ["French employment counsel", "People operations and payroll"],
        thresholds: [{ minHeadcount: 1, note: "Every termination should be treated as a controlled process in France because formal requirements are high." }]
      },
      visa: { requirements: ["Confirm work authorization and employer support requirements.", "Track permit validity and sponsor obligations.", "Align immigration handling with payroll and onboarding."], documents: ["Work authorization records", "Immigration support pack", "Role justification"], timeTaken: "Immigration handling can add multiple weeks depending on permit route and supporting evidence." },
      timeTaken: { hiring: "Hiring often takes longer than lighter-touch jurisdictions because localized contracts and payroll readiness matter upfront.", termination: "Termination timelines are typically longer because process rigor and documentation are critical." },
      mobility: { guidelines: ["Review mobility arrangements for tax, payroll, social security, and immigration impact.", "Check whether representation or consultation implications are created by structural moves.", "Escalate before assignment terms are finalized."], timeTaken: "Mobility reviews usually take multiple weeks when immigration and payroll coordination are needed." },
      performance: { guidelines: ["Document objectives, feedback, and support carefully.", "Use manager guidance that aligns with local process expectations.", "Do not move from performance management to termination without local review."], timeTaken: "Performance processes should be structured and documented over time rather than accelerated." },
      terminationGrounds: { grounds: [{ title: "Performance", notes: "Document support and performance history carefully before action." }, { title: "Misconduct", notes: "Use a rigorous investigation and evidence standard." }, { title: "Economic / restructuring", notes: "Assess consultation and representation exposure before any programme." }, { title: "Mutual separation", notes: "Use local legal review on documentation and payment terms." }] }
    },
    {
      code: "NL", name: "Netherlands", region: "EMEA", entityModel: "Dutch employing entity", riskLevel: "high", complexityReason: "Structured dismissal routes, incapacity-related rules, and process-heavy exit governance create high termination and restructuring risk.",
      operatingStatus: "current",
      statusLabel: "Current operation",
      labourCode: {
        overview: "The Netherlands has a structured employment regime with strong contract, leave, payroll, and process expectations, but is often more predictable when governance is set up well.",
        keyThemes: ["Contract and policy localization", "Working time and leave rules", "Payroll and social security setup", "Termination process discipline"],
        regulators: ["Labour and tax authorities", "Social insurance bodies", "Immigration authorities where relevant"],
        coreDocuments: ["Dutch contract template", "Payroll and benefits setup pack", "Termination guidance", "Policy acknowledgement set"]
      },
      headcountBands: [{ max: 10, label: "Lean entity" }, { max: 49, label: "Structured employer" }, { max: Infinity, label: "Scaled Dutch employer" }],
      entitySetup: {
        overview: "The Netherlands is already in the footprint, but entity, payroll, and contract changes still need legal and operational setup before scaling.",
        process: ["Confirm employing structure and workforce model.", "Set up payroll, benefits, contracts, and policy framework.", "Validate legal and people-governance controls before expansion."],
        guidelines: ["Use local templates and payroll design from the outset.", "Keep approval and recordkeeping standards clear.", "Escalate early for immigration or restructuring-sensitive topics."],
        support: ["Dutch employment counsel", "Payroll provider", "People operations"],
        timeTaken: "Operational setup or governance changes typically take several weeks depending on payroll and contract updates."
      },
      hiring: {
        baseRisk: "medium",
        requirements: ["Use localized contract terms and onboarding controls.", "Confirm payroll, benefits, and social-insurance readiness.", "Check whether the role creates immigration or structural complexity."],
        documents: ["Dutch contract template", "Payroll setup forms", "Benefits onboarding pack", "Policy acknowledgements"],
        process: ["Validate role and compensation design.", "Issue compliant offer and contract pack.", "Complete payroll and onboarding controls before start date."],
        support: ["Dutch employment counsel", "Payroll and benefits advisors"],
        thresholds: [{ minHeadcount: 50, note: "As the entity scales, governance over employee relations and structural workforce decisions should become more formalized." }]
      },
      termination: {
        baseRisk: "high",
        requirements: ["Use locally reviewed termination guidance and process steps.", "Confirm documentation, notice, and payment treatment before action.", "Escalate cases involving performance, long service, or structural change."],
        documents: ["Termination memo", "Case documentation", "Payment analysis", "Exit checklist"],
        process: ["Confirm termination route and local requirements.", "Review evidence, approvals, and communications.", "Proceed only after local review and documented approval."],
        support: ["Dutch employment counsel", "People operations and payroll"],
        thresholds: [{ minHeadcount: 1, note: "Every termination should go through a controlled local review because process and documentation matter materially." }]
      },
      visa: { requirements: ["Confirm permit route and employer obligations before hiring or transfer.", "Track permit validity and sponsorship dependencies.", "Align immigration handling with payroll and onboarding."], documents: ["Permit documents", "Immigration support file", "Role justification"], timeTaken: "Immigration timelines vary but often add several weeks where sponsorship is required." },
      timeTaken: { hiring: "Hiring generally moves well when local contracts and payroll are ready, but immigration can extend timing.", termination: "Termination matters need controlled planning and local review rather than quick execution." },
      mobility: { guidelines: ["Review tax, payroll, immigration, and benefits effects before mobility decisions.", "Align host-entity and payroll treatment early.", "Escalate if remote work or assignments create cross-border exposure."], timeTaken: "Mobility reviews typically require several weeks when multiple functions need alignment." },
      performance: { guidelines: ["Use documented objectives, support, and review notes.", "Keep manager expectations and records consistent.", "Escalate before termination decisions on performance grounds."], timeTaken: "Performance processes should be documented over time with clear review stages." },
      terminationGrounds: { grounds: [{ title: "Performance", notes: "Use documented support and review history." }, { title: "Misconduct", notes: "Retain evidence and use local review on seriousness and process." }, { title: "Restructuring", notes: "Check process, consultation, and communications before action." }, { title: "Long-term incapacity", notes: "Use local legal and HR review before relying on this route." }] }
    },
    {
      code: "US", name: "United States", region: "Americas", entityModel: "US entity with state-specific overlays", riskLevel: "high", complexityReason: "Protected leave, retaliation exposure, state final-pay rules, and layoff sensitivity create high termination and restructuring risk.",
      operatingStatus: "current",
      statusLabel: "Current operation",
      labourCode: {
        overview: "A heavily state-influenced environment where hiring and separation controls depend on local overlays, classification, and protected activity risk.",
        keyThemes: ["State-specific compliance", "Wage and hour classification", "Protected leave and retaliation risk", "Final pay and RIF controls"],
        regulators: ["US Department of Labor", "EEOC", "State labour and tax agencies"],
        coreDocuments: ["Offer letter", "I-9 pack", "Termination memo", "Severance template"]
      },
      headcountBands: [{ max: 14, label: "Small employer" }, { max: 99, label: "Multi-state employer" }, { max: Infinity, label: "Scaled US workforce" }],
      entitySetup: {
        overview: "The United States is already operating, but entering a new state or using a new employing setup still needs structured registration, payroll, and policy readiness.",
        process: ["Confirm entity and state-employment model.", "Set up state registrations, payroll, benefits, contracts, and handbook controls.", "Validate HR, finance, and legal readiness before first hire in-state."],
        guidelines: ["State-specific design matters as much as federal design.", "Do not assume one-state processes are reusable without validation.", "Coordinate payroll, benefits, and legal review before offer release."],
        support: ["US employment counsel", "Payroll and benefits providers", "HR operations"],
        timeTaken: "A new state setup or employing-model change can take several weeks depending on registrations and vendor readiness."
      },
      hiring: {
        baseRisk: "medium",
        requirements: ["Determine employing entity, work state, and exempt status.", "Check pay transparency, background screening, wage notices, and immigration verification.", "Review whether scale changes benefits, leave, or handbook controls."],
        documents: ["Offer letter", "I-9 documents", "State wage notices", "Benefits and handbook acknowledgements"],
        process: ["Confirm state-specific path.", "Issue offer and complete checks.", "Finalize I-9, payroll, and benefits setup."],
        support: ["US employment counsel for multi-state or covenant issues.", "Payroll or benefits support for new state registrations."],
        thresholds: [{ minHeadcount: 15, note: "Anti-discrimination governance becomes more material and should be embedded into approvals." }, { minHeadcount: 50, note: "Larger workforces may trigger additional leave, reporting, and benefits considerations." }]
      },
      termination: {
        baseRisk: "high",
        requirements: ["Assess at-will limitations, protected activity, accommodation history, and final pay timing.", "Review documentation supporting the decision and consistency with prior cases.", "Escalate immediately for layoffs, executive exits, or retaliation risk."],
        documents: ["Termination memo and records", "State-specific final pay calculation", "Severance agreement", "Property return checklist"],
        process: ["Validate business rationale and legal risk.", "Prepare pay and communication materials.", "Conduct separation and complete shutdown steps."],
        support: ["US employment counsel for protected leave, retaliation, or RIF matters.", "Payroll and benefits support for final pay and continuation obligations."],
        thresholds: [{ minHeadcount: 50, note: "Large-scale exits should trigger structured federal and state review before communications are approved." }]
      },
      visa: { requirements: ["Assess work authorization path before approval.", "Track sponsorship dates and amendments.", "Coordinate immigration, payroll, and mobility teams for sponsored cases."], documents: ["I-9 and authorization records", "Petition file", "Business justification and approvals"], timeTaken: "Immigration processing timelines vary widely and can materially extend hiring or transfer dates." },
      timeTaken: { hiring: "Typical hiring takes 2 to 4 weeks.", termination: "Routine exits can be prepared quickly, but protected leave, investigations, or layoffs require more time." },
      mobility: { guidelines: ["Review tax, payroll, immigration, and classification impacts before relocation.", "Check state registration and payroll consequences of domestic moves.", "Escalate cross-border assignments early for immigration and permanent-establishment review."], timeTaken: "Mobility reviews can take from days to several weeks depending on state changes, immigration, and tax complexity." },
      performance: { guidelines: ["Use clear expectations and consistent documentation.", "Watch for overlap with protected leave, accommodations, or complaint activity.", "Legal review is recommended before terminating for performance in elevated-risk scenarios."], timeTaken: "Performance management timing should allow for coaching, documentation, and any protected-leave or accommodation review." },
      terminationGrounds: { grounds: [{ title: "Performance", notes: "Keep performance records, coaching history, and consistency checks before action." }, { title: "Misconduct", notes: "Investigate, preserve evidence, and assess proportionality and consistency." }, { title: "Layoff / RIF", notes: "Run structured legal review on selection, notice, and adverse-impact style risk." }, { title: "Policy violation", notes: "Confirm prior guidance, evidence, and consistent application." }] }
    },
    {
      code: "DE", name: "Germany", region: "EMEA", entityModel: "Potential acquisition target structure", riskLevel: "high", complexityReason: "Dismissal protections, works council exposure, and consultation obligations make termination and restructuring especially high risk.",
      operatingStatus: "planned",
      statusLabel: "Potential acquisition country",
      labourCode: {
        overview: "Germany is treated here as a potential acquisition country. Due diligence should anticipate a highly structured employment environment with strong documentation, consultation, and social-governance expectations.",
        keyThemes: ["Target-company employment due diligence", "Works council and consultation sensitivity", "Contract and policy localization", "Payroll, tax, and social insurance readiness"],
        regulators: ["Commercial registry and tax offices", "Social insurance agencies", "Local employment authorities"],
        coreDocuments: ["Due diligence checklist", "Local contract template", "Payroll and registration tracker", "Hiring governance checklist"]
      },
      headcountBands: [{ max: 9, label: "Target screening stage" }, { max: 49, label: "Focused diligence stage" }, { max: Infinity, label: "Complex diligence stage" }],
      entitySetup: {
        overview: "Before acquiring a German business, the team should diligence the target entity structure, inherited employment model, payroll and social insurance setup, employee relations governance, and post-close integration risk.",
        process: ["Identify target entities, employing structure, and workforce footprint.", "Collect due diligence records on payroll, contracts, policies, consultation exposure, and employee relations cases.", "Assess post-close remediation needs, integration sequencing, and approval controls before signing."],
        guidelines: ["Use German legal counsel before relying on target-company employment assumptions.", "Treat works-council and employee-representation exposure as a front-end diligence item.", "Separate pre-signing risk findings from post-close remediation planning."],
        support: ["German employment counsel", "M&A legal team", "Payroll and tax advisors", "People integration lead"],
        timeTaken: "Employment due diligence on an acquisition target usually runs over several weeks and may extend further where workforce structure or consultation exposure is complex."
      },
      hiring: {
        baseRisk: "high",
        requirements: ["Use locally reviewed contracts and compensation structures before hiring.", "Confirm payroll, tax, and social-insurance readiness before issuing offers.", "Build decision governance carefully because local process expectations are structured."],
        documents: ["Locally compliant contract", "Entity and payroll readiness checklist", "Candidate right-to-work documents", "Policy acknowledgement pack"],
        process: ["Confirm entity-readiness gate is complete.", "Issue locally reviewed offer and contract pack.", "Complete registrations and onboarding controls before start date."],
        support: ["German employment counsel", "Payroll and tax advisors"],
        thresholds: [{ minHeadcount: 1, note: "The first hire should always trigger a full legal, payroll, and governance review in a new market." }]
      },
      termination: {
        baseRisk: "high",
        requirements: ["Do not assume existing-country termination playbooks transfer directly.", "Use local legal review before any termination decision in a new German entity.", "Build documentation, consultation analysis, and approval controls from day one."],
        documents: ["Termination decision memo", "Supporting documentation and consultation review", "Final pay and exit checklist"],
        process: ["Confirm local legal basis and process path.", "Review consultation or representation implications.", "Only proceed after local counsel sign-off and documented approval."],
        support: ["German employment counsel", "HR operations and leadership approval"],
        thresholds: [{ minHeadcount: 1, note: "Every termination in a newly entered market should be treated as a controlled legal-review event." }]
      },
      visa: { requirements: ["Confirm target-company immigration exposure and sponsorship dependencies.", "Assess whether sponsor obligations or permit gaps will transfer post-close.", "Track long-lead immigration issues as part of diligence findings."], documents: ["Immigration diligence checklist", "Work authorization documents", "Sponsorship support file"], timeTaken: "Immigration diligence can add several weeks where sponsored populations or permit dependencies exist." },
      timeTaken: { hiring: "New hiring after acquisition should wait until target-company controls and post-close governance are understood.", termination: "Termination guidance should be treated as highly controlled and locally reviewed during diligence and early integration." },
      mobility: { guidelines: ["Review target-company mobility arrangements as part of diligence.", "Check whether current assignments create tax, payroll, or immigration exposure post-close.", "Escalate early for permanent-establishment and host-entity questions."], timeTaken: "Mobility diligence may take multiple weeks where cross-border assignees or permit transfers are in scope." },
      performance: { guidelines: ["Assess whether the target company has documented performance frameworks and case files.", "Train integration leaders on local expectations before taking action on inherited cases.", "Do not move from performance management to termination without local review."], timeTaken: "Inherited performance frameworks should be reviewed during diligence so post-close cases are not handled blind." },
      terminationGrounds: { grounds: [{ title: "Performance", notes: "Treat inherited performance cases as legally controlled and review before action." }, { title: "Misconduct", notes: "Diligence target-company investigation standards and open cases." }, { title: "Business restructuring", notes: "Review consultation and representation implications before any post-close action." }, { title: "Probation", notes: "Check inherited probation terms and local process expectations before relying on them." }] }
    },
    {
      code: "CA", name: "Canada", region: "Americas", entityModel: "Potential acquisition target structure", riskLevel: "moderate", complexityReason: "Province-specific notice, severance, and termination governance make exits and restructuring decisions more controlled and moderately elevated in risk.",
      operatingStatus: "planned",
      statusLabel: "Potential acquisition country",
      labourCode: {
        overview: "Canada is treated here as a potential acquisition country. Due diligence should assume province-specific employment standards, payroll setup, contract localization, and structured termination governance.",
        keyThemes: ["Province-specific diligence", "Payroll and tax registrations", "Contract and policy localization", "Termination and notice governance"],
        regulators: ["Federal and provincial employment authorities", "Tax and payroll agencies", "Immigration authorities where relevant"],
        coreDocuments: ["Due diligence checklist", "Province-specific hiring checklist", "Local contract template", "Termination governance checklist"]
      },
      headcountBands: [{ max: 9, label: "Target screening stage" }, { max: 49, label: "Focused diligence stage" }, { max: Infinity, label: "Complex diligence stage" }],
      entitySetup: {
        overview: "Before acquiring a Canadian business, the team should review target-entity structure, province-specific employment terms, payroll setup, inherited policies, and post-close remediation requirements.",
        process: ["Identify target entities, employing footprint, and province mix.", "Collect due diligence records on contracts, payroll, policies, notice practices, and active employee relations issues.", "Assess post-close remediation plan, integration sequencing, and approval controls before signing."],
        guidelines: ["Design diligence around province-specific requirements from the start.", "Do not assume US processes transfer into a Canadian acquisition target.", "Treat first-wave remediation planning as a cross-functional legal, finance, and HR milestone."],
        support: ["Canadian employment counsel", "M&A legal team", "Payroll and tax advisors", "People integration lead"],
        timeTaken: "Acquisition due diligence in Canada commonly takes multiple weeks depending on province spread, payroll setup, and inherited employee issues."
      },
      hiring: {
        baseRisk: "high",
        requirements: ["Localize contracts and province-specific employment terms before hiring.", "Confirm payroll and tax readiness before the first offer is released.", "Build province-aware guidance into manager approvals and onboarding."],
        documents: ["Locally compliant contract", "Province-specific onboarding checklist", "Payroll readiness file", "Policy acknowledgement pack"],
        process: ["Confirm diligence and post-close readiness gate is complete.", "Issue locally reviewed offer and contract pack.", "Complete payroll and onboarding readiness before start date."],
        support: ["Canadian employment counsel", "Payroll provider", "Benefits and HR operations"],
        thresholds: [{ minHeadcount: 1, note: "The first Canadian hire should always trigger a full legal, payroll, and HR-readiness review." }]
      },
      termination: {
        baseRisk: "high",
        requirements: ["Use local legal review before any termination decision in a new Canadian entity.", "Design notice, severance, and documentation controls before the first case arises.", "Do not assume US at-will concepts apply."],
        documents: ["Termination memo", "Notice or severance analysis", "Final pay and exit checklist"],
        process: ["Confirm province-specific legal basis and notice path.", "Review documentation and approval controls.", "Only proceed after local legal and leadership sign-off."],
        support: ["Canadian employment counsel", "Payroll and leadership review"],
        thresholds: [{ minHeadcount: 1, note: "Every termination in a newly entered market should be handled as a controlled legal-review workflow." }]
      },
      visa: { requirements: ["Confirm target-company work authorization and sponsorship exposure before hiring or transfer commitments.", "Align immigration diligence with payroll and target-entity structure.", "Build long-lead immigration issues into the diligence report."], documents: ["Immigration diligence checklist", "Work authorization documents", "Business justification and sponsorship approvals"], timeTaken: "Immigration findings can materially extend diligence or post-close remediation planning." },
      timeTaken: { hiring: "Hiring timelines are typically longer until diligence findings and post-close remediation plans are in place.", termination: "Termination planning should be treated as locally governed from the first inherited case." },
      mobility: { guidelines: ["Review target-company mobility arrangements during diligence.", "Use province-specific analysis for remote work or relocation exposure.", "Escalate early for cross-border assignments."], timeTaken: "Mobility diligence often requires multiple weeks across tax, immigration, and payroll." },
      performance: { guidelines: ["Assess inherited performance templates and manager guidance during diligence.", "Keep written documentation standards consistent from the beginning of integration.", "Escalate before moving from inherited performance management to termination."], timeTaken: "Performance diligence should happen up front so inherited cases do not become ad hoc compliance risks." },
      terminationGrounds: { grounds: [{ title: "Performance", notes: "Use a locally reviewed framework and assess inherited case files." }, { title: "Misconduct", notes: "Set investigation and evidence standards during diligence and integration planning." }, { title: "Restructuring", notes: "Review notice, severance, and communication planning carefully before post-close action." }, { title: "Probation", notes: "Check inherited probation terms and local review paths before relying on them." }] }
    },
  ]
};
