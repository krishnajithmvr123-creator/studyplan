-- ================================================================
-- StudyFlow - Student Syllabus & Progress Cloud Database Schema
-- Idempotent & Safe to run multiple times in Supabase SQL Editor
-- ================================================================

-- 1. Create Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    exam_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    weight VARCHAR(50),
    order_index INT DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Topics Table
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    est_hours NUMERIC(4, 1) DEFAULT 2.0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Student Topic Progress Table
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'not-started', -- 'not-started', 'in-progress', 'completed', 'needs-revision'
    confidence INT DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 5),
    rev_1 BOOLEAN DEFAULT FALSE,
    rev_2 BOOLEAN DEFAULT FALSE,
    rev_3 BOOLEAN DEFAULT FALSE,
    time_spent_minutes INT DEFAULT 0,
    notes TEXT DEFAULT '',
    resources TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, topic_id)
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Drop existing policies first if they exist so it never errors
-- ================================================================

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- 1. Drop old/existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Students can view their own subjects" ON public.subjects;
DROP POLICY IF EXISTS "Students can insert their own subjects" ON public.subjects;
DROP POLICY IF EXISTS "Students can update their own subjects" ON public.subjects;
DROP POLICY IF EXISTS "Students can delete their own subjects" ON public.subjects;
DROP POLICY IF EXISTS "Students can manage their own subjects" ON public.subjects;
DROP POLICY IF EXISTS "Users can manage subjects" ON public.subjects;

DROP POLICY IF EXISTS "Students can manage their own modules" ON public.modules;
DROP POLICY IF EXISTS "Users can manage modules" ON public.modules;

DROP POLICY IF EXISTS "Students can manage their own topics" ON public.topics;
DROP POLICY IF EXISTS "Users can manage topics" ON public.topics;

DROP POLICY IF EXISTS "Students can manage their own progress" ON public.student_progress;
DROP POLICY IF EXISTS "Users can manage progress" ON public.student_progress;

-- 2. Re-create unified RLS policies (ALL covers SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Students can manage their own subjects" 
ON public.subjects FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can manage their own modules" 
ON public.modules FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can manage their own topics" 
ON public.topics FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can manage their own progress" 
ON public.student_progress FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
