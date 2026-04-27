// src/hooks/useSupabase.js
// All data-fetching hooks — one file for simplicity

import { useState, useEffect, useCallback } from "react";
import { supabase, uploadDocument, getDocumentUrl, deleteDocument } from "../lib/supabase.js";
import { useAuth } from "../contexts/AuthContext.jsx";

// ══════════════════════════════════════════════════════════════
// useScholarships — always use local data as source of truth
// ══════════════════════════════════════════════════════════════
export function useScholarships(localFallback = []) {
  // Always use the local scholarships.js file — no Supabase fetch.
  // This ensures the portal always shows the latest curated data.
  return { scholarships: localFallback, loading: false, error: null };
}

// ══════════════════════════════════════════════════════════════
// useSaved — save / unsave scholarships
// ══════════════════════════════════════════════════════════════
export function useSaved() {
  const { user } = useAuth();
  const [saved,   setSaved]   = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Load saved IDs on mount / user change
  useEffect(() => {
    if (!user) { setSaved(new Set()); return; }
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("user_saved_scholarships")
        .select("scholarship_id")
        .eq("user_id", user.id);
      if (data) setSaved(new Set(data.map(r => r.scholarship_id)));
      setLoading(false);
    };
    load();
  }, [user]);

  const toggleSave = useCallback(async (scholarshipId) => {
    if (!user) return;
    const isSaved = saved.has(scholarshipId);

    // Optimistic update
    setSaved(prev => {
      const next = new Set(prev);
      isSaved ? next.delete(scholarshipId) : next.add(scholarshipId);
      return next;
    });

    if (isSaved) {
      await supabase
        .from("user_saved_scholarships")
        .delete()
        .eq("user_id", user.id)
        .eq("scholarship_id", scholarshipId);
    } else {
      await supabase
        .from("user_saved_scholarships")
        .insert({ user_id: user.id, scholarship_id: scholarshipId });
    }
  }, [user, saved]);

  return { saved, toggleSave, loading };
}

// ══════════════════════════════════════════════════════════════
// useTracker — application tracker CRUD
// ══════════════════════════════════════════════════════════════
export function useTracker() {
  const { user } = useAuth();
  const [tracker, setTracker] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { setTracker([]); return; }
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("application_tracker")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setTracker(data.map(r => ({
        id: r.id,
        scholarshipId: r.scholarship_id,
        stage: r.stage,
        note: r.note || "",
        amount: r.amount_won || 0,
        interview_date: r.interview_date,
        result_date: r.result_date,
        ref_number: r.ref_number,
      })));
      setLoading(false);
    };
    load();
  }, [user]);

  const addToTracker = useCallback(async (scholarshipId) => {
    if (!user) return;
    if (tracker.find(t => t.scholarshipId === scholarshipId)) return;

    const { data, error } = await supabase
      .from("application_tracker")
      .insert({ user_id: user.id, scholarship_id: scholarshipId, stage: "Not Started" })
      .select()
      .single();

    if (!error && data) {
      setTracker(prev => [{ id: data.id, scholarshipId: data.scholarship_id, stage: data.stage, note: "", amount: 0 }, ...prev]);
    }
  }, [user, tracker]);

  const updateTracker = useCallback(async (id, updates) => {
    if (!user) return;

    // Optimistic
    setTracker(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    const dbUpdates = {};
    if (updates.stage      !== undefined) dbUpdates.stage       = updates.stage;
    if (updates.note       !== undefined) dbUpdates.note        = updates.note;
    if (updates.amount     !== undefined) dbUpdates.amount_won  = updates.amount;
    if (updates.ref_number !== undefined) dbUpdates.ref_number  = updates.ref_number;

    await supabase
      .from("application_tracker")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", user.id);
  }, [user]);

  const removeFromTracker = useCallback(async (id) => {
    if (!user) return;
    setTracker(prev => prev.filter(t => t.id !== id));
    await supabase
      .from("application_tracker")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  }, [user]);

  return { tracker, setTracker: setTracker, addToTracker, updateTracker, removeFromTracker, loading };
}

// ══════════════════════════════════════════════════════════════
// useDocuments — document vault
// ══════════════════════════════════════════════════════════════
export function useDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadDocs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("user_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setDocuments(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  const uploadDoc = useCallback(async (docType, label, file) => {
    if (!user) return;
    setUploading(true);
    try {
      const filePath = await uploadDocument(user.id, docType, file);
      const { data, error } = await supabase
        .from("user_documents")
        .insert({
          user_id: user.id,
          doc_type: docType,
          label,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
        })
        .select()
        .single();
      if (!error && data) setDocuments(prev => [data, ...prev]);
      return data;
    } finally {
      setUploading(false);
    }
  }, [user]);

  const deleteDoc = useCallback(async (docId, filePath) => {
    if (!user) return;
    setDocuments(prev => prev.filter(d => d.id !== docId));
    await deleteDocument(filePath);
    await supabase
      .from("user_documents")
      .delete()
      .eq("id", docId)
      .eq("user_id", user.id);
  }, [user]);

  const getSignedUrl = useCallback(async (filePath) => {
    return getDocumentUrl(filePath);
  }, []);

  return { documents, loading, uploading, uploadDoc, deleteDoc, getSignedUrl, refresh: loadDocs };
}

