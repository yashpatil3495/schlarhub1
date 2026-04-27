-- ============================================================
-- ScholarHub — Complete Supabase Schema
-- Run this in your Supabase project: SQL Editor → New Query
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

-- ============================================================
-- 1. USER PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT,
  dob                 DATE,
  gender              TEXT CHECK (gender IN ('Female','Male','Non-binary','Prefer not to say')),
  mobile              TEXT,
  state               TEXT,
  city                TEXT,
  category            TEXT DEFAULT 'General' CHECK (category IN ('General','OBC','SC','ST','EWS','Minority','Women','Disabled','Sports')),
  -- Academic
  level               TEXT DEFAULT 'undergraduate' CHECK (level IN ('class9-10','class11-12','undergraduate','postgraduate','phd','diploma')),
  field               TEXT DEFAULT 'engineering' CHECK (field IN ('engineering','medical','science','arts','commerce','law','management','general')),
  specialisation      TEXT,
  college             TEXT,
  board               TEXT,
  marks_percent       NUMERIC(5,2),
  cgpa                NUMERIC(4,2),
  year_of_admission   INTEGER,
  -- Financial
  annual_income_lpa   NUMERIC(6,2),
  is_first_gen        BOOLEAN DEFAULT FALSE,
  -- Preferences
  goals               TEXT,
  whatsapp_opted_in   BOOLEAN DEFAULT FALSE,
  notify_email        BOOLEAN DEFAULT TRUE,
  notify_push         BOOLEAN DEFAULT TRUE,
  notify_whatsapp     BOOLEAN DEFAULT FALSE,
  profile_complete    INTEGER DEFAULT 0,
  -- Timestamps
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. SCHOLARSHIPS
-- ============================================================
CREATE TABLE public.scholarships (
  id                      TEXT PRIMARY KEY,
  name                    TEXT NOT NULL,
  provider                TEXT NOT NULL,
  type                    TEXT CHECK (type IN ('government','private','ngo','international')),
  field                   TEXT[] DEFAULT '{}',
  level                   TEXT[] DEFAULT '{}',
  categories              TEXT[] DEFAULT '{}',
  states                  TEXT[] DEFAULT '{"all"}',
  amount                  TEXT,
  amount_value            INTEGER DEFAULT 0,
  deadline                DATE,
  open_date               DATE,
  renewable               BOOLEAN DEFAULT FALSE,
  eligibility_summary     TEXT,
  eligibility_details     TEXT,
  min_marks_percent       NUMERIC(5,2) DEFAULT 0,
  max_family_income_lpa   NUMERIC(6,2) DEFAULT 999,
  required_documents      TEXT[] DEFAULT '{}',
  application_link        TEXT,
  official_portal         TEXT,
  apply_time_minutes      INTEGER DEFAULT 45,
  difficulty              TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  selection_process       TEXT DEFAULT 'merit',
  interview_details       TEXT,
  success_rate_estimate   INTEGER DEFAULT 50,
  total_seats             INTEGER,
  tips                    TEXT,
  faq                     JSONB DEFAULT '[]',
  tags                    TEXT[] DEFAULT '{}',
  is_verified             BOOLEAN DEFAULT FALSE,
  is_featured             BOOLEAN DEFAULT FALSE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scholarships_deadline   ON public.scholarships(deadline);
CREATE INDEX idx_scholarships_type       ON public.scholarships(type);
CREATE INDEX idx_scholarships_field      ON public.scholarships USING GIN(field);
CREATE INDEX idx_scholarships_categories ON public.scholarships USING GIN(categories);
CREATE INDEX idx_scholarships_states     ON public.scholarships USING GIN(states);
CREATE INDEX idx_scholarships_tags       ON public.scholarships USING GIN(tags);
CREATE INDEX idx_scholarships_name_fts   ON public.scholarships USING GIN(to_tsvector('english', name || ' ' || COALESCE(provider,'') || ' ' || COALESCE(eligibility_summary,'')));

-- ============================================================
-- 3. SAVED SCHOLARSHIPS
-- ============================================================
CREATE TABLE public.user_saved_scholarships (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scholarship_id  TEXT NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  saved_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

CREATE INDEX idx_saved_user    ON public.user_saved_scholarships(user_id);
CREATE INDEX idx_saved_schol   ON public.user_saved_scholarships(scholarship_id);

-- ============================================================
-- 4. APPLICATION TRACKER
-- ============================================================
CREATE TABLE public.application_tracker (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scholarship_id  TEXT NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  stage           TEXT DEFAULT 'Not Started' CHECK (stage IN (
    'Not Started','Researching','Preparing Docs','Applied',
    'Under Review','Result Pending','Won','Rejected'
  )),
  note            TEXT,
  amount_won      INTEGER DEFAULT 0,
  interview_date  DATE,
  result_date     DATE,
  ref_number      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

CREATE INDEX idx_tracker_user ON public.application_tracker(user_id);

CREATE TRIGGER tracker_updated_at
  BEFORE UPDATE ON public.application_tracker
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. DOCUMENT VAULT
-- ============================================================
CREATE TABLE public.user_documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doc_type        TEXT NOT NULL,
  label           TEXT NOT NULL,
  file_path       TEXT NOT NULL,    -- Supabase Storage path
  file_name       TEXT NOT NULL,
  file_size       INTEGER,
  mime_type       TEXT,
  ocr_extracted   JSONB,            -- parsed OCR data
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_docs_user ON public.user_documents(user_id);

-- ============================================================
-- 6. SOP PEER REVIEW
-- ============================================================
CREATE TABLE public.sop_reviews (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scholarship_id    TEXT REFERENCES public.scholarships(id),
  scholarship_name  TEXT NOT NULL,
  sop_text          TEXT NOT NULL,
  word_count        INTEGER,
  status            TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review','in_review','reviewed','withdrawn')),
  reviews_needed    INTEGER DEFAULT 2,
  reviews_received  INTEGER DEFAULT 0,
  karma_earned      INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sop_reviews_status ON public.sop_reviews(status);
CREATE INDEX idx_sop_reviews_author ON public.sop_reviews(author_id);

CREATE TABLE public.peer_reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sop_id          UUID NOT NULL REFERENCES public.sop_reviews(id) ON DELETE CASCADE,
  reviewer_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  clarity_score   INTEGER CHECK (clarity_score BETWEEN 1 AND 5),
  relevance_score INTEGER CHECK (relevance_score BETWEEN 1 AND 5),
  impact_score    INTEGER CHECK (impact_score BETWEEN 1 AND 5),
  overall_score   INTEGER CHECK (overall_score BETWEEN 1 AND 5),
  strengths       TEXT,
  improvements    TEXT,
  is_helpful      BOOLEAN,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sop_id, reviewer_id)
);

-- Auto-increment review count
CREATE OR REPLACE FUNCTION increment_review_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.sop_reviews
  SET reviews_received = reviews_received + 1,
      status = CASE WHEN reviews_received + 1 >= reviews_needed THEN 'reviewed' ELSE status END
  WHERE id = NEW.sop_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_peer_review_created
  AFTER INSERT ON public.peer_reviews
  FOR EACH ROW EXECUTE FUNCTION increment_review_count();

-- ============================================================
-- 7. MENTOR NETWORK
-- ============================================================
CREATE TABLE public.mentors (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  college               TEXT,
  field                 TEXT,
  year_of_study         TEXT,
  bio                   TEXT,
  scholarships_won      JSONB DEFAULT '[]',
  availability          TEXT DEFAULT 'async_only' CHECK (availability IN ('async_only','calendar','both')),
  calendly_url          TEXT,
  response_time_days    INTEGER DEFAULT 3,
  total_students_helped INTEGER DEFAULT 0,
  rating                NUMERIC(3,2) DEFAULT 0,
  is_verified           BOOLEAN DEFAULT FALSE,
  is_active             BOOLEAN DEFAULT TRUE,
  tags                  TEXT[] DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mentors_active    ON public.mentors(is_active, is_verified);
CREATE INDEX idx_mentors_tags      ON public.mentors USING GIN(tags);

-- ============================================================
-- 8. MICRO-CHALLENGES
-- ============================================================
CREATE TABLE public.challenges (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_name      TEXT NOT NULL,
  sponsor_logo      TEXT,
  title             TEXT NOT NULL,
  description       TEXT,
  type              TEXT CHECK (type IN ('essay','quiz','project_brief','creative','research')),
  prize_amount      INTEGER NOT NULL,
  total_slots       INTEGER NOT NULL,
  deadline          DATE NOT NULL,
  rubric            JSONB DEFAULT '[]',
  word_limit        INTEGER,
  status            TEXT DEFAULT 'active' CHECK (status IN ('draft','active','review','completed')),
  submissions_count INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.challenge_submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id    UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  ai_score        INTEGER,
  ai_feedback     JSONB,
  sponsor_score   INTEGER,
  is_winner       BOOLEAN DEFAULT FALSE,
  payment_status  TEXT DEFAULT 'pending',
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, student_id)
);

-- ============================================================
-- 9. NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  icon        TEXT,
  color       TEXT,
  is_read     BOOLEAN DEFAULT FALSE,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifs_user_unread ON public.notifications(user_id, is_read, created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles: users can only read/write their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Scholarships: public read
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scholarships are publicly readable" ON public.scholarships FOR SELECT USING (TRUE);

-- Saved scholarships: own only
ALTER TABLE public.user_saved_scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved" ON public.user_saved_scholarships FOR ALL USING (auth.uid() = user_id);

-- Tracker: own only
ALTER TABLE public.application_tracker ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tracker" ON public.application_tracker FOR ALL USING (auth.uid() = user_id);

-- Documents: own only
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own documents" ON public.user_documents FOR ALL USING (auth.uid() = user_id);

-- SOP Reviews: authors own their SOPs; reviewers can see pending ones
ALTER TABLE public.sop_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authors manage own SOPs" ON public.sop_reviews FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Any logged in user can see pending SOPs" ON public.sop_reviews FOR SELECT USING (auth.uid() IS NOT NULL AND status = 'pending_review');

-- Peer reviews: reviewers own their reviews; SOP authors can read reviews on their SOPs
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviewer manages own review" ON public.peer_reviews FOR ALL USING (auth.uid() = reviewer_id);
CREATE POLICY "Author reads reviews on their SOP" ON public.peer_reviews FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.sop_reviews WHERE id = sop_id AND author_id = auth.uid()));

-- Mentors: public read, own write
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors are publicly readable" ON public.mentors FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Mentors manage own profile" ON public.mentors FOR ALL USING (auth.uid() = user_id);

-- Challenges: public read
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenges are publicly readable" ON public.challenges FOR SELECT USING (status = 'active');

-- Challenge submissions: own only
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own submissions" ON public.challenge_submissions FOR ALL USING (auth.uid() = student_id);

-- Notifications: own only
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Run these in Supabase Dashboard → Storage → New Bucket
-- Or via API:
--   INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies (after creating buckets):
-- CREATE POLICY "Users upload own docs" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users read own docs" ON storage.objects FOR SELECT
--   USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users delete own docs" ON storage.objects FOR DELETE
--   USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
