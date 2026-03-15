-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'team');
CREATE TYPE note_category AS ENUM ('Project', 'Ideas', 'Meeting', 'Personal', 'Design', 'Uncategorized');

-- Create public.users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier subscription_tier DEFAULT 'free' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create folders table
CREATE TABLE public.folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Create notes table
CREATE TABLE public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    title TEXT DEFAULT 'Untitled' NOT NULL,
    content TEXT DEFAULT '' NOT NULL,
    category note_category DEFAULT 'Uncategorized' NOT NULL,
    is_starred BOOLEAN DEFAULT FALSE NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create note_shares table for collaboration
CREATE TABLE public.note_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    permission TEXT CHECK (permission IN ('read', 'edit')) DEFAULT 'read' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(note_id, user_id)
);

-- Enable RLS on note_shares
ALTER TABLE public.note_shares ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for folders
CREATE POLICY "Users can view their own folders" ON public.folders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders" ON public.folders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" ON public.folders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" ON public.folders
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notes
CREATE POLICY "Users can view their own or shared notes" ON public.notes
    FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.note_shares
            WHERE note_shares.note_id = notes.id
            AND note_shares.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own notes" ON public.notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own or shared notes with edit permission" ON public.notes
    FOR UPDATE USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.note_shares
            WHERE note_shares.note_id = notes.id
            AND note_shares.user_id = auth.uid()
            AND note_shares.permission = 'edit'
        )
    );

CREATE POLICY "Users can delete their own notes" ON public.notes
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for note_shares
CREATE POLICY "Users can view shares for their own notes" ON public.note_shares
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.notes
            WHERE notes.id = note_shares.note_id
            AND notes.user_id = auth.uid()
        )
        OR auth.uid() = user_id
    );

CREATE POLICY "Users can share their own notes" ON public.note_shares
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.notes
            WHERE notes.id = note_id
            AND notes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update/delete their own note shares" ON public.note_shares
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.notes
            WHERE notes.id = note_shares.note_id
            AND notes.user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;   
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER on_user_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_folder_updated BEFORE UPDATE ON public.folders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_note_updated BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER on_note_share_updated BEFORE UPDATE ON public.note_shares FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
