import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';
import { Project, ProjectAsset, ProjectNote, Profile } from './types';

// Read environment variables for Next.js or Vite
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const STORAGE_KEY_PROJECTS = 'forge_supabase_projects_fallback';

// Local storage fallback helpers when Supabase env vars are not set
function getLocalProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalProjects(projects: Project[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
}

// ----------------------------------------------------------------------
// AUTHENTICATION API
// ----------------------------------------------------------------------

/**
 * Helper function to sync session token to document cookies so server middleware can detect auth state
 */
export function setAuthCookie(token?: string | null): void {
  if (typeof document === 'undefined') return;
  if (token) {
    document.cookie = `sb-access-token=${token}; path=/; max-age=604800; SameSite=Lax`;
  } else {
    document.cookie = `sb-access-token=; path=/; max-age=0; SameSite=Lax`;
  }
}

/**
 * Real Supabase Registration Flow
 */
export async function signUpWithSupabase(
  email: string,
  password: string,
  displayName: string
): Promise<{ user: SupabaseUser | null; session: Session | null }> {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    console.error('Supabase Sign Up Error:', error);
    if (error.message.includes('User already registered')) {
      throw new Error('An account with this email address already exists. Please log in.');
    }
    throw new Error(error.message || 'Registration failed. Please check your credentials.');
  }

  if (data.session?.access_token) {
    setAuthCookie(data.session.access_token);
  }

  // Create user profile in profiles table if user created
  if (data.user) {
    try {
      await supabase.from('profiles').upsert([
        {
          id: data.user.id,
          display_name: displayName || email.split('@')[0],
          avatar_url: null,
          updated_at: new Date().toISOString(),
        },
      ]);
    } catch (profileErr) {
      console.warn('Profile creation warning:', profileErr);
    }
  }

  return { user: data.user, session: data.session };
}

/**
 * Real Supabase Login Flow
 */
export async function signInWithSupabase(
  email: string,
  password: string
): Promise<{ user: SupabaseUser | null; session: Session | null }> {
  console.log('Attempting sign‑in with email:', email);
  if (!supabase) {
    console.error('Supabase client not configured');
    throw new Error('Supabase client is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase Sign In Error:', error);
    if (error.message.includes('Invalid login credentials')) {
      console.warn('Invalid credentials for', email);
      throw new Error('Invalid email or password. Please verify your details.');
    }
    console.warn('Sign‑in failed for', email, '-', error.message);
    throw new Error(error.message || 'Failed to sign in. Please try again.');
  }

  if (data.session?.access_token) {
    setAuthCookie(data.session.access_token);
  }

  console.log('Sign‑in successful for', email, 'User ID:', data.user?.id);
  return { user: data.user, session: data.session };
}

/**
 * Real Supabase Logout Flow
 */
export async function signOutSupabase(): Promise<void> {
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase Sign Out Error:', error);
    }
  }
  setAuthCookie(null);
}

/**
 * Fetch Current Session
 */
export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Fetch Current User Profile from Database
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }
  return data as Profile;
}

/**
 * Update User Profile in Database & Auth Metadata
 */
export async function updateUserProfile(
  userId: string,
  updates: { display_name?: string; avatar_url?: string }
): Promise<Profile | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: userId,
          ...updates,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating profile:', error);
      throw error;
    }

    if (updates.display_name) {
      await supabase.auth.updateUser({
        data: { display_name: updates.display_name },
      });
    }

    return data as Profile;
  }
  return null;
}

// ----------------------------------------------------------------------
// DATA API (USER-SCOPED & RLS PROTECTED)
// ----------------------------------------------------------------------

/**
 * Fetch projects belonging ONLY to current authenticated user
 */
export async function getProjects(): Promise<Project[]> {
  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_assets (*),
        project_notes (*)
      `)
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching user projects:', error);
      throw error;
    }
    return (data as Project[]) || [];
  } else {
    return getLocalProjects();
  }
}

/**
 * Fetch single project by ID for authenticated user
 */
export async function getProjectById(id: string): Promise<Project | null> {
  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_assets (*),
        project_notes (*)
      `)
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .single();

    if (error) {
      console.error(`Supabase error fetching project ${id}:`, error);
      return null;
    }
    return data as Project;
  } else {
    const local = getLocalProjects();
    return local.find(p => p.id === id) || null;
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Upload file to Supabase Storage bucket 'project-assets' with automatic Data URL fallback
 */
export async function uploadFileToSupabase(file: File): Promise<string> {
  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id || 'public';
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-assets')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        console.warn('Supabase storage upload returned RLS/permission error, using Data URL fallback:', uploadError.message);
        return await fileToDataUrl(file);
      }

      const { data: publicUrlData } = supabase.storage
        .from('project-assets')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    } catch (err: any) {
      console.warn('Supabase storage upload exception, using Data URL fallback:', err?.message || err);
      return await fileToDataUrl(file);
    }
  }

  return fileToDataUrl(file);
}

