import { useQuery } from "@tanstack/react-query";

export type FileItem = {
  originalname: string;
  filename: string;
  data?: string; // base64 string (may be present)
  mimeType?: string;
  size?: number;
  path?: string;
};

export type FormListItem = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  files?: FileItem[];
  createdAt?: string;
};

async function fetchForms(): Promise<FormListItem[]> {
  const base = String(import.meta.env.VITE_API_URL ?? "http://localhost:5000").replace(/\/$/, "");
  const url = `${base}/api/forms`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch forms: ${res.statusText}`);
  }
  return res.json();
}

export function useFormsQuery() {
  return useQuery<FormListItem[], Error>({
    queryKey: ["forms"],
    queryFn: fetchForms,
    staleTime: 1000 * 60 * 1,
  });
}
