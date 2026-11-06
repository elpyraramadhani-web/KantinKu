import { menu } from "@/data/menu";
import KatalogMenu from "@/componets/KatalogInteraktif";

export default function HalamanMenu() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Menu Kantin Sekolah</h1>
      <KatalogMenu items={menu} />
    </main>
  );
}