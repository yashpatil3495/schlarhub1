-- ============================================================
-- ScholarHub — Seed Data
-- Run AFTER 001_schema.sql
-- ============================================================

INSERT INTO public.scholarships (
  id, name, provider, type, field, level, categories, states,
  amount, amount_value, deadline, open_date, renewable,
  eligibility_summary, min_marks_percent, max_family_income_lpa,
  required_documents, application_link, official_portal,
  apply_time_minutes, difficulty, selection_process, interview_details,
  success_rate_estimate, tags, is_verified, is_featured, faq
) VALUES

('nsp-css', 'Central Sector Scheme of Scholarships', 'MHRD / NSP',
 'government', ARRAY['engineering','medical','science','arts','commerce'],
 ARRAY['undergraduate'], ARRAY['general','obc','sc','st','ews'],
 ARRAY['all'], '₹12,000/year', 12000, '2025-10-31', '2025-08-01', TRUE,
 'For students scoring top 20 percentile in Class 12 board exams. Family income must be below ₹8 LPA.',
 80, 8,
 ARRAY['Aadhaar Card','Class 12 Marksheet','Income Certificate','Bank Passbook','Admission Letter'],
 'https://scholarships.gov.in', 'https://scholarships.gov.in',
 45, 'easy', 'merit', NULL, 72,
 ARRAY['government','renewable','merit','nsp'], TRUE, TRUE,
 '[{"q":"Can I apply if I missed last year?","a":"No, you must apply fresh each year."},{"q":"Is it renewable?","a":"Yes, if you maintain minimum marks."}]'),

('pm-yasasvi', 'PM YASASVI Scholarship', 'Ministry of Social Justice',
 'government', ARRAY['engineering','medical','arts','science','commerce','law'],
 ARRAY['class9-10','class11-12','undergraduate'], ARRAY['obc','ews'],
 ARRAY['all'], '₹75,000–₹1,25,000/year', 75000, '2025-09-30', '2025-07-15', TRUE,
 'For OBC/EWS students studying in class 9 to undergraduate level. Income ceiling ₹2.5 LPA.',
 60, 2.5,
 ARRAY['Aadhaar Card','OBC/EWS Certificate','Income Certificate','Marksheet','Bank Passbook'],
 'https://scholarships.gov.in', 'https://scholarships.gov.in',
 40, 'easy', 'merit', NULL, 65,
 ARRAY['government','obc','ews','central'], TRUE, FALSE,
 '[{"q":"Is it available for postgraduate students?","a":"No, only up to undergraduate level."}]'),

('tata-pankh', 'Tata Capital Pankh Scholarship', 'Tata Capital',
 'private', ARRAY['engineering','medical','arts','science','commerce'],
 ARRAY['class11-12','undergraduate'], ARRAY['general','obc','sc','st','ews','minority'],
 ARRAY['all'], 'Up to ₹50,000/year', 50000, '2025-11-15', '2025-09-01', TRUE,
 'For meritorious students from economically weaker sections. Open to all categories. Min 60% in last exam.',
 60, 4,
 ARRAY['Aadhaar','Marksheet','Income Certificate','Admission Letter','Photo'],
 'https://www.tatacapital.com/about-us/csr/pankh-scholarship.html', 'https://www.tatacapital.com',
 60, 'medium', 'merit+interview', 'Online video interview with Tata Capital panel, ~20 mins', 45,
 ARRAY['tata','private','interview'], TRUE, TRUE,
 '[{"q":"What does the interview cover?","a":"Academic goals, financial background, and future plans."}]'),

('reliance-found', 'Reliance Foundation Scholarship', 'Reliance Foundation',
 'private', ARRAY['engineering','science'],
 ARRAY['undergraduate','postgraduate'], ARRAY['general','obc','sc','st','ews'],
 ARRAY['all'], '₹2,00,000/year + mentorship', 200000, '2025-12-01', '2025-09-15', FALSE,
 'For engineering and science students in top universities. Focus on innovation and community impact. Min 60% in 12th.',
 60, 6,
 ARRAY['Aadhaar','Marksheet','Income Certificate','Essays','Portfolio'],
 'https://www.reliancefoundation.org/scholarships', 'https://www.reliancefoundation.org',
 120, 'hard', 'merit+interview', 'Two-stage selection: written assessment + video interview', 15,
 ARRAY['reliance','corporate','stem','flagship'], TRUE, TRUE,
 '[{"q":"What is the mentorship component?","a":"1-on-1 mentoring from Reliance professionals."}]'),

