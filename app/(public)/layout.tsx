import { NetflixHeader } from "@/components/public-alt/NetflixHeader";
import { NetflixFooter } from "@/components/public-alt/NetflixFooter";
import { stickerBackgroundStyle } from "@/components/public-alt/stickerBackground";

// Layout halaman publik selain homepage (mis. /search). Memakai header, footer, latar,
// dan palet gelap yang sama dengan homepage (/) dan /articles/[id], supaya seragam.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#141414]" style={stickerBackgroundStyle}>
      <NetflixHeader />
      {children}
      <NetflixFooter />
    </div>
  );
}
