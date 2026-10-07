import { redirect } from "next/navigation";

// Rute lama. Homepage bertema gelap sekarang menjadi homepage utama di "/",
// jadi alamat ini hanya meneruskan ke sana agar tautan lama tidak patah.
export default function HomepageNetflixRedirect() {
  redirect("/");
}
