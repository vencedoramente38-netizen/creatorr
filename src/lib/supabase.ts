export const SUPABASE_URL = "https://qvvotmrwkiqhrzzbroqp.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2dm90bXJ3a2lxaHJ6emJyb3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5Njg4OTQsImV4cCI6MjA4NzU0NDg5NH0.iszdniSZCdAC7xZKmXuA5SKGq53ZbGim-BCkhutsuuQ";

export const sbHeaders = {
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

export const sbGet = async (table: string, query: string = "") => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: sbHeaders
  });
  return res.json();
};

export const sbPost = async (table: string, body: any) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...sbHeaders, "Prefer": "return=representation" },
    body: JSON.stringify(body)
  });
  return res.json();
};

export const sbPatch = async (table: string, query: string, body: any) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: sbHeaders,
    body: JSON.stringify(body)
  });
  return res.json();
};

export const sbDelete = async (table: string, query: string) => {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: "DELETE",
    headers: sbHeaders
  });
};

export const STOR = {
  g: async (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  s: async (key: string, val: any) => {
    if (val === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(val));
  }
};
