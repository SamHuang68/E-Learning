type ScenarioCopy = {
  title: string
  tip?: string
}

const SCENARIO_COPY: Readonly<Record<string, ScenarioCopy>> = {
  'chart-q-revenue-q3': {
    title: 'Quarterly Regional Revenue Bar Chart Analysis',
  },
  'chart-q-market-share': {
    title: 'Cloud Computing Provider Market-Share Pie Chart',
  },
  'cold-chain-air-freight': {
    title: 'Ultra-Cold Vaccine Air-Freight Tracking and Temperature-Excursion Reporting',
    tip: 'Key TOEIC terms include consignment, air waybill (AWB), temperature excursion, quarantine, and underwriter.',
  },
  'conf-screen-sharing': {
    title: 'Multinational Video Conference: Screen Sharing and Presentation Q&A',
    tip: 'Modern TOEIC questions frequently use on mute, share one’s screen, and open the floor for questions.',
  },
  'conflict-minerals-audit': {
    title: 'Smartphone-Chip Sourcing: Conflict-Free 3TG Minerals and Supplier Labour Audits',
    tip: 'Key TOEIC terms include due diligence, conflict-free minerals, smelter, refiner, compliance audit, and remediate.',
  },
  'cyber-phishing-breach': {
    title: 'Phishing Simulation and Mandatory Hardware Two-Factor Authentication',
    tip: 'Key TOEIC terms include two-factor authentication, credential theft, scheduled maintenance, and system downtime.',
  },
  'dp-procurement-logistics': {
    title: 'Office-Equipment Supply Contract and Delivery-Change Notice',
  },
  'esg-carbon-accounting': {
    title: 'Annual ESG Assurance and Scope 3 Supply-Chain Carbon Accounting',
    tip: 'Key TOEIC terms include sustainability, carbon footprint, carbon offset, Scope 1, 2, and 3 emissions, and compliance.',
  },
  'fcpa-anti-corruption-audit': {
    title: 'Multinational Tender Review: Third-Party Success Fees and FCPA Bribery Red Flags',
    tip: 'Key TOEIC terms include the Foreign Corrupt Practices Act (FCPA), red flag, beneficial ownership, facilitation payment, and code of ethics.',
  },
  'force-majeure-claim': {
    title: 'Storm-Related Supply Disruption: Force Majeure Notice and Cargo Insurance Claim',
    tip: 'Key TOEIC terms include force majeure, act of God, excusable delay, claims adjuster, and deductible.',
  },
  'gdpr-privacy-compliance': {
    title: 'Cross-Border Cloud Data: GDPR Contract Clauses and the 72-Hour Breach Notice Rule',
    tip: 'Key TOEIC terms include compliance, data breach, supervisory authority, data subject, Standard Contractual Clauses (SCCs), and turnover.',
  },
  'interview-senior-analyst': {
    title: 'Senior Data Analyst Interview, Compensation, and Benefits',
    tip: 'Key TOEIC terms include probationary period, benefits package, spearhead, on-premises, and cloud.',
  },
  'ip-licensing-agreement': {
    title: 'Global Non-Exclusive Licence and Royalty Negotiation for a Biomedical-Chip Patent',
    tip: 'Key TOEIC terms include intellectual property, patent infringement, royalty fee, and non-exclusive licence.',
  },
  'lc-discrepancy-late-shipment': {
    title: 'Letter-of-Credit Discrepancy: Late Bill-of-Lading Date and Issuing-Bank Refusal',
    tip: 'Key TOEIC terms include irrevocable letter of credit, UCP 600, discrepant documents, bill of lading, notice of refusal, and shipping guarantee.',
  },
  'marine-insurance-general-average': {
    title: 'Emergency Cargo Jettison: General Average Declaration and Cargo-Owner Security',
    tip: 'Key TOEIC terms include General Average, jettison, the York-Antwerp Rules, salvage expenses, and a General Average Guarantee.',
  },
  'mkt-eco-smartwatch': {
    title: 'Eco-Friendly Smartwatch Social Campaign and Launch Event',
    tip: 'Key TOEIC terms include click-through rate (CTR), target audience, launch event, and brand awareness.',
  },
  'mna-due-diligence': {
    title: 'Cross-Border Semiconductor Acquisition: Due Diligence and Regulatory Review',
    tip: 'Key TOEIC terms include due diligence, acquisition, synergy, and antitrust clearance.',
  },
  'nda-trade-secrets-breach': {
    title: 'Strategic-Alliance NDA: Confidentiality Term and Liquidated Damages',
    tip: 'Key TOEIC terms include mutual NDA, proprietary, trade secret, liquidated damages, covenant, and destruction upon termination.',
  },
  'patent-litigation-injunction': {
    title: 'Semiconductor Patent Litigation: Preliminary Injunction and Prior-Art Invalidity Defence',
    tip: 'Key TOEIC terms include infringement, preliminary injunction, irreparable harm, prior art, invalidity, obviousness, and inter partes review (IPR).',
  },
  'phone-reschedule': {
    title: 'Project-Meeting Reschedule Voicemail',
  },
  'pr-product-launch': {
    title: 'Global Eco-Product Launch: Press Release, Media Kit, and Embargo',
    tip: 'Key TOEIC terms include press release, embargo, media kit, and spokesperson.',
  },
  're-office-expansion': {
    title: 'City-Centre Office Lease and Rent-Free Fit-Out Negotiation',
    tip: 'Key TOEIC terms include commercial lease, rent-free fit-out period, square footage, and concession.',
  },
  'rfp-vendor-evaluation': {
    title: 'Multinational Systems-Integration RFP: Bid Evaluation and Contract Terms',
    tip: 'Key TOEIC terms include Request for Proposal (RFP), sealed bid, weighted matrix, liquidated damages, and preferred bidder.',
  },
  'royalty-audit-underpayment': {
    title: 'Patent Royalty Audit: 18% Sales Underreporting and Audit-Fee Shifting',
    tip: 'Key TOEIC terms include royalty audit, underreported sales, contractual breach, audit-fee shifting, and forensic accounting.',
  },
  'sc-freight-delay': {
    title: 'Container Customs Delay and Emergency Air-Freight Plan',
    tip: 'Key TOEIC terms include freight forwarder, customs backlog, safety stock, and Net 30 payment terms.',
  },
  'tech-transfer-escrow': {
    title: 'Semiconductor Technology Transfer: Source-Code Escrow and Bankruptcy Protection',
    tip: 'Key TOEIC terms include technology transfer, escrow, liquidation, bankruptcy, confidentiality, NDA, and trade secret.',
  },
  'trade-incoterms-cif': {
    title: 'International Trade Terms: FOB versus CIF and Customs Documentation',
    tip: 'Key TOEIC terms include Incoterms, FOB, CIF, bill of lading (B/L), and Certificate of Origin.',
  },
  'travel-flight-upgrade': {
    title: 'Airport Check-In and Complimentary Business-Class Upgrade',
    tip: 'Key TOEIC terms include checked through, aisle seat, and boarding pass.',
  },
}