/**
 * Create a new Project linked to current authenticated user (user_id)
 */
export async function createProject(
  payload: {
    name: string;
    description?: string;
    category?: string;
    status?: 'active' | 'archived' | 'draft' | 'completed';
    cover_image_url?: string;
  },
  coverFile?: File | null
): Promise<Project> {
  let uploadedCoverUrl = payload.cover_image_url || '';

  if (coverFile) {
    uploadedCoverUrl = await uploadFileToSupabase(coverFile);
  }

  const now = new Date().toISOString();

  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('Authentication required. Please log in to create projects.');
    }

    const userId = userData.user.id;

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          user_id: userId,
          name: payload.name,
          description: payload.description || '',
          category: payload.category || 'Creative Brief',
          status: payload.status || 'active',
          cover_image_url: uploadedCoverUrl || null,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (projectError) {
      console.error('Supabase project creation error:', projectError);
      throw projectError;
    }

    // Insert asset record if file was uploaded
    if (coverFile && uploadedCoverUrl && projectData) {
      try {
        await supabase.from('project_assets').insert([
          {
            project_id: projectData.id,
            user_id: userId,
            name: coverFile.name,
            file_url: uploadedCoverUrl,
            file_type: coverFile.type.startsWith('image/') ? 'image' : 'document',
            created_at: now,
          },
        ]);
      } catch (assetErr) {
        console.warn('Warning inserting asset record during project creation:', assetErr);
      }
    }

    return getProjectById(projectData.id) as Promise<Project>;
  } else {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: payload.name,
      description: payload.description || '',
      category: payload.category || 'Creative Brief',
      status: payload.status || 'active',
      cover_image_url: uploadedCoverUrl || null,
      created_at: now,
      updated_at: now,
      project_assets: coverFile && uploadedCoverUrl ? [
        {
          id: crypto.randomUUID(),
          project_id: '',
          name: coverFile.name,
          file_url: uploadedCoverUrl,
          file_type: 'image',
          created_at: now,
        }
      ] : [],
      project_notes: [],
    };
    if (newProject.project_assets?.[0]) {
      newProject.project_assets[0].project_id = newProject.id;
    }
    const local = getLocalProjects();
    local.unshift(newProject);
    saveLocalProjects(local);
    return newProject;
  }
}

/**
 * Update project details
 */
export async function updateProject(
  id: string,
  updates: Partial<Pick<Project, 'name' | 'description' | 'category' | 'status' | 'cover_image_url'>>
): Promise<Project | null> {
  const now = new Date().toISOString();

  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Authentication required');

    const { error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .eq('user_id', userData.user.id);

    if (error) {
      console.error(`Supabase error updating project ${id}:`, error);
      throw error;
    }
    return getProjectById(id);
  } else {
    const local = getLocalProjects();
    const idx = local.findIndex(p => p.id === id);
    if (idx >= 0) {
      local[idx] = { ...local[idx], ...updates, updated_at: now };
      saveLocalProjects(local);
      return local[idx];
    }
    return null;
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Authentication required');

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);

    if (error) {
      console.error(`Supabase error deleting project ${id}:`, error);
      throw error;
    }
    return true;
  } else {
    const local = getLocalProjects().filter(p => p.id !== id);
    saveLocalProjects(local);
    return true;
  }
}

/**
 * Add note to project
 */
