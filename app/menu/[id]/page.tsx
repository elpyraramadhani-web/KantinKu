import Link from "next/link";
import { notFound } from "next/navigation";
import { menu, rupiah } from "@/data/menu";
import FormKeranjang from "@/componets/FromKeranjang";

export default async function DetailMenu({ params }: PageProps<"/menu/[id]">) {
  const { id } = await params;
  const item = menu.find((m) => m.id === Number(id));
  if (!item) notFound();

  return (
    <article className="rounded-xl border bg-white p-6 text-slate-900">
      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
        {item.kategori}
      </span>
      <h1 className="mt-2 text-3xl font-bold">{item.nama}</h1>
      <p className="mt-4 text-xl font-semibold">{rupiah(item.harga)}</p>
      <p className={item.stok === 0 ? "font-bold text-red-600" : "text-green-700"}>
        {item.stok === 0 ? "Habis" : `Stok ${item.stok}`}
      </p>
      {item.stok === 0 ? (
        <p className="mt-6 font-medium text-red-600">Menu ini habis.</p>
      ) : (
        <FormKeranjang item={item} />
      )}
      <Link
        href="/menu"
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        ← Kembali ke menu
      </Link>
    </article>
  );
}