const QUESTION_EXPLANATION: Readonly<Record<string, string>> = {
  'Which regional division will receive the annual performance bonus?':
    'Asia-Pacific recorded $58 million in revenue, exceeding the $50 million performance-bonus threshold shown in the chart.',
  'Which provider is targeted for the proposed merger?':
    'The text identifies the second-largest provider as the merger target; the pie chart shows Beta Services in second place with a 25% share.',
  'What temperature requirement was monitored during the transatlantic flight?':
    'Alistair states that the cryogenic containers maintained the required temperature of minus seventy degrees Celsius throughout the flight.',
  'What immediate action is required if a temperature excursion occurs?':
    'The protocol requires the cargo to be quarantined immediately and a claim to be filed with the marine and air cargo underwriter.',
  'What does the meeting host ask attendees to do at the beginning?':
    'The host asks anyone with background noise to put their microphone on mute.',
  'What happened during the peak traffic period according to Rachel?':
    'Rachel says that server response times dipped slightly during peak traffic.',
  'What positive finding did the ESG compliance lead report regarding the capacitor smelters?':
    'Alistair reports that all forty-two smelters and refiners in the tier-one supply chain were validated as conflict-free by the RMI.',
  'How quickly were the minor safety infractions remediated at the manufacturing plants?':
    'Alistair says that the minor emergency-exit signage infractions were remedied within forty-eight hours.',
  'What security policy has management decided to mandate immediately?':
    'Management mandated the immediate rollout of hardware-based two-factor authentication.',
  'What should department heads remind their teams to do before Saturday?':
    'Department heads should remind their teams to back up all active project files before the scheduled downtime.',
  'Which category of emissions is currently presenting a measurement challenge for the company?':
    'Raymond identifies indirect Scope 3 emissions from overseas logistics partners as the company’s complex measurement challenge.',
  'Why is verified carbon accounting especially urgent for the organization?':
    'The European Union’s Carbon Border Adjustment Mechanism will soon require verified carbon declarations.',
  "What specific red flag triggered the compliance department's intervention?":
    'The red flag was a $300,000 success fee for a local third-party consultant who refused to disclose beneficial ownership.',
  "What is the company's policy regarding third-party compensation under the FCPA guidelines?":
    'Compensation must reflect fair market value for documented legitimate services, and every third party must sign a certified anti-bribery undertaking.',
  'Under what condition does the force majeure clause exempt the logistics provider from delayed penalties?':
    'The exemption applies only when prompt written notice is served within forty-eight hours.',
  'What financial deduction applies to the marine insurance claim for the lost cargo?':
    'The claim covers the natural-disaster loss subject to a standard £5,000 deductible.',
  'Under GDPR regulations, within how many hours must a data breach be reported to the supervisory authority?':
    'Article 33 requires the breach to be reported to the lead supervisory authority within seventy-two hours after it becomes known.',
  'What mechanism was executed to legally transfer European customer telemetry to the provider in Singapore?':
    'The legal team completed a transfer impact assessment and executed Standard Contractual Clauses within the corporate framework.',
  'What accomplishment does Arthur highlight from his previous role?':
    'Arthur led the migration from on-premises servers to a cloud data warehouse, reducing query latency by thirty percent.',
  'What is mentioned about the employment terms?':
    'The position includes a three-month probationary period.',
  'What financial compensation will Orion Healthcare provide under the licensing contract?':
    'Orion will pay a $2 million upfront licence fee plus a quarterly running royalty of 4% of net sales.',
  'What legal action will Orion Healthcare take regarding existing disputes?':
    'Orion agreed to formally dismiss all outstanding patent-infringement litigation that is currently pending.',
  'What specific discrepancy was discovered on the ocean bill of lading?':
    'The bill of lading shows August 24, four days after the latest shipment date specified in field 44C of the letter of credit.',
  'What arrangement is suggested if the buyer wishes to collect the cargo before resolving the payment dispute?':
    'The buyer’s bank can issue a shipping guarantee so the containers may be released before the payment dispute is settled.',
  "Why did the ship's captain formally declare General Average?":
    'During a severe cyclone, the captain voluntarily jettisoned forty heavy containers to stabilize the listing hull and save the crew.',
  'What action must Thomas take to obtain the release of the intact machinery containers at the port?':
    'Thomas must have the marine underwriters issue a General Average Guarantee and deposit the required cash bond.',
  'What strategy are the influencers using on the launch day?':
    'The influencers will publish their unboxing reviews simultaneously on launch day to maximize social-media reach.',
  'What positive indicator did early email teasers show?':
    'The early email teasers produced a click-through rate twenty-five percent higher than the previous year’s release.',
  'What positive conclusion did the financial due diligence team reach?':
    'The team concluded that the target’s proprietary packaging technology aligns with the expected manufacturing synergies.',
  'What milestone is required before presenting the tender offer to the board?':
    'The company must obtain antitrust clearance from the regulatory commissions in both Brussels and Washington.',
  'What modification requested by the prospective partner Orion Robotics was deemed unacceptable?':
    'Orion’s request to shorten the confidentiality period from five years to two years was deemed unacceptable.',
  'What remedy does the agreement specify in the event of an unauthorized disclosure of trade secrets?':
    'The agreement retains liquidated damages of $2 million for each unauthorized disclosure.',
  "Why did the federal district judge deny the plaintiff's motion for a preliminary injunction?":
    'The judge denied the motion because the plaintiff failed to establish irreparable harm.',
  'What evidence did the defense team uncover to petition for inter partes review?':
    'The technical experts found three critical prior-art papers published eighteen months before the plaintiff’s priority filing date.',
  'Why is the caller unable to attend the scheduled meeting?':
    'The voicemail says that the caller’s connecting flight from Chicago has been delayed.',
  'What time does Evelyn suggest for the rescheduled meeting?':
    'Evelyn proposes rescheduling the meeting for Thursday morning at 10:00 a.m.',
  'When will journalists be allowed to publish articles about the new product?':
    'The press embargo lifts at precisely 9:00 a.m. tomorrow, Central European Time.',
  'What materials are included in the digital media kit?':
    'The media kit contains high-resolution product photography, executive biographies, and technical specifications.',
  "What concession has the landlord offered to assist with the tenant's renovations?":
    'The landlord offered a two-month rent-free fit-out period.',
  'Why does Ms. Warren need dedicated meeting pods and custom wiring?':
    'Ms. Warren explains that her engineering team has expanded rapidly.',
  'According to the evaluation matrix, which criterion carries the highest weight?':
    'Technical architecture carries 40% of the score, more than price at 30% or the service-level agreement at 20%.',
  'What contractual provision must be finalized before signing the Master Services Agreement?':
    'The contract must include liquidated damages of 1% per day for any delivery-milestone delay.',
  'What did the forensic audit discover regarding Apex Microelectronics?':
    'The audit found that Apex underreported worldwide net sales by eighteen percent over the previous three fiscal quarters.',
  'Why is Apex Microelectronics required to pay for the eighty-five thousand dollar audit fee?':
    'Its reporting shortfall exceeded the 5% threshold in section 8.4, triggering the audit-fee-shifting clause.',
  'Why was the container held up at the port?':
    'The container was held at customs because of an inspection backlog.',
  'What solution does Fiona propose to avoid shutting down the assembly line?':
    'Fiona proposes immediately air-freighting a partial shipment of two thousand units.',
  'Where will the licensor deposit the proprietary source code and architectural blueprints?':
    'The licensor agreed to place the source code and architectural blueprints in an independent third-party escrow account.',
  'Under what specific condition will the escrowed codebase be released to the licensee?':
    'The code is released only if the licensor enters liquidation, declares bankruptcy, or fails to provide bug patches for ninety consecutive calendar days.',
  'Under the revised CIF terms, what additional responsibility does the seller take on?':
    'The seller assumes the freight charges and marine insurance until the shipment reaches the Port of Hamburg.',
  "What document must the client's customs broker receive before next Tuesday?":
    'The customs broker needs the certified Certificate of Origin and finalized commercial invoice before the vessel docks next Tuesday.',
  'Why does the passenger receive a complimentary upgrade?':
    'The passenger receives the complimentary upgrade because he is an Executive Gold member.',
  'Where will the passenger collect his checked luggage?':
    'The bags are checked through to the final destination, so he will collect them in Zurich.',
  'What is the total delivery surcharge that Nexus Tech will incur for the revised date?':
    'Passage 1 sets a $150 weekend-delivery surcharge, and Passage 2 requests delivery on Saturday, October 11; Nexus therefore incurs $150.',
  'Why does Clara Vance request an earlier delivery?':
    'Passage 2 states directly that the office renovation finished ahead of schedule; none of the other choices appears in either passage.',
  'Does the complimentary expedited freight still apply after the date change?':
    'Although orders over $5,000 qualify for complimentary expedited freight, the Saturday request triggers the specific $150 weekend-handling surcharge.',
  'What is the original scheduled delivery date mentioned implicitly?':
    'Passage 1 sets October 15 as the original deadline, and Passage 2 refers to replacing that original date.',
  'Which party is responsible for confirming the surcharge on the invoice?':
    'Clara asks the Apex team to confirm the charge and include it on the final invoice, so Apex Solutions is responsible.',
  'What inference can be drawn about the total order value?':
    'The order qualifies for the over-$5,000 freight benefit; the weekend surcharge is a separate exception, so the order value exceeds $5,000.',
  'How does the payment term interact with the delivery change?':
    'Payment remains due within thirty days after receipt of the final shipment; the delivery-date change does not alter that independent contract term.',
}

