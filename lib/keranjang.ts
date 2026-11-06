export type ItemKeranjang = { id: number; jumlah: number };

const KUNCI = "keranjang";
const SINYAL = "keranjang-berubah";

// teks mentah dari localStorage (dipakai sebagai snapshot yang stabil)
export function bacaMentah(): string {
  return localStorage.getItem(KUNCI) ?? "[]";
}

export function urai(mentah: string): ItemKeranjang[] {
  try {
    const data = JSON.parse(mentah);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function bacaKeranjang(): ItemKeranjang[] {
  return urai(bacaMentah());
}

// simpan + beri tahu komponen lain
export function simpanKeranjang(isi: ItemKeranjang[]) {
  localStorage.setItem(KUNCI, JSON.stringify(isi));
  window.dispatchEvent(new Event(SINYAL));
}

// berlangganan perubahan (dipakai Navbar)
export function langganKeranjang(callback: () => void) {
  window.addEventListener(SINYAL, callback);
  window.addEventListener("storage", callback); // perubahan dari tab lain
  return () => {
    window.removeEventListener(SINYAL, callback);
    window.removeEventListener("storage", callback);
  };
}