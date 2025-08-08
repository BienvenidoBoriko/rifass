"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Ticket } from "@/lib/types";

export function useUserTickets() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<(Ticket & { raffleTitle: string })[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTickets() {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/tickets/user");
        if (!response.ok) {
          if (response.status === 401)
            throw new Error("Please sign in to view your tickets");
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        setTickets(data.tickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [session]);

  return { tickets, loading, error, refetch: () => window.location.reload() };
}