const SYNONYM_MEANING: Readonly<Record<string, string>> = {
  conclude: 'to finish or bring something to an end',
  complimentary: 'provided free of charge',
}

const EMAIL_COPY: Readonly<Record<string, {
  title: string
  quizQuestion: string
  quizExplanation: string
}>> = {
  'email-inquiry': {
    title: 'Product Pricing and Delivery Lead-Time Inquiry',
    quizQuestion: 'Which sentence is the best formal opening for a business email that asks for information?',
    quizExplanation: '“I am writing to inquire about...” is the standard formal opening most frequently tested in TOEIC Part 7.',
  },
  'email-apology': {
    title: 'Service Interruption Apology and Account-Credit Notice',
    quizQuestion: 'Which opening is most appropriate for a sincere, formal apology to a corporate customer?',
    quizExplanation: '“Please accept our sincere apologies for...” is the appropriate formula for a formal corporate apology.',
  },
}

const EMAIL_PURPOSE: Readonly<Record<string, string>> = {
  'I am writing to inquire about...':
    'A standard formal opening that states the purpose of an inquiry directly.',
  'Could you please provide a formal quotation...':
    'A courteous standard phrase for requesting a quotation or supporting information.',
  'We would appreciate receiving this information by...':
    'A professional way to specify a response deadline without sounding abrupt.',
  'Please accept our sincere apologies for...':
    'A highly formal expression used in an organization’s official apology.',
  'To compensate for any inconvenience caused...':
    'A standard transition for offering a remedy such as a discount, credit, or replacement.',
}