('inspire-dst', 'INSPIRE Scholarship for Higher Education', 'Dept. of Science & Technology',
 'government', ARRAY['science'],
 ARRAY['undergraduate','postgraduate'], ARRAY['general','obc','sc','st','ews','minority'],
 ARRAY['all'], '₹80,000/year', 80000, '2025-10-15', '2025-08-15', TRUE,
 'For students who scored top 1% in Class 12 and enrolled in science programs at reputed institutions.',
 90, 999,
 ARRAY['Aadhaar','Class 12 Marksheet','Admission Letter','Research Proposal'],
 'http://www.inspire-dst.gov.in', 'http://www.inspire-dst.gov.in',
 60, 'medium', 'merit', NULL, 40,
 ARRAY['science','DST','merit','renewable'], TRUE, FALSE,
 '[{"q":"Is there a research component?","a":"Yes, a summer research internship is required."}]'),

('maha-bahujan', 'Bahujan Welfare Scholarship Maharashtra', 'Social Welfare Dept, Maharashtra',
 'government', ARRAY['engineering','medical','arts','science','commerce','law'],
 ARRAY['class11-12','undergraduate','postgraduate'], ARRAY['sc','st'],
 ARRAY['Maharashtra'], 'Full tuition + ₹550/month', 80000, '2025-09-15', '2025-07-01', TRUE,
 'For SC/ST students domiciled in Maharashtra. Covers full tuition fees plus monthly maintenance allowance.',
 45, 2.5,
 ARRAY['Aadhaar','Domicile Certificate','Caste Certificate','Income Certificate','Marksheet'],
 'https://mahaeschol.maharashtra.gov.in', 'https://mahaeschol.maharashtra.gov.in',
 30, 'easy', 'merit', NULL, 80,
 ARRAY['maharashtra','sc','st','state-govt'], TRUE, FALSE,
 '[{"q":"Is domicile certificate mandatory?","a":"Yes, you must be a Maharashtra domicile."}]'),

('aicte-pragati', 'AICTE Pragati Scholarship for Girls', 'AICTE',
 'government', ARRAY['engineering'],
 ARRAY['undergraduate'], ARRAY['women'],
 ARRAY['all'], '₹50,000/year', 50000, '2025-10-20', '2025-08-20', TRUE,
 'For female students in AICTE-approved engineering colleges. One girl per family, max family income ₹8 LPA.',
 0, 8,
 ARRAY['Aadhaar','Income Certificate','Admission Letter','Bank Passbook','Family Declaration'],
 'https://www.aicte-india.org/bureaus/development/pragati-scholarship', 'https://www.aicte-india.org',
 40, 'easy', 'merit', NULL, 68,
 ARRAY['girls','engineering','AICTE','women-specific'], TRUE, TRUE,
 '[{"q":"Is there a marks cutoff?","a":"No minimum marks; it is based on merit among eligible girls."}]'),

('kvpy', 'KVPY — Kishore Vaigyanik Protsahan Yojana', 'IISc / DST',
 'government', ARRAY['science'],
 ARRAY['class11-12','undergraduate'], ARRAY['general','obc','sc','st','ews'],
 ARRAY['all'], '₹5,000–₹7,000/month', 84000, '2025-09-01', '2025-07-01', TRUE,
 'National competitive exam for science students. For class 11 to 1st year BSc/BS students.',
 60, 999,
 ARRAY['Aadhaar','Marksheet','School/College Certificate','Photo'],
 'http://www.kvpy.iisc.ernet.in', 'http://www.kvpy.iisc.ernet.in',
 90, 'hard', 'merit+interview', 'Aptitude test followed by personal interview at IISc Bangalore', 5,
 ARRAY['kvpy','research','science','prestigious','exam'], TRUE, FALSE,
 '[{"q":"What is the exam pattern?","a":"Aptitude test in Biology, Chemistry, Math, and Physics."}]'),

('hdfc-crisis', 'HDFC Education Crisis Scholarship', 'HDFC Bank',
 'private', ARRAY['engineering','medical','arts','science','commerce','law'],
 ARRAY['class11-12','undergraduate','postgraduate'], ARRAY['general','obc','sc','st','ews','minority'],
 ARRAY['all'], 'Up to ₹75,000', 75000, '2025-10-31', '2025-09-01', FALSE,
 'For students who have faced a family financial crisis. Min 55% in last exam.',
 55, 5,
 ARRAY['Aadhaar','Crisis Documentation','Income Certificate','Marksheet','Admission Letter'],
 'https://www.hdfcbank.com/csr', 'https://www.hdfcbank.com',
 60, 'medium', 'merit', NULL, 38,
 ARRAY['hdfc','crisis','bank','private'], TRUE, FALSE,
 '[{"q":"What counts as a financial crisis?","a":"Job loss, medical emergency, natural disaster affecting family income."}]'),

('ugc-pg', 'UGC PG Scholarship', 'University Grants Commission',
 'government', ARRAY['arts','science','commerce'],
 ARRAY['postgraduate'], ARRAY['general','obc','sc','st','ews'],
 ARRAY['all'], '₹7,800/month', 93600, '2025-11-30', '2025-10-01', TRUE,
 'For PG students based on merit in CSIR-NET / university entrance exams. No income limit.',
 55, 999,
 ARRAY['Aadhaar','NET Score Card','Admission Letter','Marksheets'],
 'https://ugcnet.nta.nic.in', 'https://www.ugc.ac.in',
 45, 'medium', 'merit', NULL, 35,
 ARRAY['ugc','postgraduate','national'], TRUE, FALSE,
 '[{"q":"Do I need to qualify NET?","a":"You must rank in top 10 percentile of qualifying exam."}]'),