// ══════════════════════════════════════════════════════════════
// useNotifications — real notifications
// ══════════════════════════════════════════════════════════════
export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data) setNotifications(data);
      setLoading(false);
    };
    load();

    // Realtime subscription for new notifications
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const markRead = useCallback(async (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notifId);
  }, []);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return { notifications, loading, unreadCount, markRead, markAllRead };
}

// ══════════════════════════════════════════════════════════════
// usePeerReview — SOP peer review
// ══════════════════════════════════════════════════════════════
export function usePeerReview() {
  const { user } = useAuth();
  const [mySOPs,       setMySOPs]       = useState([]);
  const [pendingSOPs,  setPendingSOPs]  = useState([]);
  const [myReviews,    setMyReviews]    = useState([]);
  const [karma,        setKarma]        = useState(0);
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);

      // My SOPs + their received reviews
      const { data: mySops } = await supabase
        .from("sop_reviews")
        .select("*, peer_reviews(*)")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });
      if (mySops) setMySOPs(mySops);

      // SOPs pending review (not mine)
      const { data: pending } = await supabase
        .from("sop_reviews")
        .select("id, scholarship_name, word_count, sop_text, submitted_at:created_at")
        .eq("status", "pending_review")
        .neq("author_id", user.id)
        .order("created_at", { ascending: true })
        .limit(5);
      if (pending) setPendingSOPs(pending);

      // Reviews I have given
      const { data: given } = await supabase
        .from("peer_reviews")
        .select("*")
        .eq("reviewer_id", user.id);
      if (given) {
        setMyReviews(given);
        setKarma(given.length * 2);
      }

      setLoading(false);
    };
    load();
  }, [user]);

  const submitSOP = useCallback(async ({ sopText, scholarshipId, scholarshipName }) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("sop_reviews")
      .insert({
        author_id: user.id,
        scholarship_id: scholarshipId || null,
        scholarship_name: scholarshipName,
        sop_text: sopText,
        word_count: sopText.trim().split(/\s+/).length,
      })
      .select()
      .single();
    if (error) throw error;
    setMySOPs(prev => [{ ...data, peer_reviews: [] }, ...prev]);
    return data;
  }, [user]);

  const submitReview = useCallback(async (sopId, scores, feedback) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("peer_reviews")
      .insert({
        sop_id: sopId,
        reviewer_id: user.id,
        clarity_score: scores.clarity,
        relevance_score: scores.relevance,
        impact_score: scores.impact,
        overall_score: scores.overall,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
      })
      .select()
      .single();
    if (error) throw error;
    setMyReviews(prev => [...prev, data]);
    setKarma(k => k + 2);
    setPendingSOPs(prev => prev.filter(s => s.id !== sopId));
    return data;
  }, [user]);

  return { mySOPs, pendingSOPs, myReviews, karma, loading, submitSOP, submitReview };
}

// ══════════════════════════════════════════════════════════════
// useMentors
// ══════════════════════════════════════════════════════════════
export function useMentors() {
  const [mentors,  setMentors]  = useState([]);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("mentors")
        .select("*, profiles(name, state, field)")
        .eq("is_active", true)
        .eq("is_verified", true)
        .order("rating", { ascending: false });
      if (data && data.length > 0) setMentors(data);
      setLoading(false);
    };
    load();
  }, []);

  return { mentors, loading };
}

// ══════════════════════════════════════════════════════════════
// useChallenges
// ══════════════════════════════════════════════════════════════
export function useChallenges() {
  const { user } = useAuth();
  const [challenges,   setChallenges]   = useState([]);
  const [submissions,  setSubmissions]  = useState([]);
  const [loading,      setLoading]      = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: chals } = await supabase
        .from("challenges")
        .select("*")
        .eq("status", "active")
        .order("deadline", { ascending: true });
      if (chals) setChallenges(chals);

      if (user) {
        const { data: subs } = await supabase
          .from("challenge_submissions")
          .select("*")
          .eq("student_id", user.id);
        if (subs) setSubmissions(subs);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const submitChallenge = useCallback(async (challengeId, content) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("challenge_submissions")
      .insert({ challenge_id: challengeId, student_id: user.id, content })
      .select()
      .single();
    if (error) throw error;
    setSubmissions(prev => [...prev, data]);
    // Increment submissions_count
    await supabase.rpc("increment", { table_name: "challenges", id: challengeId, column_name: "submissions_count" });
    return data;
  }, [user]);

  const hasSubmitted = (challengeId) => submissions.some(s => s.challenge_id === challengeId);

  return { challenges, submissions, loading, submitChallenge, hasSubmitted };
}