const NEGOTIATION_COPY: Readonly<Record<string, { meaning: string; context: string }>> = {
  'chunk-meet-halfway': {
    meaning: 'to compromise by each side making a concession',
    context: 'Use it when price or contract negotiations have stalled and both sides propose concessions to reach a workable middle ground.',
  },
  'chunk-contingent-upon': {
    meaning: 'dependent on a stated condition being satisfied',
    context: 'Use it in a contract when an obligation or approval takes effect only after a condition such as board approval or an external audit is met.',
  },
  'chunk-bottom-line': {
    meaning: 'the final profit figure, essential conclusion, or non-negotiable limit',
    context: 'It can refer to net profit on the last line of a financial statement or to a party’s non-negotiable position in a negotiation.',
  },
  'chunk-touch-base': {
    meaning: 'to make brief contact and exchange updates',
    context: 'Use it for a short, friendly but professional progress check with a client, colleague, or manager.',
  },
}

const WEEK_COPY: Readonly<Record<string, { title: string; subtitle: string }>> = {
  '1': {
    title: 'Workplace Follow-Ups',
    subtitle: 'Practise five essential business responses: investigate a cause, follow progress, check with someone, take responsibility, and reply after confirming the facts.',
  },
  '2': {
    title: 'Business Negotiation and Contract Signing',
    subtitle: 'Negotiation, proposal drafting, and finalizing contract terms.',
  },
}

