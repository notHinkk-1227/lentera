import { ManageListPanel } from "@/components/dashboard/ManageListPanel";
import { requireRole } from "@/lib/authz";
import { taxonomyService } from "@/lib/services/taxonomyService";
import {
  addCategoryAction,
  addFacultyAction,
  removeCategoryAction,
  removeFacultyAction,
} from "./actions";

export default async function ManageFacultiesAndCategoriesPage() {
  await requireRole("ADMIN");
  const [faculties, categories] = await Promise.all([
    taxonomyService.listFaculties(),
    taxonomyService.listCategories(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink">Fakultas & kategori</h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Daftar ini dipakai sebagai pilihan fakultas dan kategori saat dosen mengunggah artikel.
        Entri yang masih dipakai karya atau akun tidak bisa dihapus.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ManageListPanel
          title="Fakultas"
          items={faculties}
          addPlaceholder="Nama fakultas baru"
          emptyLabel="Belum ada fakultas terdaftar."
          onAdd={addFacultyAction}
          onRemove={removeFacultyAction}
        />
        <ManageListPanel
          title="Kategori"
          items={categories}
          addPlaceholder="Nama kategori baru"
          emptyLabel="Belum ada kategori terdaftar."
          onAdd={addCategoryAction}
          onRemove={removeCategoryAction}
        />
      </div>
    </div>
  );
}
