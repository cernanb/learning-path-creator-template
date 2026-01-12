create extension if not exists "uuid-ossp";

create table public.profile_suggestions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- The AI-generated suggestions (stored as JSON)
  suggestions jsonb not null,
  
  -- The input data that generated these suggestions (for reference)
  input_data jsonb not null,
  
  -- Tracking fields
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  viewed_at timestamp with time zone,
  
  -- Completion tracking (array of suggestion titles marked as completed)
  completed_suggestions jsonb default '[]'::jsonb,
  
  -- Optional: User rating of suggestions (1-5)
  rating integer check (rating >= 1 and rating <= 5)
);

-- Enable Row Level Security
alter table public.profile_suggestions enable row level security;

-- Create policies
-- Users can only view their own suggestions
create policy "Users can view own suggestions"
  on public.profile_suggestions
  for select
  using ((select auth.uid()) = user_id);

-- Users can insert their own suggestions
create policy "Users can insert own suggestions"
  on public.profile_suggestions
  for insert
  with check ((select auth.uid()) = user_id);

-- Users can update their own suggestions (for marking as completed, rating)
create policy "Users can update own suggestions"
  on public.profile_suggestions
  for update
  using ((select auth.uid()) = user_id);

-- Create indexes for better query performance
create index profile_suggestions_user_id_idx on public.profile_suggestions(user_id);
create index profile_suggestions_created_at_idx on public.profile_suggestions(created_at desc);

-- Create a function to get the most recent suggestions for a user
create or replace function public.get_latest_profile_suggestions(uid uuid)
returns jsonb as $$
  select suggestions
  from public.profile_suggestions
  where user_id = uid
  order by created_at desc
  limit 1;
$$ language sql security definer;

-- Grant permissions
grant usage on schema public to anon, authenticated;
grant all on public.profile_suggestions to authenticated;

-- Add helpful comments
comment on table public.profile_suggestions is 'AI-generated learning suggestions for user profiles';
comment on column public.profile_suggestions.suggestions is 'Array of suggestion objects with title, reason, and action';
comment on column public.profile_suggestions.input_data is 'User input that generated these suggestions (background, goals, experience level)';
comment on column public.profile_suggestions.completed_suggestions is 'Array of suggestion titles that user marked as completed';
comment on column public.profile_suggestions.rating is 'User rating of suggestions quality (1-5 stars)';
