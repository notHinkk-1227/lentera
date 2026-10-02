export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-lg font-semibold text-white">
      <span aria-hidden className="h-5 w-1 rounded-full bg-[#E5493A]" />
      {children}
    </h2>
  );
}