const CHUNK_COPY: Readonly<Record<string, { meaning: string; action: string }>> = {
  'get-back-to-you': {
    meaning: 'to reply after checking the information',
    action: 'Use it when you cannot answer immediately and need to verify facts before responding.',
  },
  'follow-up-on': {
    meaning: 'to check progress or take the next action on something',
    action: 'Use it after a message, order, or project is already under way and you need the latest status.',
  },
  'look-into': {
    meaning: 'to investigate a problem or find its cause',
    action: 'Use it for a complaint, anomaly, or system error that requires investigation.',
  },
  'check-in-with': {
    meaning: 'to contact someone briefly for an update',
    action: 'Use it for a friendly, lightweight status check with a specific person.',
  },
  'take-care-of': {
    meaning: 'to accept responsibility for and complete a task',
    action: 'Use it when you take ownership of a task and reassure the other person that you will handle it.',
  },
  'reach-an-agreement': {
    meaning: 'to reach a shared decision or formal agreement',
    action: 'Use it when the parties finally arrive at the same position after discussion or negotiation.',
  },
  'draft-a-proposal': {
    meaning: 'to prepare the first version of a proposal',
    action: 'Use it when beginning a proposal or project outline before formal presentation or submission.',
  },
  'finalize-the-terms': {
    meaning: 'to settle the final details of an agreement',
    action: 'Use it at the final contract-review stage when pricing, responsibilities, delivery, or other specific terms are being confirmed.',
  },
}

