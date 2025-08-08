"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import type {
  PurchaseTicketsRequest,
  PurchaseTicketsResponse,
} from "@/lib/types";

const usePurchaseTickets = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseTickets = async (
    data: PurchaseTicketsRequest
  ): Promise<PurchaseTicketsResponse | null> => {
    if (!session?.user) {
      setError("Please sign in to purchase tickets");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/raffles/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to purchase tickets");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { purchaseTickets, loading, error };
};

export { usePurchaseTickets };
