import Link from "next/link";
const photos = [
 ["Pulau Padar · Labuan Bajo", "Michael Gievanno", "Padar-Island-Landscape.jpg"],
 ["Tegallalang · sekitar Ubud", "Freddy eduardo", "Tegalalang_Rice_Terraces.jpg"],
 ["Tugu Yogyakarta", "Herusutimbul", "Tugu_Jogja_Landmark_Kota_Jogja.jpg"],
];
export default function PhotoCredits() {
 return <main className="about-page"><Link href="/">← Kembali ke KelanaAI</Link><h1 className="mt-10">Kredit foto</h1><p>Foto asli destinasi dari Wikimedia Commons. Foto ditampilkan dengan penyesuaian ukuran dan pemotongan agar sesuai dengan ruang gambar.</p><ul className="space-y-6">{photos.map(([place,author,file])=><li key={file}><h2 className="text-xl font-bold">{place}</h2><p>Foto: {author} · <a className="underline" href={"https://commons.wikimedia.org/wiki/File:"+file}>Sumber asli</a> · <a className="underline" href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></p></li>)}</ul></main>;
}
