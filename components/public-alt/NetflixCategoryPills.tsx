import Link from "next/link";
import { dummyFaculties } from "@/lib/dummy-data";

export function NetflixCategoryPills({ activeFaculty }: { activeFaculty?: string }) {
  const chips = [{ name: undefined, label: "Semua" }, ...dummyFaculties.map((f) => ({ name: f.name, label: f.name }))];

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isActive = activeFaculty === chip.name || (!activeFaculty && !chip.name);
        const href = chip.name ? `/search?faculty=${encodeURIComponent(chip.name)}` : "/search";
        return (
          <Link
            key={chip.label}
            href={href}
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
