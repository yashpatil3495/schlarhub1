// src/lib/supabase.js
// Supabase client — single instance used across the whole app

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error(
    "⚠️  Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
  );
}

export const supabase = createClient(
  SUPABASE_URL  || "https://placeholder.supabase.co",
  SUPABASE_ANON || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// ── Helpers ──────────────────────────────────────────────────

/** Upload a file to the 'documents' storage bucket.
 *  Path format: {userId}/{docType}/{filename}
 */
export async function uploadDocument(userId, docType, file) {
  const ext  = file.name.split(".").pop();
  const path = `${userId}/${docType}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("documents")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw error;
  return data.path;
}

/** Get a short-lived signed URL for a private document */
export async function getDocumentUrl(path, expiresIn = 300) {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

/** Delete a document from storage */
export async function deleteDocument(path) {
  const { error } = await supabase.storage
    .from("documents")
    .remove([path]);
  if (error) throw error;
}

/** Calculate profile completion percentage */
export function calcProfileComplete(profile) {
  if (!profile) return 0;
  const fields = [
    "name", "dob", "gender", "mobile", "state", "city", "category",
    "level", "field", "specialisation", "college", "board",
    "marks_percent", "cgpa", "year_of_admission",
    "annual_income_lpa", "is_first_gen", "goals",
  ];
  const filled = fields.filter(f => profile[f] !== null && profile[f] !== undefined && profile[f] !== "").length;
  return Math.round((filled / fields.length) * 100);
}