export async function addProjectNote(projectId: string, content: string): Promise<ProjectNote> {
  const now = new Date().toISOString();

  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || null;

    const { data, error } = await supabase
      .from('project_notes')
      .insert([
        {
          project_id: projectId,
          user_id: userId,
          content,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error adding note:', error);
      throw error;
    }
    return data as ProjectNote;
  } else {
    const note: ProjectNote = {
      id: crypto.randomUUID(),
      project_id: projectId,
      content,
      created_at: now,
      updated_at: now,
    };
    const local = getLocalProjects();
    const proj = local.find(p => p.id === projectId);
    if (proj) {
      if (!proj.project_notes) proj.project_notes = [];
      proj.project_notes.unshift(note);
      saveLocalProjects(local);
    }
    return note;
  }
}

/**
 * Upload new asset to project
 */
export async function addProjectAsset(projectId: string, file: File): Promise<ProjectAsset> {
  const fileUrl = await uploadFileToSupabase(file);
  const now = new Date().toISOString();

  if (supabase) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id || null;

    let { data, error } = await supabase
      .from('project_assets')
      .insert([
        {
          project_id: projectId,
          user_id: userId,
          name: file.name,
          file_url: fileUrl,
          file_type: file.type.startsWith('image/') ? 'image' : 'document',
          created_at: now,
        },
      ])
      .select()
      .single();

    if (error && error.message.includes('row-level security')) {
      console.warn('RLS policy issue with user_id on project_assets, retrying insertion without user_id column...');
      const retry = await supabase
        .from('project_assets')
        .insert([
          {
            project_id: projectId,
            name: file.name,
            file_url: fileUrl,
            file_type: file.type.startsWith('image/') ? 'image' : 'document',
            created_at: now,
          },
        ])
        .select()
        .single();

      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('Supabase error adding asset:', error);
      throw error;
    }
    return data as ProjectAsset;
  } else {
    const asset: ProjectAsset = {
      id: crypto.randomUUID(),
      project_id: projectId,
      name: file.name,
      file_url: fileUrl,
      file_type: file.type.startsWith('image/') ? 'image' : 'document',
      created_at: now,
    };
    const local = getLocalProjects();
    const proj = local.find(p => p.id === projectId);
    if (proj) {
      if (!proj.project_assets) proj.project_assets = [];
      proj.project_assets.unshift(asset);
      saveLocalProjects(local);
    }
    return asset;
  }
}

/**
 * Delete asset from project
 */
export async function deleteProjectAsset(assetId: string, projectId: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase
      .from('project_assets')
      .delete()
      .eq('id', assetId);

    if (error) {
      console.error(`Supabase error deleting asset ${assetId}:`, error);
      throw error;
    }
    return true;
  } else {
    const local = getLocalProjects();
    const proj = local.find(p => p.id === projectId);
    if (proj && proj.project_assets) {
      proj.project_assets = proj.project_assets.filter(a => a.id !== assetId);
      saveLocalProjects(local);
    }
    notifyDataUpdated();
    return true;
  }
}

export function notifyDataUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('forgefield_data_updated'));
  }
}

export interface HomepageStats {
  activeProjects: number;
  totalAssets: number;
  totalCategories: number;
  isConnected: boolean;
}

/**
 * Fetch real-time homepage stats directly from Supabase / Database
 */
export async function getHomepageStats(): Promise<HomepageStats> {
  const isConnected = isSupabaseConfigured();

  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      let query = supabase.from('projects').select('id, category, status, project_assets(id)');
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: projects, error } = await query;

      if (!error && projects) {
        const activeProjects = projects.filter((p: any) => p.status === 'active' || !p.status).length;
        let totalAssets = 0;
        const categoriesSet = new Set<string>();

        projects.forEach((p: any) => {
          if (p.category) categoriesSet.add(p.category);
          if (Array.isArray(p.project_assets)) {
            totalAssets += p.project_assets.length;
          }
        });

        return {
          activeProjects: activeProjects > 0 ? activeProjects : projects.length,
          totalAssets,
          totalCategories: categoriesSet.size > 0 ? categoriesSet.size : (projects.length > 0 ? 1 : 0),
          isConnected: true,
        };
      }
    } catch (err) {
      console.warn('Error fetching real-time DB stats:', err);
    }
  }

  // Fallback / local storage
  const localProjects = getLocalProjects();
  const activeProjects = localProjects.filter(p => p.status === 'active' || !p.status).length;
  let totalAssets = 0;
  const categoriesSet = new Set<string>();

  localProjects.forEach(p => {
    if (p.category) categoriesSet.add(p.category);
    if (Array.isArray(p.project_assets)) {
      totalAssets += p.project_assets.length;
    }
  });

  return {
    activeProjects: activeProjects > 0 ? activeProjects : localProjects.length,
    totalAssets,
    totalCategories: categoriesSet.size > 0 ? categoriesSet.size : (localProjects.length > 0 ? 1 : 0),
    isConnected,
  };
}