const RHYTHM_NOTE: Readonly<Record<string, string>> = {
  'get BACK to you': 'Stress BACK. In natural speech, to is usually reduced to /tə/.',
  'FOLLOW UP on': 'Link follow and up smoothly as /fɑː.loʊ.wʌp/, with the main stress early in the phrase.',
  'LOOK INto': 'Stress LOOK and connect it smoothly into into while keeping the investigative action prominent.',
  'CHECK IN with': 'Link check and in smoothly as /tʃek.ɪn/.',
  'take CARE of': 'Stress CARE and reduce of to /əv/.',
  'reach an a-GREE-ment': 'Link reach and an as /riːtʃən/ and place the main stress on GREE.',
  'DRAFT a pro-PO-sal': 'Pronounce DRAFT crisply and stress the second syllable, PO, in proposal.',
  'FI-na-lize the TERMS': 'Stress FI and TERMS, and reduce the.',
}

const USAGE_EXPLANATION: Readonly<Record<string, string>> = {
  'get back to + 人 + [by 時間 / with 細節]':
    'Follow get back to with the person receiving the reply; use get back to me for yourself. Adding a deadline such as by noon makes the commitment more professional.',
  'follow up on + 事情 / 專案 / 郵件':
    'The noun form is a follow-up. The phrase is essential when checking a client, quotation, contract, or other pending matter.',
  'look into + 問題 / 原因 / 狀況':
    'Look into signals a more active and thorough investigation than check, which conveys responsibility to a manager or customer.',
  'check in with + 人 + [about 事情]':
    'This phrase sounds friendly and natural, and is less formal than inquire.',
  'take care of + 任務 / 帳單 / 客戶 / 問題':
    'A high-frequency phrase that communicates initiative, ownership, and follow-through.',
  'reach an agreement on/with [terms/party]':
    'A frequent TOEIC Part 4 and Part 7 phrase for reaching a formal conclusion in a negotiation.',
  'draft a proposal for [project/client]':
    'As a verb, draft means to prepare a first version; it is common in office collaboration and business-development contexts.',
  'finalize the terms of the contract/agreement':
    'Finalize means to settle something in its final form, and terms means contractual conditions; the phrase is common in TOEIC Part 6 and Part 7 passages.',
}

const EXAMPLE_NOTE: Readonly<Record<string, string>> = {
  "I'll check the inventory and get back to you by noon.":
    'By noon states the latest response time and gives a clear deadline.',
  'Let me look into the issue and get back to you.':
    'A standard professional response when an unexpected issue arises during a meeting.',
  "She promised she'd get back to me before the end of the day.":
    'Use get back to me when the person will reply to you.',
  'I am writing to follow up on our discussion last Tuesday.':
    'A classic opening sentence in a business follow-up email.',
  'Could you follow up on the quote we sent to the client?':
    'A standard way to ask a colleague to check the status of a pending item.',
  'We need to follow up on this lead as soon as possible.':
    'In business, lead means a potential sales opportunity or prospective customer.',
  'Our technical team is looking into the server outage.':
    'Standard wording for a system-outage notice.',
  "I'll look into the discrepancy in the invoice.":
    'Discrepancy means an inconsistency in figures or accounts.',
  'Please rest assured that we are looking into this matter.':
    'A professional assurance used to reassure a customer while an issue is investigated.',
  'Just checking in to see how the project is going.':
    'A practical, friendly opening for a brief status check.',
  'Everything has already been taken care of.':
    'The passive present-perfect form is especially common for reporting completed handling.',
}

