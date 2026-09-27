import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminEnv, isDbConfigured } from "@/lib/env";
import { PURPOSE_LABELS, type ApplicationInput } from "@/lib/schema";
import type { RadioApplicationInput } from "@/lib/radio-schema";

type NewApplication = {
  kind: "listing" | "radio";
  band_name: string;
  contact_name: string;
  contact: string;
  purpose: string | null;
  details: Record<string, string | boolean>;
  radio_selection?: "pending";
};

function adminClient() {
  const env = getSupabaseAdminEnv();
  return createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * 応募1件を保存する。保存できたら true。
 * DB が未設定・一時停止・障害のときは false を返し、呼び出し側はメールだけで受け付ける。
 */
async function insert(row: NewApplication): Promise<boolean> {
  if (!isDbConfigured()) return false;
  try {
    const { error } = await adminClient().from("applications").insert(row);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("[db insert failed]", err);
    return false;
  }
}

export function saveListingApplication(input: ApplicationInput) {
  return insert({
    kind: "listing",
    band_name: input.bandName,
    contact_name: input.representativeName,
    contact: input.contact,
    purpose: PURPOSE_LABELS[input.purpose],
    details: {
      profile: input.profile,
      content: input.content,
      urls: input.urls,
      message: input.message,
    },
  });
}

export function saveRadioApplication(input: RadioApplicationInput) {
  return insert({
    kind: "radio",
    band_name: input.bandName,
    contact_name: input.contactName,
    contact: input.email,
    purpose: null,
    radio_selection: "pending",
    details: {
      xAccount: input.xAccount,
      base: input.base,
      songUrl: input.songUrl,
      savedMoment: input.savedMoment,
      whoToSave: input.whoToSave,
      members: input.members,
      consentArticle: input.consentArticle === "on",
      message: input.message,
    },
  });
}
