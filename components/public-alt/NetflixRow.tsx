// Pembungkus baris horizontal: judul seksi + daftar yang bisa digeser.
// Padding dan margin negatif memberi ruang agar kartu yang membesar saat hover tidak
// terpotong oleh area scroll, tanpa menggeser tata letak.
export function NetflixRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[17px] font-medium text-white">{title}</h2>
      <div className="-mx-2 mt-2 flex gap-4 overflow-x-auto px-2 py-3">{children}</div>
    </section>
  );
}
