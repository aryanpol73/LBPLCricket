import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { SEASONS, SeasonConfig, getFeaturedSeason, getSeasonById } from "@/config/seasons";

const STORAGE_KEY = "lbpl_active_season";

interface SeasonContextValue {
  seasons: SeasonConfig[];
  currentSeason: SeasonConfig;
  setCurrentSeasonId: (id: string) => void;
}

const SeasonContext = createContext<SeasonContextValue | undefined>(undefined);

export const SeasonProvider = ({ children }: { children: ReactNode }) => {
  const [currentId, setCurrentId] = useState<string>(() => {
    if (typeof window === "undefined") return getFeaturedSeason().id;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && getSeasonById(stored)) return stored;
    return getFeaturedSeason().id;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currentId);
    } catch {}
  }, [currentId]);

  const setCurrentSeasonId = useCallback((id: string) => {
    if (getSeasonById(id)) setCurrentId(id);
  }, []);

  const currentSeason = useMemo(
    () => getSeasonById(currentId) || getFeaturedSeason(),
    [currentId]
  );

  const value = useMemo(
    () => ({ seasons: SEASONS, currentSeason, setCurrentSeasonId }),
    [currentSeason, setCurrentSeasonId]
  );

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
};

export const useSeason = (): SeasonContextValue => {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error("useSeason must be used inside SeasonProvider");
  return ctx;
};