const PITFALL_REASON: Readonly<Record<string, string>> = {
  'I will return you later.':
    'Return usually means to give an item back or go back to a place. For replying or calling later, use get back to someone.',
  'I want to track this letter.':
    'Track commonly describes physical shipment tracking. For monitoring the progress of a business matter, use follow up on.',
  'I will see this problem.':
    'See only describes perception and does not convey active investigation. Use look into for investigating a business problem.',
  'I will ask with Sarah.':
    'Ask does not combine with with in this way. Use check in with someone for a brief status check.',
  'I will handle to this matter.':
    'Handle takes a direct object without to; alternatively, use take care of.',
  '❌ make an agreement with a price（受詞搭配不精確）':
    'For a price, say reach an agreement on the price rather than make an agreement with a price.',
  '❌ write a proposal paper（過於口語贅字）':
    'In business English, draft a proposal or submit a proposal is sufficient; paper is redundant.',
  '❌ final the terms（詞性混淆）':
    'Final is an adjective; use the verb finalize.',
}

const PRODUCTION_PROMPT: Readonly<Record<string, string>> = {
  "I'll check the data and get back to you before the end of the day.":
    'Say that you will check the data first and reply before the workday ends.',
  "He promised he'd get back to us tomorrow morning.":
    'Report that he promised to reply to the group tomorrow morning.',
  'Please follow up on the delivery status of this order by Friday.':
    'Ask someone to check the delivery status of this order by Friday.',
  'We will look into the cause of this delay immediately.':
    'State that the team will investigate the cause of this delay immediately.',
  "I'll check in with the project manager about the budget later.":
    'Say that you will contact the project manager later to ask about the budget.',
  'The invoices have all been taken care of.':
    'State that every invoice issue has now been fully handled.',
  'We are close to reaching an agreement on the new contract.':
    'Say that the parties are close to agreeing on the new contract.',
  'I will draft a proposal this week.':
    'Say that you will prepare a written proposal during the current week.',
  'We need to finalize the terms of the contract.':
    'State that the contract terms still need to be completed and confirmed.',
}

const MICRO_STORY_COPY: Readonly<Record<string, { title: string; scenario: string }>> = {
  'A Busy Monday Morning (忙碌的週一早晨)': {
    title: 'A Busy Monday Morning',
    scenario: 'Use all five core chunks in one realistic office sequence to practise choosing the right action and moving coherently between tasks.',
  },
  'The Merger Agreement': {
    title: 'The Merger Agreement',
    scenario: 'Apex Corp and Horizon Tech spend three weeks negotiating the contract and finalizing its terms.',
  },
}

const DECISION_COPY: Readonly<Record<string, { signal: string; rule: string }>> = {
  'look into': {
    signal: 'The cause is not yet known and needs investigation.',
    rule: 'I do not yet know why it happened, so I will investigate.',
  },
  'follow up on': {
    signal: 'A message or project is already in progress and needs a status check.',
    rule: 'The matter is already under way, so I will monitor the next steps.',
  },
  'check in with': {
    signal: 'A specific person needs a friendly, lightweight status check.',
    rule: 'I will contact the relevant colleague or customer for an update.',
  },
  'take care of': {
    signal: 'Someone accepts ownership and will complete the task.',
    rule: 'I will take responsibility for handling this matter.',
  },
  'get back to you': {
    signal: 'An immediate answer is unavailable, so a reply will follow after checking.',
    rule: 'I will verify the information and then return with an answer.',
  },
  'reach an agreement': {
    signal: 'The parties arrive at the same position after negotiation.',
    rule: 'Both sides agree and make the decision final.',
  },
  'draft a proposal': {
    signal: 'Work begins on a proposal or collaboration draft.',
    rule: 'Start writing the proposed plan.',
  },
  'finalize the terms': {
    signal: 'The final detailed terms are confirmed before signing.',
    rule: 'Settle the contract language and allocation of responsibility.',
  },
}

function stringValue(parent: Record<string, unknown>, key: string): string | null {
  const value = parent[key]
  return typeof value === 'string' ? value : null
}