('maha-minority', 'Minority Scholarship Maharashtra', 'Maharashtra Minority Development',
 'government', ARRAY['engineering','medical','arts','science','commerce','management','law'],
 ARRAY['class11-12','undergraduate','postgraduate'], ARRAY['minority'],
 ARRAY['Maharashtra'], '₹60,000–₹1,00,000/year', 60000, '2025-10-10', '2025-08-10', TRUE,
 'For minority students domiciled in Maharashtra. Family income below ₹8 LPA.',
 50, 8,
 ARRAY['Aadhaar','Minority Certificate','Income Certificate','Domicile','Marksheet'],
 'https://mahadbt.maharashtra.gov.in', 'https://mahadbt.maharashtra.gov.in',
 35, 'easy', 'merit', NULL, 70,
 ARRAY['maharashtra','minority','state-govt'], TRUE, FALSE,
 '[{"q":"Which religions qualify as minority?","a":"Muslim, Christian, Buddhist, Sikh, Jain, Parsi."}]'),

('buddy4study-shiksha', 'Buddy4Study Shiksha Scholarship', 'Buddy4Study Foundation',
 'ngo', ARRAY['engineering','arts','science','commerce','management'],
 ARRAY['undergraduate'], ARRAY['general','obc','sc','st','ews','minority','women'],
 ARRAY['all'], '₹25,000–₹40,000', 40000, '2025-09-20', '2025-07-20', FALSE,
 'For first-generation college students from low-income families. Min 60% in Class 12.',
 60, 3,
 ARRAY['Aadhaar','Class 12 Marksheet','Income Certificate','First-Gen Declaration','SOP'],
 'https://www.buddy4study.com', 'https://www.buddy4study.com',
 80, 'medium', 'essay', NULL, 30,
 ARRAY['first-gen','ngo','essay'], FALSE, FALSE,
 '[{"q":"Is SOP mandatory?","a":"Yes, a 500-word Statement of Purpose is required."}]');

-- ============================================================
-- SEED: Sample Mentors (public data, no auth required)
-- NOTE: These are created without user_id for demo purposes.
-- In production, mentors sign up and create their own profiles.
-- ============================================================
-- (Skipped in seed — mentors self-register via the app)

-- ============================================================
-- SEED: Sample Challenges
-- ============================================================
INSERT INTO public.challenges (
  sponsor_name, sponsor_logo, title, description, type,
  prize_amount, total_slots, deadline, rubric, word_limit, status
) VALUES
(
  'GreenFuture Foundation', '🌱',
  'Write a 500-word essay on climate solutions for rural India',
  'We are looking for creative, evidence-based essays from students about specific, actionable climate solutions that can be implemented in rural Indian villages. Focus on water conservation, sustainable agriculture, or renewable energy.',
  'essay', 2000, 5, '2025-09-15',
  '[{"criterion":"Originality","weight":30},{"criterion":"Evidence","weight":25},{"criterion":"Practicality","weight":25},{"criterion":"Writing Quality","weight":20}]',
  500, 'active'
),
(
  'StartupIndia Foundation', '🚀',
  'Design a 2-minute pitch for a social enterprise idea',
  'Submit a written pitch (500-700 words) for a social enterprise that addresses a real problem in education, healthcare, or agriculture in India.',
  'project_brief', 5000, 3, '2025-10-01',
  '[{"criterion":"Problem Clarity","weight":25},{"criterion":"Innovation","weight":30},{"criterion":"Feasibility","weight":25},{"criterion":"Impact Potential","weight":20}]',
  700, 'active'
),
(
  'ScienceTales NGO', '🔬',
  'Explain a complex scientific concept to a 10-year-old',
  'Choose any concept from Physics, Chemistry, Biology, or Mathematics and write an explanation that a curious 10-year-old could understand and enjoy.',
  'creative', 1500, 8, '2025-09-25',
  '[{"criterion":"Clarity","weight":35},{"criterion":"Creativity","weight":30},{"criterion":"Accuracy","weight":20},{"criterion":"Engagement","weight":15}]',
  400, 'active'
),
(
  'PayTech Inclusion Trust', '💳',
  'Research report: Impact of digital payments on Indian MSMEs',
  'Write a data-backed research brief examining how UPI and digital payment adoption has affected Micro, Small and Medium Enterprises in India.',
  'research', 3500, 4, '2025-10-20',
  '[{"criterion":"Data Quality","weight":30},{"criterion":"Analysis","weight":30},{"criterion":"Originality","weight":20},{"criterion":"Writing","weight":20}]',
  800, 'active'
);
