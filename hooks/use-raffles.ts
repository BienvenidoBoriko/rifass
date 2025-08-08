"use client";
import { useState, useEffect } from "react";
import type { Raffle, Winner } from "@/lib/types";

const useActiveRaffles = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRaffles() {
      try {
        const response = await fetch("/api/raffles/active");
        if (!response.ok) throw new Error("Failed to fetch raffles");

        const data = await response.json();
        setRaffles(data.raffles);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchRaffles();
  }, []);

  return { raffles, loading, error, refetch: () => window.location.reload() };
};

const useRafflesWinners = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWinners() {
      try {
        const response = await fetch("/api/winners");
        if (!response.ok) throw new Error("Failed to fetch winners");

        const data = await response.json();
        setWinners(data.winners);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchWinners();
  }, []);

  return { winners, loading, error, refetch: () => window.location.reload() };
};

const useRaffle = (id: number) => {
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRaffle() {
      try {
        const response = await fetch(`/api/raffles/${id}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error("Raffle not found");
          throw new Error("Failed to fetch raffle");
        }

        const data = await response.json();
        setRaffle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchRaffle();
  }, [id]);

  return { raffle, loading, error };
};

const useAvailableTickets = (raffleId: number) => {
  const [tickets, setTickets] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch(
          `/api/raffles/${raffleId}/available-tickets`
        );
        if (!response.ok) throw new Error("Failed to fetch available tickets");

        const data = await response.json();
        setTickets(data.availableTickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (raffleId) fetchTickets();
  }, [raffleId]);

  return { tickets, loading, error, refetch: () => window.location.reload() };
};

export { useActiveRaffles, useRafflesWinners, useRaffle, useAvailableTickets };