/** Resolves exact English support copy from stable target-language or identity fields. */
export function resolveToeicSupportEnglish(
  key: string,
  parent: Record<string, unknown>,
): string | null {
  const id = stringValue(parent, 'id')
  const scenario = id ? SCENARIO_COPY[id] : undefined
  if (scenario && (key === 'title' || key === 'titleJa')) return scenario.title
  if (scenario && /TipsJa$/.test(key)) return scenario.tip ?? null

  const question = stringValue(parent, 'question')
  if (question && (key === 'explanationZh' || key === 'explanationJa')) {
    return QUESTION_EXPLANATION[question] ?? null
  }

  const wordInP1 = stringValue(parent, 'wordInP1')
  if (wordInP1 && (key === 'meaningZh' || key === 'meaningJa')) {
    return SYNONYM_MEANING[wordInP1] ?? null
  }

  const email = id ? EMAIL_COPY[id] : undefined
  if (email && (key === 'title' || key === 'titleJa')) return email.title
  if (key === 'subjectLineJa') return stringValue(parent, 'subjectLine')

  const phrase = stringValue(parent, 'phraseEn')
  if (phrase && key === 'purposeJa') return EMAIL_PURPOSE[phrase] ?? null

  if (Array.isArray(parent.options) && typeof parent.correctIndex === 'number') {
    const correct = parent.options[parent.correctIndex]
    if (typeof correct === 'string') {
      const owner = Object.values(EMAIL_COPY).find((copy) =>
        correct === 'I am writing to inquire about...'
          ? copy === EMAIL_COPY['email-inquiry']
          : correct === 'Please accept our sincere apologies for...'
            ? copy === EMAIL_COPY['email-apology']
            : false,
      )
      if (owner && (key === 'questionZh' || key === 'questionJa')) return owner.quizQuestion
      if (owner && key === 'clueExplanationJa') return owner.quizExplanation
    }
  }

  const negotiation = id ? NEGOTIATION_COPY[id] : undefined
  if (negotiation && (key === 'meaningZh' || key === 'meaningJa')) return negotiation.meaning
  if (negotiation && (key === 'businessContextZh' || key === 'businessContextJa')) {
    return negotiation.context
  }

  if (typeof parent.weekId === 'number') {
    const week = WEEK_COPY[String(parent.weekId)]
    if (week && (key === 'themeTitle' || key === 'themeTitleJa')) return week.title
    if (week && (key === 'themeSubtitle' || key === 'themeSubtitleJa')) return week.subtitle
  }

  const chunk = id ? CHUNK_COPY[id] : undefined
  if (chunk && (key === 'meaningZh' || key === 'meaningJa')) return chunk.meaning
  if (chunk && (key === 'actionSignal' || key === 'actionSignalJa')) return chunk.action

  const stress = stringValue(parent, 'stress')
  if (stress && (key === 'note' || key === 'noteJa')) return RHYTHM_NOTE[stress] ?? null

  const pattern = stringValue(parent, 'pattern')
  if (pattern && (key === 'explanation' || key === 'explanationJa')) {
    return USAGE_EXPLANATION[pattern] ?? null
  }

  const example = stringValue(parent, 'en')
  if (example && key === 'note') return EXAMPLE_NOTE[example] ?? null

  const wrong = stringValue(parent, 'wrong')
  if (wrong && (key === 'reason' || key === 'reasonJa')) return PITFALL_REASON[wrong] ?? null

  const answer = stringValue(parent, 'answerEn')
  if (answer && (key === 'promptZh' || key === 'promptJa')) {
    return PRODUCTION_PROMPT[answer] ?? null
  }

  const storyTitle = stringValue(parent, 'title')
  const story = storyTitle ? MICRO_STORY_COPY[storyTitle] : undefined
  if (story && key === 'title') return story.title
  if (story && key === 'scenario') return story.scenario

  const decisionChunk = stringValue(parent, 'chunk')
  const decision = decisionChunk ? DECISION_COPY[decisionChunk] : undefined
  if (decision && key === 'signal') return decision.signal
  if (decision && key === 'threeSecondRule') return decision.rule

  return null
}
