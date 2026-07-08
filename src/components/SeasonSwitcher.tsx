import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useSeason } from "@/context/SeasonContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  variant?: "navbar" | "inline";
}

export default function SeasonSwitcher({ variant = "navbar" }: Props) {
  const { seasons, currentSeason, setCurrentSeasonId } = useSeason();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-1.5 rounded-full border border-[#f0b429]/40 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#f0b429]/15 transition-all ${
            variant === "inline" ? "w-full justify-between text-sm py-2.5" : ""
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#f0b429] animate-pulse" />
          {currentSeason.title}
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-[#0b1c3d] border-[#f0b429]/20 text-white"
      >
        {seasons.map((s) => {
          const active = s.id === currentSeason.id;
          return (
            <DropdownMenuItem
              key={s.id}
              onClick={() => setCurrentSeasonId(s.id)}
              className="flex items-center justify-between cursor-pointer focus:bg-[#f0b429]/15 focus:text-white"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{s.title}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {s.status} · {s.year}
                </span>
              </div>
              {active && <Check size={16} className="text-[#f0b429]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
