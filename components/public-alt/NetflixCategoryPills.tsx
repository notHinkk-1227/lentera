import Link from "next/link";
import type { NamedItem } from "@/lib/types";

// Dipakai di homepage dan /search. Bila `query` diberikan (di /search), kata kunci
// ikut dibawa ke tautan filter supaya mengganti fakultas tidak menghapus pencarian.
export function NetflixCategoryPills({
  faculties,
  activeFaculty,
  query,
}: {
  faculties: NamedItem[];
  activeFaculty?: string;
  query?: string;
}) {
  const chips = [{ name: undefined, label: "Semua" }, ...faculties.map((f) => ({ name: f.name, label: f.name }))];

  function buildHref(facultyName?: string) {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (facultyName) params.set("faculty", facultyName);
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isActive = activeFaculty === chip.name || (!activeFaculty && !chip.name);
        return (
          <Link
            key={chip.label}
            href={buildHref(chip.name)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-[#D8432F] text-white"
                : "bg-white/8 text-white/60 hover:bg-white/15 hover:text-white"
            }`}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
