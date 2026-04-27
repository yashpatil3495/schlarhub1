export const SCHOLARSHIPS = [
  // ── LIVE NOW (2026) ──────────────────────────────────────────
  {
    id: "nsp-css-2026", name: "Central Sector Scheme of Scholarships 2026-27", provider: "MHRD / NSP",
    type: "government", field: ["engineering","medical","science","arts","commerce"],
    level: ["undergraduate"], categories: ["general","obc","sc","st","ews"],
    states: ["all"], amount: "₹12,000/year", amount_value: 12000,
    deadline: "2026-10-31", open_date: "2026-04-01", renewable: true,
    eligibility_summary: "For students scoring top 20 percentile in Class 12 board exams. Family income must be below ₹8 LPA. Mandatory NSP OTR registration required.",
    min_marks_percent: 80, max_family_income_lpa: 8, difficulty: "easy",
    success_rate_estimate: 72, selection_process: "merit",
    required_documents: ["Aadhaar Card","Class 12 Marksheet","Income Certificate","Bank Passbook","Admission Letter"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 45, tags: ["government","renewable","merit","nsp","live2026"],
    faq: [{ q: "Is it renewable?", a: "Yes, if you maintain minimum marks each year." }]
  },
  {
    id: "pm-yasasvi-2026", name: "PM YASASVI Scholarship 2026-27", provider: "Ministry of Social Justice",
    type: "government", field: ["engineering","medical","arts","science","commerce","law"],
    level: ["class9-10","class11-12","undergraduate"], categories: ["obc","ews"],
    states: ["all"], amount: "₹75,000–₹1,25,000/year", amount_value: 75000,
    deadline: "2026-09-30", open_date: "2026-04-15", renewable: true,
    eligibility_summary: "For OBC/EWS students in class 9 to undergraduate. Income ceiling ₹2.5 LPA. Mandatory NSP OTR required.",
    min_marks_percent: 60, max_family_income_lpa: 2.5, difficulty: "easy", success_rate_estimate: 65, selection_process: "merit",
    required_documents: ["Aadhaar Card","OBC/EWS Certificate","Income Certificate","Marksheet","Bank Passbook"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 40, tags: ["government","obc","ews","central","live2026"],
    faq: [{ q: "Is it available for postgraduate students?", a: "No, only up to undergraduate level." }]
  },
  {
    id: "inspire-dst-2026", name: "INSPIRE Scholarship for Higher Education 2026", provider: "Dept. of Science & Technology",
    type: "government", field: ["science"],
    level: ["undergraduate","postgraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "₹80,000/year", amount_value: 80000,
    deadline: "2026-10-15", open_date: "2026-04-10", renewable: true,
    eligibility_summary: "For students who scored top 1% in Class 12 and enrolled in science programs at reputed institutions.",
    min_marks_percent: 90, max_family_income_lpa: 999, difficulty: "medium", success_rate_estimate: 40, selection_process: "merit",
    required_documents: ["Aadhaar","Class 12 Marksheet","Admission Letter","Research Proposal"],
    application_link: "https://online-inspire.gov.in/", official_portal: "http://www.inspire-dst.gov.in",
    apply_time_minutes: 60, tags: ["science","DST","merit","renewable","live2026"],
    faq: [{ q: "Is there a research component?", a: "Yes, a summer research internship is required." }]
  },
  {
    id: "aicte-pragati-2026", name: "AICTE Pragati Scholarship for Girls 2026", provider: "AICTE",
    type: "government", field: ["engineering"],
    level: ["undergraduate"], categories: ["women"],
    states: ["all"], amount: "₹50,000/year", amount_value: 50000,
    deadline: "2026-09-20", open_date: "2026-04-01", renewable: true,
    eligibility_summary: "For female students in AICTE-approved engineering colleges. Mandatory NSP OTR registration required.",
    min_marks_percent: 0, max_family_income_lpa: 8, difficulty: "easy", success_rate_estimate: 68, selection_process: "merit",
    required_documents: ["Aadhaar","Income Certificate","Admission Letter","Bank Passbook","Family Declaration"],
    application_link: "https://scholarships.gov.in/",
    official_portal: "https://www.aicte-india.org",
    apply_time_minutes: 40, tags: ["girls","engineering","AICTE","women-specific","live2026"],
    faq: [{ q: "Is there a marks cutoff?", a: "No minimum marks; merit-based among eligible girls." }]
  },
  {
    id: "maha-bahujan-2026", name: "Bahujan Welfare Scholarship Maharashtra 2026-27", provider: "Social Welfare Dept, Maharashtra",
    type: "government", field: ["engineering","medical","arts","science","commerce","law"],
    level: ["class11-12","undergraduate","postgraduate"], categories: ["sc","st"],
    states: ["Maharashtra"], amount: "Full tuition + ₹550/month", amount_value: 80000,
    deadline: "2026-09-15", open_date: "2026-04-01", renewable: true,
    eligibility_summary: "For SC/ST students domiciled in Maharashtra. Covers full tuition fees plus monthly maintenance.",
    min_marks_percent: 45, max_family_income_lpa: 2.5, difficulty: "easy", success_rate_estimate: 80, selection_process: "merit",
    required_documents: ["Aadhaar","Domicile Certificate","Caste Certificate","Income Certificate","Marksheet"],
    application_link: "https://mahadbt.maharashtra.gov.in/Login/Login", official_portal: "https://mahaeschol.maharashtra.gov.in",
    apply_time_minutes: 30, tags: ["maharashtra","sc","st","state-govt","live2026"],
    faq: [{ q: "Is domicile certificate mandatory?", a: "Yes, you must be a Maharashtra domicile." }]
  },
  {
    id: "mahadbt-obc-2026", name: "MahaDBT OBC/VJNT/SBC Scholarship 2026-27", provider: "OBC Welfare Dept, Maharashtra",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management"],
    level: ["class11-12","undergraduate","postgraduate"], categories: ["obc"],
    states: ["Maharashtra"], amount: "Full tuition + maintenance", amount_value: 70000,
    deadline: "2026-09-30", open_date: "2026-04-10", renewable: true,
    eligibility_summary: "For OBC/VJNT/SBC students in Maharashtra. Covers tuition and maintenance. Apply on MahaDBT portal.",
    min_marks_percent: 50, max_family_income_lpa: 8, difficulty: "easy", success_rate_estimate: 75, selection_process: "merit",
    required_documents: ["Aadhaar","OBC Certificate","Non-Creamy Layer Certificate","Income Certificate","Marksheet","Domicile"],
    application_link: "https://mahadbt.maharashtra.gov.in/Login/Login", official_portal: "https://mahadbt.maharashtra.gov.in",
    apply_time_minutes: 40, tags: ["maharashtra","obc","vjnt","state-govt","mahadbt","live2026"],
    faq: [{ q: "What is Non-Creamy Layer?", a: "Families with annual income below ₹8 LPA qualify." }]
  },
  {
    id: "tata-pankh-2026", name: "Tata Capital Pankh Scholarship 2026", provider: "Tata Capital",
    type: "private", field: ["engineering","medical","arts","science","commerce"],
    level: ["class11-12","undergraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "Up to ₹50,000/year", amount_value: 50000,
    deadline: "2026-11-15", open_date: "2026-05-01", renewable: true,
    eligibility_summary: "For meritorious students from economically weaker sections. Min 60% in last exam. Apply via Buddy4Study portal.",
    min_marks_percent: 60, max_family_income_lpa: 4, difficulty: "medium", success_rate_estimate: 45,
    selection_process: "merit+interview",
    interview_details: "Online video interview with Tata Capital panel, ~20 mins",
    required_documents: ["Aadhaar","Marksheet","Income Certificate","Admission Letter","Photo"],
    application_link: "https://www.buddy4study.com/scholarships",
    official_portal: "https://www.tatacapital.com",
    apply_time_minutes: 60, tags: ["tata","private","interview","live2026"],
    faq: [{ q: "What does the interview cover?", a: "Academic goals, financial background, and future plans." }]
  },
  {
    id: "reliance-found-2026", name: "Reliance Foundation Scholarship 2026", provider: "Reliance Foundation",
    type: "private", field: ["engineering","science"],
    level: ["undergraduate","postgraduate"], categories: ["general","obc","sc","st","ews"],
    states: ["all"], amount: "₹2,00,000/year + mentorship", amount_value: 200000,
    deadline: "2026-07-31", open_date: "2026-04-20", renewable: false,
    eligibility_summary: "For engineering and science students in top universities. Focus on innovation. Min 60% in 12th.",
    min_marks_percent: 60, max_family_income_lpa: 6, difficulty: "hard", success_rate_estimate: 15,
    selection_process: "merit+interview",
    interview_details: "Two-stage: written assessment + video interview",
    required_documents: ["Aadhaar","Marksheet","Income Certificate","Essays","Portfolio"],
    application_link: "https://scholarships.reliancefoundation.org/",
    official_portal: "https://www.reliancefoundation.org",
    apply_time_minutes: 120, tags: ["reliance","corporate","stem","flagship","live2026"],
    faq: [{ q: "What is the mentorship component?", a: "1-on-1 mentoring from Reliance professionals." }]
  },
  {
    id: "buddy4study-2026", name: "Buddy4Study Shiksha Scholarship 2026", provider: "Buddy4Study Foundation",
    type: "ngo", field: ["engineering","arts","science","commerce","management"],
    level: ["undergraduate"], categories: ["general","obc","sc","st","ews","minority","women"],
    states: ["all"], amount: "₹25,000–₹40,000", amount_value: 40000,
    deadline: "2026-08-31", open_date: "2026-04-15", renewable: false,
    eligibility_summary: "For first-generation college students from low-income families. Min 60% in Class 12.",
    min_marks_percent: 60, max_family_income_lpa: 3, difficulty: "medium", success_rate_estimate: 30, selection_process: "essay",
    required_documents: ["Aadhaar","Class 12 Marksheet","Income Certificate","First-Gen Declaration","SOP"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://www.buddy4study.com",
    apply_time_minutes: 80, tags: ["first-gen","ngo","essay","buddy4study","live2026"],
    faq: [{ q: "Is SOP mandatory?", a: "Yes, a 500-word Statement of Purpose is required." }]
  },
  {
    id: "vidyasaarathi-2026", name: "Vidyasaarathi TCS Scholarship 2026", provider: "TCS / Vidyasaarathi",
    type: "ngo", field: ["engineering","science"],
    level: ["undergraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "Up to ₹50,000/year", amount_value: 50000,
    deadline: "2026-07-15", open_date: "2026-04-19", renewable: false,
    eligibility_summary: "For engineering and science UG students. Min 60% in Class 12. Income below ₹4 LPA.",
    min_marks_percent: 60, max_family_income_lpa: 4, difficulty: "medium", success_rate_estimate: 35, selection_process: "merit",
    required_documents: ["Aadhaar","Class 12 Marksheet","Income Certificate","Admission Letter","Bank Passbook"],
    application_link: "https://www.vidyasaarathi.co.in/Vidyasaarathi/login", official_portal: "https://www.vidyasaarathi.co.in",
    apply_time_minutes: 50, tags: ["tcs","vidyasaarathi","ngo","engineering","live2026"],
    faq: [{ q: "Can diploma students apply?", a: "No, only degree (UG) students." }]
  },
  {
    id: "google-gen-2026", name: "Google Generation Scholarship 2026", provider: "Google India",
    type: "private", field: ["engineering","science"],
    level: ["undergraduate","postgraduate"], categories: ["women","sc","st","disabled"],
    states: ["all"], amount: "₹75,000 + mentorship + Google events", amount_value: 75000,
    deadline: "2026-12-01", open_date: "2026-06-01", renewable: false,
    eligibility_summary: "For women and underrepresented groups in computer science/IT. Min 60% equivalent.",
    min_marks_percent: 60, max_family_income_lpa: 999, difficulty: "hard", success_rate_estimate: 5,
    selection_process: "merit+interview",
    interview_details: "Online assessment + video interview with Google team",
    required_documents: ["Aadhaar","Marksheet","SOP","2 Recommendation Letters","Resume"],
    application_link: "https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship-apac/",
    official_portal: "https://buildyourfuture.withgoogle.com",
    apply_time_minutes: 150, tags: ["google","women","cs","it","prestigious","live2026"],
    faq: [{ q: "Is coding experience required?", a: "Yes, prior coding projects/internships are expected." }]
  },
  {
    id: "kc-mahindra-2026", name: "K.C. Mahindra Scholarship for PG Studies 2026", provider: "K.C. Mahindra Education Trust",
    type: "ngo", field: ["engineering","management","science","arts"],
    level: ["postgraduate"], categories: ["general","obc","sc","st","ews","minority","women"],
    states: ["all"], amount: "Up to ₹3,00,000 (interest-free)", amount_value: 300000,
    deadline: "2026-07-31", open_date: "2026-04-19", renewable: false,
    eligibility_summary: "Interest-free scholarship-cum-loan for PG in India or abroad. Min 60% in UG. Essay required.",
    min_marks_percent: 60, max_family_income_lpa: 10, difficulty: "hard", success_rate_estimate: 10,
    selection_process: "merit+interview",
    interview_details: "Essay shortlist followed by panel interview",
    required_documents: ["Aadhaar","UG Marksheet","SOP","Recommendation Letters","Admission Letter"],
    application_link: "https://www.kcmet.org/how-to-apply.aspx", official_portal: "https://www.kcmet.org",
    apply_time_minutes: 150, tags: ["mahindra","postgraduate","interest-free","essay","ngo","live2026"],
    faq: [{ q: "Is this a loan or grant?", a: "Interest-free loan — no interest charged ever." }]
  },
  {
    id: "hdfc-crisis-2026", name: "HDFC Educational Crisis Scholarship 2026", provider: "HDFC Bank",
    type: "private", field: ["engineering","medical","arts","science","commerce","law"],
    level: ["class11-12","undergraduate","postgraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "Up to ₹75,000", amount_value: 75000,
    deadline: "2026-10-31", open_date: "2026-05-01", renewable: false,
    eligibility_summary: "For students who faced family financial crisis (job loss, illness, disaster). Apply on Buddy4Study.",
    min_marks_percent: 55, max_family_income_lpa: 5, difficulty: "medium", success_rate_estimate: 38, selection_process: "merit",
    required_documents: ["Aadhaar","Crisis Documentation","Income Certificate","Marksheet","Admission Letter"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://www.hdfcbank.com",
    apply_time_minutes: 60, tags: ["hdfc","crisis","bank","private","live2026"],
    faq: [{ q: "What counts as a financial crisis?", a: "Job loss, medical emergency, or natural disaster." }]
  },
  {
    id: "cii-youth-2026", name: "CII Foundation Youth Innovation Scholarship 2026", provider: "CII Foundation",
    type: "ngo", field: ["engineering","science","management"],
    level: ["undergraduate","postgraduate"], categories: ["general","obc","sc","st","ews","minority","women"],
    states: ["all"], amount: "₹50,000 + mentorship", amount_value: 50000,
    deadline: "2026-11-15", open_date: "2026-06-01", renewable: false,
    eligibility_summary: "For students with an innovative project/startup idea. Min 60%. Shortlisted candidates pitch their idea.",
    min_marks_percent: 60, max_family_income_lpa: 8, difficulty: "hard", success_rate_estimate: 12,
    selection_process: "merit+interview",
    interview_details: "Project pitch presentation to CII jury panel",
    required_documents: ["Aadhaar","Marksheet","Project Report","Income Certificate","Recommendation Letter"],
    application_link: "https://www.ciifoundation.in/Youth-Innovation-Scholarship", official_portal: "https://www.ciifoundation.in",
    apply_time_minutes: 150, tags: ["cii","innovation","startup","ngo","mentorship","live2026"],
    faq: [{ q: "Must I have a working prototype?", a: "A prototype is preferred but a detailed plan is accepted." }]
  },
  {
    id: "infosys-found-2026", name: "Infosys Foundation Scholarship 2026", provider: "Infosys Foundation",
    type: "private", field: ["engineering","science","arts","commerce","management"],
    level: ["undergraduate","postgraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "Up to ₹60,000/year", amount_value: 60000,
    deadline: "2026-10-31", open_date: "2026-05-15", renewable: true,
    eligibility_summary: "Need-based for meritorious students. Family income below ₹5 LPA. Min 65% in last exam.",
    min_marks_percent: 65, max_family_income_lpa: 5, difficulty: "medium", success_rate_estimate: 25, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Income Certificate","Admission Letter","Bank Passbook"],
    application_link: "https://www.infosys.com/infosys-foundation/social-responsibility.html",
    official_portal: "https://www.infosys.com",
    apply_time_minutes: 55, tags: ["infosys","corporate","need-based","renewable","live2026"],
    faq: [{ q: "Is it renewable?", a: "Yes, subject to maintaining 65% marks." }]
  },


  // ── GOVERNMENT SCHEMES – CENTRAL ────────────────────────────
  {
    id: "tfws-maha-2026", name: "Tuition Fee Waiver Scheme (TFWS)", provider: "DTE Maharashtra",
    type: "government", field: ["engineering","pharmacy","agriculture"],
    level: ["undergraduate","diploma"], categories: ["ews","general"],
    states: ["Maharashtra"], amount: "Full tuition fee waiver", amount_value: 180000,
    deadline: "2026-08-31", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "5% seats reserved for EWS students in Maharashtra engineering/pharmacy/agriculture colleges. Family income below ₹8 LPA. Admission via CAP round.",
    min_marks_percent: 0, max_family_income_lpa: 8, difficulty: "easy", success_rate_estimate: 80, selection_process: "merit",
    required_documents: ["Aadhaar","EWS/Income Certificate","HSC Marksheet","CET Score Card","CAP Allotment Letter","Bank Passbook","Domicile Certificate"],
    application_link: "https://mahadbt.maharashtra.gov.in/Login/Login", official_portal: "https://mahadbt.maharashtra.gov.in",
    apply_time_minutes: 35, tags: ["tfws","ews","engineering","maharashtra","tuition-waiver","govt-scheme","live2026"],
    faq: [
      { q: "Is TFWS a scholarship or seat reservation?", a: "It is a full tuition fee waiver for students admitted against 5% TFWS seats in CAP allotment." },
      { q: "Does it cover hostel/mess fees?", a: "No, only tuition and mandatory college fees are waived." }
    ]
  },
  {
    id: "ews-post-matric-2026", name: "EWS Post-Matric Scholarship (Central)", provider: "Ministry of Education / NSP",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management","diploma"],
    level: ["class11-12","undergraduate","postgraduate","phd","diploma"], categories: ["ews","general"],
    states: ["all"], amount: "₹3,000–₹7,200/year + maintenance", amount_value: 72000,
    deadline: "2026-10-31", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For EWS students (10% reservation category) studying after class 10. Family income must be below ₹8 LPA. Mandatory NSP OTR registration required.",
    min_marks_percent: 0, max_family_income_lpa: 8, difficulty: "easy", success_rate_estimate: 78, selection_process: "merit",
    required_documents: ["Aadhaar","EWS Certificate (SDM/Tehsildar issued)","Income Certificate","Marksheet","Admission Letter","Bank Passbook"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 40, tags: ["ews","post-matric","nsp","government","govt-scheme","live2026"],
    faq: [
      { q: "Who issues the EWS certificate?", a: "Tehsildar or Sub-Divisional Magistrate (SDM) of your district." },
      { q: "Is this different from OBC scholarship?", a: "Yes — EWS is for general category families with income below ₹8 LPA not covered by SC/ST/OBC." }
    ]
  },
  {
    id: "nmms-2026", name: "National Means-cum-Merit Scholarship (NMMS)", provider: "Ministry of Education / SCERT",
    type: "government", field: ["arts","science","commerce","engineering","medical"],
    level: ["class9-10"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "₹12,000/year (₹1,000/month)", amount_value: 12000,
    deadline: "2026-09-30", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For class 8 students qualifying NMMS state-level exam. Family income below ₹3.5 LPA. Mandatory NSP OTR registration required.",
    min_marks_percent: 55, max_family_income_lpa: 3.5, difficulty: "medium", success_rate_estimate: 30, selection_process: "merit",
    required_documents: ["Aadhaar","Class 7 Marksheet","Income Certificate","School Certificate","NMMS Admit Card"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 30, tags: ["nmms","class8","pre-matric","government","govt-scheme","merit","live2026"],
    faq: [
      { q: "Who conducts the NMMS exam?", a: "Each state's SCERT/DCERT conducts its own NMMS exam; results shared with MoE." },
      { q: "Up to which class is it valid?", a: "From class 9 to 12 — renewed annually on passing with min 55%." }
    ]
  },
  {
    id: "top-class-sc-2026", name: "Top Class Education Scholarship for SC Students", provider: "Ministry of Social Justice / NSP",
    type: "government", field: ["engineering","medical","law","management","arts","science","commerce"],
    level: ["undergraduate","postgraduate"], categories: ["sc"],
    states: ["all"], amount: "Full tuition + ₹2,220/month maintenance", amount_value: 400000,
    deadline: "2026-10-31", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For SC students in 266 top institutions (IITs, NITs, IIMs, AIIMS, etc.). Family income below ₹6 LPA. Mandatory NSP OTR required.",
    min_marks_percent: 0, max_family_income_lpa: 6, difficulty: "medium", success_rate_estimate: 60, selection_process: "merit",
    required_documents: ["Aadhaar","SC Certificate","Income Certificate","Admission Letter (listed institution)","Marksheet","Bank Passbook"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 45, tags: ["sc","top-class","iit","nit","iim","aiims","government","govt-scheme","live2026"],
    faq: [
      { q: "Which institutions are covered?", a: "266 premier institutions notified by MOSJE including IITs, NITs, IIMs, AIIMS, NLUs." },
      { q: "Is there a seat cap per college?", a: "Yes — up to 10 scholars per institution per year." }
    ]
  },
  {
    id: "rgnf-sc-st-2026", name: "Rajiv Gandhi National Fellowship (SC/ST)", provider: "University Grants Commission",
    type: "government", field: ["arts","science","commerce","engineering","law","management","medical"],
    level: ["phd"], categories: ["sc","st"],
    states: ["all"], amount: "₹31,000–₹35,000/month + HRA + contingency", amount_value: 420000,
    deadline: "2026-09-15", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For SC/ST students pursuing M.Phil/PhD in UGC-recognized universities. Mandatory NSP OTR registration required.",
    min_marks_percent: 55, max_family_income_lpa: 999, difficulty: "hard", success_rate_estimate: 15, selection_process: "merit",
    required_documents: ["Aadhaar","SC/ST Certificate","PG Marksheet","NET Score Card (if applicable)","PhD Enrollment Certificate","Research Proposal"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://www.ugc.ac.in",
    apply_time_minutes: 90, tags: ["rgnf","phd","sc","st","ugc","fellowship","government","govt-scheme","live2026"],
    faq: [
      { q: "Is NET mandatory for RGNF?", a: "Not mandatory; direct PhD enrollees at UGC-recognized universities can also apply." },
      { q: "How many fellowships are awarded?", a: "2,000 per year — 1,500 for SC and 500 for ST students." }
    ]
  },
  {
    id: "ugc-obc-fellowship-2026", name: "National Fellowship for OBC Students (UGC)", provider: "Ministry of Social Justice / UGC",
    type: "government", field: ["arts","science","commerce","engineering","law","management","medical"],
    level: ["phd"], categories: ["obc"],
    states: ["all"], amount: "₹31,000/month + HRA + contingency", amount_value: 372000,
    deadline: "2026-09-30", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For OBC (Non-Creamy Layer) students pursuing M.Phil/PhD in UGC-recognized universities. 300 new fellowships per year.",
    min_marks_percent: 55, max_family_income_lpa: 8, difficulty: "hard", success_rate_estimate: 12, selection_process: "merit",
    required_documents: ["Aadhaar","OBC-NCL Certificate","PG Marksheet","Enrollment Certificate","Research Proposal"],
    application_link: "https://scholarships.gov.in/loginPage", official_portal: "https://www.ugc.ac.in",
    apply_time_minutes: 90, tags: ["obc","phd","ugc","fellowship","government","govt-scheme","non-creamy","live2026"],
    faq: [
      { q: "Does Creamy Layer OBC qualify?", a: "No — only Non-Creamy Layer OBC (family income below ₹8 LPA) is eligible." },
      { q: "Is M.Phil also covered?", a: "Yes, M.Phil students at UGC-recognized universities are eligible." }
    ]
  },
  {
    id: "igc-single-girl-2026", name: "Indira Gandhi Scholarship for Single Girl Child", provider: "University Grants Commission",
    type: "government", field: ["arts","science","commerce","law","management"],
    level: ["postgraduate"], categories: ["women","general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "₹3,100/month for 2 years", amount_value: 74400,
    deadline: "2026-10-31", open_date: "2026-04-19", renewable: false,
    eligibility_summary: "For single girl child pursuing PG (non-professional) courses. Mandatory NSP OTR registration required.",
    min_marks_percent: 0, max_family_income_lpa: 999, difficulty: "easy", success_rate_estimate: 65, selection_process: "merit",
    required_documents: ["Aadhaar","Single Girl Child Affidavit","UG Marksheet","Admission Letter","Bank Passbook","Parent Identity Proof"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://www.ugc.ac.in",
    apply_time_minutes: 40, tags: ["single-girl","women","ugc","postgraduate","govt-scheme","government","live2026"],
    faq: [
      { q: "Does twin daughters also qualify?", a: "Yes — if the parents have twin daughters and no other children, both can apply." },
      { q: "Does this cover professional PG like MBA/LLM?", a: "No — only non-professional PG programs (MA, MSc, MCom, etc.)." }
    ]
  },
  {
    id: "pm-capf-2026", name: "PM Scholarship Scheme for CAPF / Ex-Servicemen Wards", provider: "Ministry of Home Affairs / KSB",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management","nursing"],
    level: ["undergraduate","diploma"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "₹2,500–₹3,000/month", amount_value: 36000,
    deadline: "2026-10-15", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For wards/widows of CAPF personnel (CRPF, BSF, CISF, ITBP, SSB, NIA, NSG, AR) and ex-servicemen. Min 60% in class 12.",
    min_marks_percent: 60, max_family_income_lpa: 999, difficulty: "easy", success_rate_estimate: 72, selection_process: "merit",
    required_documents: ["Aadhaar","Service/Death Certificate of parent","Class 12 Marksheet","Admission Letter","Bank Passbook"],
    application_link: "https://ksb.gov.in/Registration.htm", official_portal: "https://ksb.gov.in",
    apply_time_minutes: 45, tags: ["capf","ex-servicemen","military","ksb","government","govt-scheme","live2026"],
    faq: [
      { q: "Is it only for CAPF or also Army/Navy/Air Force?", a: "This specific scheme is for CAPF personnel. Armed Forces wards have separate PM Scholarship via KSB." },
      { q: "Can widow of deceased personnel apply?", a: "Yes — widows and wards of personnel killed in action get priority." }
    ]
  },
  {
    id: "ishan-uday-2026", name: "Ishan Uday Special Scholarship for NE Region", provider: "University Grants Commission",
    type: "government", field: ["arts","science","commerce","engineering","management","law"],
    level: ["undergraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["Assam","Meghalaya","Manipur","Mizoram","Nagaland","Tripura","Arunachal Pradesh","Sikkim"],
    amount: "₹5,400–₹7,800/month", amount_value: 93600,
    deadline: "2026-09-30", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For students domiciled in NE states studying outside the region. Mandatory NSP OTR registration required.",
    min_marks_percent: 0, max_family_income_lpa: 999, difficulty: "easy", success_rate_estimate: 70, selection_process: "merit",
    required_documents: ["Aadhaar","NE Domicile Certificate","Class 12 Marksheet","Admission Letter","Bank Passbook"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://www.ugc.ac.in",
    apply_time_minutes: 35, tags: ["ishan-uday","north-east","NE","ugc","government","govt-scheme","live2026"],
    faq: [
      { q: "Can I study in NE state colleges and still apply?", a: "No — this scheme is specifically for NE-domicile students studying outside the NE region." },
      { q: "Is there an income limit?", a: "No income ceiling — open to all NE-domicile students." }
    ]
  },
  {
    id: "dr-ambedkar-obc-ebc-2026", name: "Dr. Ambedkar Post-Matric Scholarship for OBC/EBC", provider: "Ministry of Social Justice / NSP",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management","diploma"],
    level: ["class11-12","undergraduate","postgraduate","phd","diploma"], categories: ["obc","ews"],
    states: ["all"], amount: "Full tuition + maintenance allowance", amount_value: 100000,
    deadline: "2026-10-31", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For OBC/EBC students from class 11 onwards. Covers full tuition and maintenance. Family income below ₹1 LPA (EBC) or ₹3 LPA (OBC).",
    min_marks_percent: 0, max_family_income_lpa: 3, difficulty: "easy", success_rate_estimate: 80, selection_process: "merit",
    required_documents: ["Aadhaar","OBC/EBC Certificate","Income Certificate","Marksheet","Admission Letter","Bank Passbook"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 35, tags: ["ambedkar","obc","ebc","post-matric","government","govt-scheme","live2026"],
    faq: [
      { q: "What is the income limit for OBC vs EBC?", a: "OBC: income below ₹3 LPA. EBC (Economically Backward Classes): income below ₹1 LPA." },
      { q: "Is Non-Creamy Layer mandatory for OBC?", a: "Yes — OBC applicants must have a valid Non-Creamy Layer (NCL) certificate." }
    ]
  },
  {
    id: "pm-cares-children-2026", name: "PM CARES for Children Scholarship", provider: "PM CARES Fund / CBSE",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management"],
    level: ["class9-10","class11-12","undergraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "Full tuition + ₹20,000/year stipend (UG); ₹2,000/month (class 9-12)", amount_value: 200000,
    deadline: "2026-09-30", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For children who lost both parents or primary earning parent due to COVID-19. All education levels. Covers full tuition at govt institutions + monthly stipend.",
    min_marks_percent: 0, max_family_income_lpa: 999, difficulty: "easy", success_rate_estimate: 90, selection_process: "merit",
    required_documents: ["Aadhaar","Parent Death Certificate (COVID-related)","Child's Birth Certificate","Guardian Certificate","Marksheet","Admission Letter"],
    application_link: "https://pmcaresforchildren.in/child_registration", official_portal: "https://pmcaresforchildren.in",
    apply_time_minutes: 40, tags: ["pm-cares","covid","orphan","government","govt-scheme","live2026"],
    faq: [
      { q: "Only for COVID-19 affected children?", a: "Yes — specifically for children who lost parent(s) to COVID-19 between March 2020 and December 2021." },
      { q: "Who manages disbursement?", a: "District Magistrate offices coordinate with respective state governments for disbursement." }
    ]
  },
  {
    id: "nsp-obc-pre-matric-2026", name: "Pre-Matric Scholarship for OBC Students", provider: "Ministry of Social Justice / NSP",
    type: "government", field: ["arts","science","commerce","engineering","medical"],
    level: ["class9-10"], categories: ["obc"],
    states: ["all"], amount: "₹4,500–₹7,000/year", amount_value: 7000,
    deadline: "2026-10-31", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For OBC students in class 9 and 10. Family income below ₹1 LPA. Mandatory NSP OTR registration required.",
    min_marks_percent: 0, max_family_income_lpa: 1, difficulty: "easy", success_rate_estimate: 85, selection_process: "merit",
    required_documents: ["Aadhaar","OBC Certificate","NCL Certificate","Income Certificate","School ID","Marksheet"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 30, tags: ["obc","pre-matric","class9-10","nsp","government","govt-scheme","live2026"],
    faq: [
      { q: "Are hostellers given more?", a: "Yes — hostellers receive higher maintenance allowance than day scholars." },
      { q: "Is the income limit ₹1 LPA only?", a: "Yes, strictly ₹1 LPA for OBC pre-matric; higher income = OBC post-matric scheme." }
    ]
  },
  {
    id: "nsp-sc-post-2026", name: "Post-Matric Scholarship for SC Students 2026-27", provider: "Ministry of Social Justice / NSP",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management","diploma"],
    level: ["class11-12","undergraduate","postgraduate","phd","diploma"], categories: ["sc"],
    states: ["all"], amount: "Full tuition + maintenance allowance", amount_value: 120000,
    deadline: "2026-10-31", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For SC students from class 11 onwards. Family income below ₹2.5 LPA. Mandatory NSP OTR registration required.",
    min_marks_percent: 0, max_family_income_lpa: 2.5, difficulty: "easy", success_rate_estimate: 88, selection_process: "merit",
    required_documents: ["Aadhaar","SC Certificate","Income Certificate","Marksheet","Admission Letter","Bank Passbook"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 35, tags: ["sc","post-matric","nsp","government","govt-scheme","live2026"],
    faq: [
      { q: "What is the income ceiling?", a: "Family income must be below ₹2.5 LPA for SC post-matric scholarship." },
      { q: "Is college type restricted?", a: "No — applicable to all government and private recognized institutions." }
    ]
  },

  // ── GOVERNMENT SCHEMES – MAHARASHTRA STATE ──────────────────
  {
    id: "rajarshi-shahu-2026", name: "Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship", provider: "Govt of Maharashtra – Higher Education",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management"],
    level: ["undergraduate","postgraduate"], categories: ["general","ews"],
    states: ["Maharashtra"], amount: "₹5,000–₹8,000/year", amount_value: 8000,
    deadline: "2026-09-30", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "Merit-based scholarship for open-category Maharashtra students. Awarded to top scorers in HSC / entrance exams. Income below ₹8 LPA preferred.",
    min_marks_percent: 75, max_family_income_lpa: 8, difficulty: "medium", success_rate_estimate: 45, selection_process: "merit",
    required_documents: ["Aadhaar","Domicile Certificate","HSC/Entrance Marksheet","Admission Letter","Income Certificate","Bank Passbook"],
    application_link: "https://mahadbt.maharashtra.gov.in/Login/Login", official_portal: "https://mahadbt.maharashtra.gov.in",
    apply_time_minutes: 35, tags: ["maharashtra","merit","general","shahu-maharaj","govt-scheme","live2026"],
    faq: [
      { q: "Is this only for open category?", a: "Yes — designed for general/open category meritorious students not covered by SC/ST/OBC schemes." },
      { q: "What is the minimum HSC percentage?", a: "Typically 75% and above in HSC board exams." }
    ]
  },
  {
    id: "panjabrao-vasatigruh-2026", name: "Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojana", provider: "Social Welfare Dept, Maharashtra",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management","diploma"],
    level: ["undergraduate","postgraduate","diploma"], categories: ["sc","obc","st","ews"],
    states: ["Maharashtra"], amount: "₹3,000–₹6,000/month (hostel maintenance)", amount_value: 72000,
    deadline: "2026-09-30", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "Hostel maintenance allowance for SC/OBC/ST/EWS students residing in hostels in Maharashtra. Covers food and accommodation expenses.",
    min_marks_percent: 0, max_family_income_lpa: 8, difficulty: "easy", success_rate_estimate: 82, selection_process: "merit",
    required_documents: ["Aadhaar","Caste Certificate","Income Certificate","Hostel Allotment Letter","Domicile","Marksheet","Bank Passbook"],
    application_link: "https://mahadbt.maharashtra.gov.in/Login/Login", official_portal: "https://mahadbt.maharashtra.gov.in",
    apply_time_minutes: 30, tags: ["maharashtra","hostel","maintenance","panjabrao","sc","obc","govt-scheme","live2026"],
    faq: [
      { q: "Only for government hostels?", a: "Primarily for government/aided hostels; private hostel students may apply with approval." },
      { q: "Is it stackable with other scholarships?", a: "Yes — this covers hostel costs and can be combined with tuition scholarships." }
    ]
  },
  {
    id: "eklavya-st-maha-2026", name: "Eklavya Scholarship for ST Students (Maharashtra)", provider: "Tribal Development Dept, Maharashtra",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management"],
    level: ["class11-12","undergraduate","postgraduate"], categories: ["st"],
    states: ["Maharashtra"], amount: "Full tuition + ₹800/month maintenance", amount_value: 100000,
    deadline: "2026-09-15", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For Scheduled Tribe students domiciled in Maharashtra. Covers full tuition and monthly maintenance. No income limit for ST students.",
    min_marks_percent: 0, max_family_income_lpa: 999, difficulty: "easy", success_rate_estimate: 85, selection_process: "merit",
    required_documents: ["Aadhaar","Tribal/ST Certificate","Domicile Certificate","Marksheet","Admission Letter","Bank Passbook"],
    application_link: "https://mahadbt.maharashtra.gov.in/Login/Login", official_portal: "https://mahadbt.maharashtra.gov.in",
    apply_time_minutes: 30, tags: ["eklavya","st","tribal","maharashtra","state-govt","govt-scheme","live2026"],
    faq: [
      { q: "Is there an income limit?", a: "No — all ST students with valid tribal certificate are eligible regardless of income." },
      { q: "Which tribes are included?", a: "All communities listed in the Maharashtra ST schedule." }
    ]
  },
  {
    id: "annasaheb-patil-2026", name: "Annasaheb Patil Economic Dev. Corporation Scholarship", provider: "Annasaheb Patil AEDC, Maharashtra",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management"],
    level: ["undergraduate","postgraduate"], categories: ["general","ews"],
    states: ["Maharashtra"], amount: "Interest subsidy on education loan + ₹30,000–₹60,000 grant", amount_value: 60000,
    deadline: "2026-10-15", open_date: "2026-04-19", renewable: false,
    eligibility_summary: "For Maratha/Kunbi/Kunbi-Maratha community students of Maharashtra not covered by OBC. Income below ₹8 LPA. Interest subsidy on loans up to ₹10 LPA.",
    min_marks_percent: 50, max_family_income_lpa: 8, difficulty: "easy", success_rate_estimate: 65, selection_process: "merit",
    required_documents: ["Aadhaar","Community Certificate","Income Certificate","Domicile","Marksheet","Admission Letter","Bank Passbook"],
    application_link: "https://mahadbt.maharashtra.gov.in/Login/Login", official_portal: "https://mahadbt.maharashtra.gov.in",
    apply_time_minutes: 45, tags: ["annasaheb-patil","maratha","maharashtra","aedc","govt-scheme","live2026"],
    faq: [
      { q: "Is this only for Maratha community?", a: "Primarily for Maratha/Kunbi community — students from open category not covered by OBC reservation." },
      { q: "Is it a grant or loan subsidy?", a: "Both — direct grant component plus interest subsidy if you have an education loan." }
    ]
  },
  {
    id: "maha-ews-freeship-2026", name: "Maharashtra EWS Freeship Card Scheme", provider: "Govt of Maharashtra – Higher & Technical Education",
    type: "government", field: ["engineering","pharmacy","medical","arts","science","commerce","management","law"],
    level: ["undergraduate","postgraduate","diploma"], categories: ["ews","general"],
    states: ["Maharashtra"], amount: "Full tuition fee exemption", amount_value: 150000,
    deadline: "2026-08-31", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "Freeship card for open-category students with family income below ₹8 LPA. Covers full tuition at govt-aided Maharashtra colleges. Different from TFWS.",
    min_marks_percent: 0, max_family_income_lpa: 8, difficulty: "easy", success_rate_estimate: 82, selection_process: "merit",
    required_documents: ["Aadhaar","Income Certificate (below ₹8 LPA)","Domicile Certificate","Marksheet","Admission Letter","Non-Creamy Layer Equivalent Declaration"],
    application_link: "https://mahadbt.maharashtra.gov.in/Login/Login", official_portal: "https://mahadbt.maharashtra.gov.in",
    apply_time_minutes: 30, tags: ["ews","freeship","maharashtra","tuition-free","open-category","govt-scheme","live2026"],
    faq: [
      { q: "Is this the same as TFWS?", a: "No — Freeship Card is for all eligible open-category students at aided colleges; TFWS is 5% seat reservation via CAP." },
      { q: "Does it cover private unaided colleges?", a: "No — only government and government-aided colleges/universities in Maharashtra." }
    ]
  },
  {
    id: "maha-minority-2026", name: "Scholarship for Minority Students (Maharashtra)", provider: "Minority Development Dept, Maharashtra",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management"],
    level: ["undergraduate","postgraduate"], categories: ["minority"],
    states: ["Maharashtra"], amount: "₹25,000–₹50,000/year", amount_value: 50000,
    deadline: "2026-09-30", open_date: "2026-04-10", renewable: true,
    eligibility_summary: "For minority students (Muslim, Buddhist, Christian, Jain, Parsi, Sikh, Jews) domiciled in Maharashtra. Income below ₹8 LPA. Apply on MahaDBT.",
    min_marks_percent: 50, max_family_income_lpa: 8, difficulty: "easy", success_rate_estimate: 75, selection_process: "merit",
    required_documents: ["Aadhaar","Domicile Certificate","Minority Certificate/Affidavit","Income Certificate","Marksheet"],
    application_link: "https://mahadbt.maharashtra.gov.in/Login/Login", official_portal: "https://mahadbt.maharashtra.gov.in",
    apply_time_minutes: 40, tags: ["maharashtra","minority","mahadbt","state-govt","live2026"],
    faq: [{ q: "What is the income limit?", a: "Family income must be below ₹8 LPA." }]
  },
  {
    id: "nsp-minority-pre-matric-2026", name: "Pre-Matric Scholarship for Minority Students", provider: "Ministry of Minority Affairs / NSP",
    type: "government", field: ["arts","science","commerce","engineering","medical"],
    level: ["class9-10"], categories: ["minority"],
    states: ["all"], amount: "₹1,000–₹10,700/year", amount_value: 10700,
    deadline: "2026-10-31", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For minority students (Muslim, Christian, etc.) in class 9–10. Mandatory NSP OTR registration required.",
    min_marks_percent: 50, max_family_income_lpa: 1, difficulty: "easy", success_rate_estimate: 80, selection_process: "merit",
    required_documents: ["Aadhaar","Minority Certificate","Income Certificate","Marksheet","School Certificate","Bank Passbook"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 30, tags: ["minority","pre-matric","nsp","class9-10","government","govt-scheme","live2026"],
    faq: [
      { q: "Which class students can apply?", a: "Students currently in class 9 or 10 from recognised schools." },
      { q: "Is the 50% marks required in last exam or overall?", a: "50% or above in the immediately preceding final examination." }
    ]
  },
  {
    id: "nsp-minority-post-matric-2026", name: "Post-Matric Scholarship for Minority Students", provider: "Ministry of Minority Affairs / NSP",
    type: "government", field: ["engineering","medical","arts","science","commerce","law","management","diploma"],
    level: ["class11-12","undergraduate","postgraduate","phd","diploma"], categories: ["minority"],
    states: ["all"], amount: "Full tuition + ₹570–₹1,200/month maintenance", amount_value: 90000,
    deadline: "2026-10-31", open_date: "2026-04-19", renewable: true,
    eligibility_summary: "For minority students from class 11 to PhD level. Covers full course fees and maintenance allowance. Family income below ₹2.5 LPA.",
    min_marks_percent: 50, max_family_income_lpa: 2.5, difficulty: "easy", success_rate_estimate: 78, selection_process: "merit",
    required_documents: ["Aadhaar","Minority Certificate","Income Certificate","Marksheet","Admission Letter","Bank Passbook"],
    application_link: "https://scholarships.gov.in/", official_portal: "https://scholarships.gov.in",
    apply_time_minutes: 35, tags: ["minority","post-matric","nsp","government","govt-scheme","live2026"],
    faq: [
      { q: "Which communities are covered?", a: "Muslim, Christian, Sikh, Buddhist, Jain, and Parsi students." },
      { q: "Can I apply for both pre and post-matric?", a: "No — apply for whichever level you are currently studying at." }
    ]
  },


  // ── CORPORATE & PRIVATE SCHOLARSHIPS ──────────────────────
  {
    id: "loreal-science-2026", name: "L'Oréal India For Young Women in Science Scholarship", provider: "L'Oréal India",
    type: "private", field: ["science"],
    level: ["undergraduate"], categories: ["women"],
    states: ["all"], amount: "₹2,50,000 (total degree)", amount_value: 250000,
    deadline: "2026-07-15", open_date: "2026-04-10", renewable: true,
    eligibility_summary: "For girls who passed Class 12 in 2026 with 85% in PCB/PCM. Family income below ₹6 LPA.",
    min_marks_percent: 85, max_family_income_lpa: 6, difficulty: "hard", success_rate_estimate: 20, selection_process: "merit+interview",
    required_documents: ["Aadhaar","Class 10 Marksheet","Class 12 Marksheet","Income Certificate","Admission Proof"],
    application_link: "https://www.buddy4study.com/page/loreal-india-for-young-women-in-science-scholarship", official_portal: "https://www.loreal.com",
    apply_time_minutes: 60, tags: ["loreal","women","science","merit","live2026"],
    faq: [{ q: "Can I apply if I have a gap year?", a: "No, must have passed Class 12 in the current year." }]
  },
  {
    id: "adobe-women-tech-2026", name: "Adobe Women-in-Technology Scholarship", provider: "Adobe India",
    type: "private", field: ["engineering","science"],
    level: ["undergraduate","postgraduate"], categories: ["women"],
    states: ["all"], amount: "Tuition coverage + Internship opportunity", amount_value: 500000,
    deadline: "2026-09-30", open_date: "2026-06-01", renewable: false,
    eligibility_summary: "For female students enrolled in undergraduate or masters in Computer Science/Engineering. High academic performance.",
    min_marks_percent: 80, max_family_income_lpa: 999, difficulty: "hard", success_rate_estimate: 5, selection_process: "merit+interview",
    required_documents: ["Resume","Academic Transcripts","Reference Letters","Essays"],
    application_link: "https://scholarshipamerica.org/", official_portal: "https://www.adobe.com",
    apply_time_minutes: 180, tags: ["adobe","women","tech","prestigious","engineering","live2026"],
    faq: [{ q: "Is there an interview?", a: "Yes, multiple rounds of technical and behavioral interviews." }]
  },
  {
    id: "lic-hfl-vidyadhan-2026", name: "LIC HFL Vidyadhan Scholarship", provider: "LIC Housing Finance Ltd",
    type: "private", field: ["engineering","medical","arts","science","commerce"],
    level: ["class11-12","undergraduate","postgraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "₹10,000–₹20,000/year", amount_value: 20000,
    deadline: "2026-09-30", open_date: "2026-04-15", renewable: true,
    eligibility_summary: "For students from Class 10 to PG level. Minimum 60% in previous exam. Family income below ₹3.6 LPA.",
    min_marks_percent: 60, max_family_income_lpa: 3.6, difficulty: "easy", success_rate_estimate: 60, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Income Certificate","Fee Receipt"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://www.lichousing.com",
    apply_time_minutes: 40, tags: ["lic","housing-finance","merit","need-based","live2026"],
    faq: [{ q: "Is it for school students?", a: "Yes, starts from Class 11." }]
  },
  {
    id: "kotak-kanya-2026", name: "Kotak Kanya Scholarship 2026", provider: "Kotak Education Foundation",
    type: "private", field: ["engineering","medical","law","management"],
    level: ["undergraduate"], categories: ["women"],
    states: ["all"], amount: "₹1,50,000/year", amount_value: 150000,
    deadline: "2026-08-31", open_date: "2026-04-10", renewable: true,
    eligibility_summary: "For girls in 1st year professional degree courses. 75%+ in 12th. Family income below ₹6 LPA.",
    min_marks_percent: 75, max_family_income_lpa: 6, difficulty: "hard", success_rate_estimate: 25, selection_process: "merit+interview",
    required_documents: ["Aadhaar","Marksheet","Income Certificate","College Admission Proof"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://kotakeducationfoundation.org",
    apply_time_minutes: 90, tags: ["kotak","girls","professional","merit","live2026"],
    faq: [{ q: "Does it cover Law students?", a: "Yes, professional courses like Law, Engineering, and Medical are covered." }]
  },
  {
    id: "gacl-edu-2026", name: "GACL Education Society Scholarship", provider: "GACL",
    type: "private", field: ["engineering","medical","science","commerce","arts"],
    level: ["undergraduate","postgraduate","diploma"], categories: ["general","obc","sc","st","ews"],
    states: ["all"], amount: "Varies based on course", amount_value: 50000,
    deadline: "2026-10-15", open_date: "2026-05-01", renewable: true,
    eligibility_summary: "Merit-based scholarship for students in professional and degree courses. Preference to local students.",
    min_marks_percent: 60, max_family_income_lpa: 8, difficulty: "medium", success_rate_estimate: 40, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Fee Receipt","Income Declaration"],
    application_link: "https://ges.gacl.com/", official_portal: "https://www.gacl.com",
    apply_time_minutes: 45, tags: ["gacl","corporate","merit","professional","live2026"],
    faq: [{ q: "Is it only for Gujarat?", a: "Preference to local candidates, but open to others." }]
  },
  {
    id: "colgate-keep-smiling-2026", name: "Keep India Smiling Foundational Scholarship", provider: "Colgate-Palmolive India",
    type: "private", field: ["engineering","medical","science","arts","commerce"],
    level: ["class11-12","undergraduate","diploma"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "₹20,000–₹30,000/year", amount_value: 30000,
    deadline: "2026-12-31", open_date: "2026-06-01", renewable: true,
    eligibility_summary: "For students in 11th, 12th, or UG courses. 75%+ in board exams. Income below ₹5 LPA.",
    min_marks_percent: 75, max_family_income_lpa: 5, difficulty: "medium", success_rate_estimate: 35, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Income Certificate","Photo"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://www.colgate.com/in-in",
    apply_time_minutes: 50, tags: ["colgate","smile","merit","school","college","live2026"],
    faq: [{ q: "Can BDS students apply?", a: "Yes, there is a special category for BDS students." }]
  },
  {
    id: "legrand-empower-2026", name: "Legrand Empowerment Scholarship", provider: "Legrand India",
    type: "private", field: ["engineering","architecture"],
    level: ["undergraduate"], categories: ["women"],
    states: ["all"], amount: "60% of tuition fee or ₹60,000/year", amount_value: 60000,
    deadline: "2026-08-15", open_date: "2026-04-20", renewable: true,
    eligibility_summary: "For girls in 1st year B.Tech/B.E/B.Arch. 70%+ in 10th & 12th. Income below ₹5 LPA.",
    min_marks_percent: 70, max_family_income_lpa: 5, difficulty: "medium", success_rate_estimate: 30, selection_process: "merit+interview",
    required_documents: ["Aadhaar","Marksheet","Admission Letter","Income Certificate"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://www.legrand.co.in",
    apply_time_minutes: 60, tags: ["legrand","girls","engineering","merit","live2026"],
    faq: [{ q: "What is the scholarship amount?", a: "Up to 60% of tuition fees or ₹60,000 per year until graduation." }]
  },
  {
    id: "rolls-royce-unnati-2026", name: "Rolls-Royce Unnati Scholarship for Women", provider: "Rolls-Royce India",
    type: "private", field: ["engineering"],
    level: ["undergraduate"], categories: ["women"],
    states: ["all"], amount: "₹35,000", amount_value: 35000,
    deadline: "2026-07-31", open_date: "2026-04-15", renewable: false,
    eligibility_summary: "For women students in 1st, 2nd, or 3rd year of B.Tech/B.E. in Aerospace, Marine, Electronics, etc.",
    min_marks_percent: 60, max_family_income_lpa: 999, difficulty: "medium", success_rate_estimate: 25, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Fee Receipt","Resume"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://www.rolls-royce.com",
    apply_time_minutes: 50, tags: ["rolls-royce","women","engineering","stem","live2026"],
    faq: [{ q: "Is it only for first year?", a: "No, open to students in 1st, 2nd, and 3rd year." }]
  },
  {
    id: "ongc-merit-2026", name: "ONGC Scholarship for Meritorious Students", provider: "ONGC Foundation",
    type: "private", field: ["engineering","medical","management","science"],
    level: ["undergraduate","postgraduate"], categories: ["sc","st","obc"],
    states: ["all"], amount: "₹48,000/year", amount_value: 48000,
    deadline: "2026-10-31", open_date: "2026-06-01", renewable: true,
    eligibility_summary: "For SC/ST/OBC students in 1st year of Engineering, MBBS, MBA, or Masters in Geology/Geophysics.",
    min_marks_percent: 60, max_family_income_lpa: 4.5, difficulty: "hard", success_rate_estimate: 15, selection_process: "merit",
    required_documents: ["Aadhaar","Caste Certificate","Income Certificate","Marksheet","Admission Proof"],
    application_link: "https://www.ongcscholar.org/", official_portal: "https://www.ongcindia.com",
    apply_time_minutes: 80, tags: ["ongc","sc","st","obc","merit","live2026"],
    faq: [{ q: "What is the age limit?", a: "Maximum 30 years as of the deadline." }]
  },
  {
    id: "idfc-first-mba-2026", name: "IDFC FIRST Bank MBA Scholarship", provider: "IDFC FIRST Bank",
    type: "private", field: ["management"],
    level: ["postgraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "₹1,00,000/year", amount_value: 100000,
    deadline: "2026-08-31", open_date: "2026-05-15", renewable: true,
    eligibility_summary: "For 1st year MBA students. Family income below ₹6 LPA. Enrollment in selected 150+ institutions.",
    min_marks_percent: 0, max_family_income_lpa: 6, difficulty: "medium", success_rate_estimate: 35, selection_process: "merit",
    required_documents: ["Aadhaar","MBA Admission Letter","Income Certificate","Marksheet"],
    application_link: "https://www.idfcfirstbank.com/csr-activities/mba-scholarship-program", official_portal: "https://www.idfcfirstbank.com",
    apply_time_minutes: 50, tags: ["idfc","mba","management","merit","live2026"],
    faq: [{ q: "Are all colleges eligible?", a: "Only students from selected list of 150+ B-schools can apply." }]
  },
  {
    id: "siemens-scholar-2026", name: "Siemens Scholarship Program", provider: "Siemens India",
    type: "private", field: ["engineering"],
    level: ["undergraduate"], categories: ["general","obc","sc","st","ews"],
    states: ["all"], amount: "Full tuition + Stationary + Mentorship", amount_value: 100000,
    deadline: "2026-08-31", open_date: "2026-04-15", renewable: true,
    eligibility_summary: "For 1st year Engineering students in Govt colleges. 60%+ in 10th & 12th. Income below ₹2 LPA.",
    min_marks_percent: 60, max_family_income_lpa: 2, difficulty: "hard", success_rate_estimate: 10, selection_process: "merit+interview",
    required_documents: ["Aadhaar","Govt College ID","Income Certificate","Marksheet"],
    application_link: "https://www.siemens.com/in/en/company/about/siemens-scholarship-program.html", official_portal: "https://www.siemens.com",
    apply_time_minutes: 100, tags: ["siemens","engineering","mentorship","merit","live2026"],
    faq: [{ q: "What are the benefits?", a: "Covers full tuition fees and provides professional mentorship." }]
  },


  // ── NGO & FOUNDATION SCHOLARSHIPS ────────────────────────
  {
    id: "kind-circle-merit-2026", name: "Kind Circle Scholarship for Meritorious Students", provider: "Kind Circle",
    type: "ngo", field: ["engineering","medical","arts","science","commerce"],
    level: ["class11-12","undergraduate","postgraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "₹10,000–₹15,000", amount_value: 15000,
    deadline: "2027-03-31", open_date: "2026-04-01", renewable: false,
    eligibility_summary: "For students from Class 1 to PG level. 75%+ in previous class. Family income below ₹4 LPA.",
    min_marks_percent: 75, max_family_income_lpa: 4, difficulty: "easy", success_rate_estimate: 50, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Income Certificate"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://www.kindcircle.org",
    apply_time_minutes: 30, tags: ["kind-circle","merit","need-based","school","college","live2026"],
    faq: [{ q: "Is it open for 2026-27?", a: "Yes, it has a long application window until March 2027." }]
  },
  {
    id: "santoor-women-2026", name: "Santoor Women's Scholarship", provider: "Wipro Cares",
    type: "ngo", field: ["arts","science","commerce","engineering","medical"],
    level: ["undergraduate"], categories: ["women"],
    states: ["Karnataka","Andhra Pradesh","Telangana"], amount: "₹24,000/year", amount_value: 24000,
    deadline: "2026-09-30", open_date: "2026-05-01", renewable: true,
    eligibility_summary: "For girls in KA, AP, TS who passed 10th and 12th from Govt schools. Pursuing UG in any field.",
    min_marks_percent: 60, max_family_income_lpa: 999, difficulty: "medium", success_rate_estimate: 40, selection_process: "merit",
    required_documents: ["Aadhaar","Govt School Certificates","12th Marksheet","Bank Passbook"],
    application_link: "https://www.santoorscholarships.com/", official_portal: "https://www.wipro.com",
    apply_time_minutes: 45, tags: ["santoor","wipro","women","govt-school","south-india","live2026"],
    faq: [{ q: "Can I apply if I studied in a private school?", a: "No, must have passed from a Govt school." }]
  },
  {
    id: "glow-lovely-2026", name: "Glow & Lovely Career Foundation Scholarship", provider: "Hindustan Unilever",
    type: "ngo", field: ["arts","science","commerce","management","law"],
    level: ["undergraduate","postgraduate"], categories: ["women"],
    states: ["all"], amount: "₹25,000–₹50,000", amount_value: 50000,
    deadline: "2026-10-31", open_date: "2026-06-01", renewable: false,
    eligibility_summary: "For women aged 15-30 pursuing UG/PG. 60%+ in 10th & 12th. Income below ₹6 LPA.",
    min_marks_percent: 60, max_family_income_lpa: 6, difficulty: "medium", success_rate_estimate: 30, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Income Certificate","SOP"],
    application_link: "https://www.glowandlovelycareers.in/en/scholarship", official_portal: "https://www.hul.co.in",
    apply_time_minutes: 60, tags: ["glow-lovely","women","career","hul","live2026"],
    faq: [{ q: "What courses are eligible?", a: "Most UG and PG courses are eligible." }]
  },
  {
    id: "jindal-foundation-2026", name: "Sitaram Jindal Foundation Scholarship", provider: "Sitaram Jindal Foundation",
    type: "ngo", field: ["engineering","medical","arts","science","commerce","diploma","iti"],
    level: ["class11-12","undergraduate","postgraduate","diploma","iti"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "₹500–₹2,500/month", amount_value: 30000,
    deadline: "2026-12-31", open_date: "2026-04-01", renewable: true,
    eligibility_summary: "Merit-based scholarship for school and college students. No application fee. Apply offline or via portal.",
    min_marks_percent: 65, max_family_income_lpa: 4, difficulty: "medium", success_rate_estimate: 45, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Income Certificate","Principal Recommendation"],
    application_link: "https://www.sitaramjindalfoundation.org/scholarships-for-students-in-bangalore-india.php", official_portal: "https://www.sitaramjindalfoundation.org",
    apply_time_minutes: 60, tags: ["jindal","merit","ngo","school","college","live2026"],
    faq: [{ q: "Is it online or offline?", a: "Both options are available, though offline is preferred by the foundation." }]
  },
  {
    id: "sekhsaria-pg-2026", name: "Narotam Sekhsaria Scholarship", provider: "Narotam Sekhsaria Foundation",
    type: "ngo", field: ["engineering","medical","science","management","arts"],
    level: ["postgraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "Interest-free loan up to ₹20,00,000", amount_value: 2000000,
    deadline: "2026-03-31", open_date: "2026-01-01", renewable: false,
    eligibility_summary: "For Indian students pursuing PG in India or abroad. High merit required. Interview-based selection.",
    min_marks_percent: 75, max_family_income_lpa: 999, difficulty: "hard", success_rate_estimate: 5, selection_process: "merit+interview",
    required_documents: ["Aadhaar","UG Transcripts","Admission Letter","SOP","LOR"],
    application_link: "https://scholarships.nsfoundation.co.in/", official_portal: "https://www.nsfoundation.co.in",
    apply_time_minutes: 150, tags: ["sekhsaria","postgraduate","loan","merit","live2026"],
    faq: [{ q: "Is it a grant or a loan?", a: "It is an interest-free loan that must be repaid after the course." }]
  },
  {
    id: "nikon-photo-2026", name: "Nikon Scholarship Program", provider: "Nikon India",
    type: "ngo", field: ["arts"],
    level: ["undergraduate","diploma"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "Up to ₹1,00,000", amount_value: 100000,
    deadline: "2026-10-31", open_date: "2026-06-01", renewable: false,
    eligibility_summary: "For students pursuing photography courses (3 months or more). 10th/12th passed. Income below ₹6 LPA.",
    min_marks_percent: 0, max_family_income_lpa: 6, difficulty: "medium", success_rate_estimate: 20, selection_process: "portfolio",
    required_documents: ["Aadhaar","Course Admission Proof","Photography Portfolio","Income Certificate"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://www.nikon.co.in",
    apply_time_minutes: 90, tags: ["nikon","photography","arts","portfolio","live2026"],
    faq: [{ q: "Is any specific camera required?", a: "No, but you must be enrolled in a recognized photography course." }]
  },
  {
    id: "stfc-merit-2026", name: "STFC Meritorious Scholarship", provider: "Shriram Transport Finance",
    type: "ngo", field: ["engineering","medical","arts","science","commerce","diploma"],
    level: ["class11-12","undergraduate","diploma"], categories: ["general","obc","sc","st","ews"],
    states: ["all"], amount: "₹10,000–₹35,000", amount_value: 35000,
    deadline: "2026-11-30", open_date: "2026-06-15", renewable: true,
    eligibility_summary: "For children of transport drivers. Minimum 60% in previous exam. Family income below ₹4 LPA.",
    min_marks_percent: 60, max_family_income_lpa: 4, difficulty: "easy", success_rate_estimate: 55, selection_process: "merit",
    required_documents: ["Aadhaar","Driver License of Parent","Marksheet","Income Certificate"],
    application_link: "https://www.buddy4study.com/scholarships", official_portal: "https://www.stfc.in",
    apply_time_minutes: 40, tags: ["stfc","transport","drivers-children","need-based","live2026"],
    faq: [{ q: "Is it only for heavy vehicle drivers?", a: "No, children of all commercial transport drivers can apply." }]
  },
  {
    id: "jsw-udaan-2026", name: "JSW Udaan Scholarship", provider: "JSW Foundation",
    type: "ngo", field: ["engineering","medical","arts","science","commerce","management"],
    level: ["undergraduate","postgraduate"], categories: ["general","obc","sc","st","ews","minority"],
    states: ["all"], amount: "Varies (up to ₹50,000)", amount_value: 50000,
    deadline: "2026-10-15", open_date: "2026-05-01", renewable: true,
    eligibility_summary: "Need-based scholarship for meritorious students. Preference to candidates from JSW plant locations.",
    min_marks_percent: 65, max_family_income_lpa: 8, difficulty: "medium", success_rate_estimate: 40, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Income Certificate","Admission Letter"],
    application_link: "https://www.jswudaan.com/", official_portal: "https://www.jsw.in",
    apply_time_minutes: 55, tags: ["jsw","udaan","corporate-social","merit","live2026"],
    faq: [{ q: "What is the priority?", a: "Priority to students from villages near JSW plants." }]
  },
  {
    id: "tata-realty-arch-2026", name: "TATA Realty Scholarship for Architecture", provider: "TATA Realty",
    type: "ngo", field: ["architecture"],
    level: ["undergraduate"], categories: ["women"],
    states: ["all"], amount: "Up to ₹1,00,000", amount_value: 100000,
    deadline: "2026-08-31", open_date: "2026-04-15", renewable: true,
    eligibility_summary: "For girls in 1st/2nd/3rd year of B.Arch. 60%+ in 12th. Income below ₹5 LPA.",
    min_marks_percent: 60, max_family_income_lpa: 5, difficulty: "medium", success_rate_estimate: 25, selection_process: "merit",
    required_documents: ["Aadhaar","Marksheet","Architecture Admission Proof","Income Certificate"],
    application_link: "https://www.vidyasaarathi.co.in/Vidyasaarathi/scholarship", official_portal: "https://www.tatarealty.in",
    apply_time_minutes: 60, tags: ["tata","architecture","girls","merit","live2026"],
    faq: [{ q: "Can boys apply?", a: "No, this specific scheme is for women in architecture." }]
  },
];

export const MOCK_USER = {
  name: "Priya Sharma",
  email: "priya@vjti.ac.in",
  state: "Maharashtra",
  city: "Mumbai",
  category: "General",
  level: "undergraduate",
  field: "engineering",
  specialisation: "Electronics Engineering",
  college: "VJTI Mumbai",
  board: "Maharashtra HSC",
  marks_percent: 78,
  cgpa: 7.8,
  year_of_admission: 2023,
  annual_income_lpa: 3.5,
  is_first_gen: true,
  gender: "Female",
  dob: "2004-05-15",
  mobile: "9876543210",
  whatsapp_opted_in: false,
  profile_complete: 72,
  goals: "Build affordable IoT healthcare devices for rural India",
  documents_uploaded: ["Aadhaar Card", "Class 12 Marksheet", "Income Certificate"],
};
