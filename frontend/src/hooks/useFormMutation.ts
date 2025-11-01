import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFormMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const url = `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}/api/forms`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit form");
      }
      return res.json();
    },
    onSuccess: (data) => {
   
      qc.invalidateQueries({ queryKey: ['forms'] });
    },
  });
}
