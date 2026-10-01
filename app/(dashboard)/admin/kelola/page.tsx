import { ManageListPanel } from "@/components/dashboard/ManageListPanel";
import { requireRole } from "@/lib/authz";
import { dummyFaculties, dummyCategories } from "@/lib/dummy-data";

// TODO: ganti dummyFaculties/dummyCategories dengan data dari
// facultyRepository/categoryRepository (belum dibuat) begitu backend aktif.
export default async function ManageFacultiesAndCategoriesPage() {
  await requireRole("ADMIN");

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink">Fakultas & kategori</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Daftar ini dipakai sebagai pilihan fakultas dan kategori saat dosen mengunggah artikel.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ManageListPanel
          title="Fakultas"
          items={dummyFaculties}
          addPlaceholder="Nama fakultas baru"
          emptyLabel="Belum ada fakultas terdaftar."
        />
        <ManageListPanel
          title="Kategori"
          items={dummyCategories}
          addPlaceholder="Nama kategori baru"
          emptyLabel="Belum ada kategori terdaftar."
        />
      </div>
    </div>
  );
}
