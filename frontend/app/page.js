"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import UserMenu from "@/components/UserMenu";
import {useAuth} from "@/context/AuthContext";
import {ApiError} from "@/services/apiClient";
import {createTrip,generateTrip} from "@/services/tripService";
import {getBudgetCategory,getTravelIcon} from "@/utils/travelCategory";
const escapes=[
 {name:"Labuan Bajo",region:"Nusa Tenggara Timur",category:"Laut & pulau",days:5,budget:750,photo:"labuan-bajo.jpg",alt:"Perbukitan dan teluk Pulau Padar, kawasan Labuan Bajo",description:"Hari yang pelan, pulau yang jauh, dan senja di atas kapal.",color:"sea"},
 {name:"Ubud",region:"Bali",category:"Alam & tenang",days:4,budget:400,photo:"ubud.jpg",alt:"Sawah terasering Tegallalang dekat Ubud, Bali",description:"Sisakan waktu untuk berjalan, menikmati sawah, dan menemukan sudut sunyi.",color:"forest"},
 {name:"Yogyakarta",region:"Daerah Istimewa Yogyakarta",category:"Budaya & rasa",days:3,budget:250,photo:"yogyakarta.jpg",alt:"Tugu Yogyakarta pada malam hari",description:"Jelajahi cerita kota, ruang seni, dan rasa yang membuat ingin kembali.",color:"sunset"}
];
function Icon({name,...props}){return <img src={`/travel/icons/${name}.svg`} alt="" width="22" height="22" {...props}/>}
export default function Home(){
 const router=useRouter();const {user,loading:authLoading,signOut}=useAuth();
 const [menu,setMenu]=useState(false),[destination,setDestination]=useState("Labuan Bajo"),[days,setDays]=useState(5),[budget,setBudget]=useState(750),[style,setStyle]=useState("Solo"),[loading,setLoading]=useState(false),[error,setError]=useState(""),[filter,setFilter]=useState("Semua"),[selected,setSelected]=useState("Labuan Bajo"),[savedId,setSavedId]=useState(null);
 useEffect(()=>{try{const draft=JSON.parse(sessionStorage.getItem("kelana-draft")||"null");if(draft){setDestination(draft.destination);setDays(draft.days);setBudget(draft.budget);setStyle(draft.travel_style)}}catch{}},[]);
 const category=getBudgetCategory(Number(budget));const travelIcon=getTravelIcon(category);
 function choose(item){setDestination(item.name);setSelected(item.name);setDays(item.days);setBudget(item.budget);setSavedId(null);setError("");document.getElementById("rencanakan").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}
 async function submit(e){e.preventDefault();if(authLoading||loading)return;setError("");const payload={destination:destination.trim(),days:Number(days),budget:Number(budget),travel_style:style};
  if(!payload.destination){setError("Isi destinasi perjalananmu terlebih dahulu.");return}
  if(!user){try{sessionStorage.setItem("kelana-draft",JSON.stringify(payload))}catch{}router.push("/login?next=%2F%23rencanakan");return}
  setLoading(true);window.dispatchEvent(new CustomEvent("kelana-journey",{detail:{category}}));
  try{const id=savedId||(await createTrip(payload)).id;setSavedId(id);await generateTrip(id);try{sessionStorage.removeItem("kelana-draft")}catch{}router.push(`/trips/${id}`)}
  catch(err){if(err instanceof ApiError&&err.status===401){signOut();router.push("/login?next=%2F%23rencanakan")}else setError(err instanceof Error?err.message:"Rencana belum berhasil dibuat. Silakan coba lagi.")}
  finally{setLoading(false)}
 }
 const nav=<><a href="#inspirasi" onClick={()=>setMenu(false)}>Jelajahi</a><Link href="/trips">Perjalananku</Link><Link href="/chat">AI Chat</Link><Link href="/assistant">Asisten pengetahuan</Link><Link href="/about">Tentang</Link></>;
 return <main className="home">
  <header className="site-header"><Link href="/" className="brand"><span className="brand-mark"><Icon name={travelIcon}/></span>Kelana<span>AI</span></Link><nav className="desktop-nav" aria-label="Navigasi utama">{nav}</nav><div className="header-actions"><UserMenu tone="light"/><button className="menu-toggle" aria-label={menu?"Tutup menu":"Buka menu"} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?"✕":"☰"}</button></div>{menu&&<nav className="mobile-nav" aria-label="Navigasi seluler">{nav}</nav>}</header>
  <section className="travel-hero"><Image src="/travel/photos/labuan-bajo.jpg" alt="Perbukitan Pulau Padar di kawasan Labuan Bajo" fill priority sizes="100vw" className="hero-photo"/><div className="hero-shade"/><div className="hero-orbit" aria-hidden="true"><Icon name={travelIcon}/></div>
   <div className="hero-copy"><p className="hero-kicker"><span/> TEMAN PERJALANAN DENGAN AI</p><h1>Ke mana hati<br/>ingin <em>pergi?</em></h1><p>Temukan ritmemu. Ceritakan rencanamu.<br/>Biar KelanaAI menyusun perjalanan berikutnya.</p><a className="hero-link" href="#inspirasi">Cari inspirasi perjalanan <span>↗</span></a></div><div className="hero-caption"><Icon name="map-pin"/><div><strong>Sebuah jeda yang kamu cari.</strong><span>Pulau Padar · Labuan Bajo</span></div></div><div className="hero-counter" aria-hidden="true">01 <span>/</span> NEXT CHAPTER</div>
  </section>
  <section className="planner-wrap" id="rencanakan" aria-labelledby="planner-title"><div className="planner-heading"><h2 id="planner-title"><Icon name="luggage"/>Perjalanan hebat dimulai dari sini.</h2><span>Dirangkai AI, sesuai caramu</span></div>
   <form onSubmit={submit} className="planner-form"><fieldset disabled={loading}>
     <label className="destination-field"><span><Icon name="map-pin"/>Tujuan perjalanan</span><input name="destination" required maxLength={120} value={destination} onChange={e=>{setDestination(e.target.value);setSavedId(null)}} placeholder="Mau ke mana?"/></label>
     <label><span><Icon name="calendar"/>Durasi (hari)</span><input name="days" type="number" required min="1" max="30" value={days} onChange={e=>{setDays(e.target.value);setSavedId(null)}}/></label>
     <label><span><Icon name="luggage"/>Total budget (USD)</span><input name="budget" type="number" required min="1" max="1000000" step="0.01" value={budget} onChange={e=>{setBudget(e.target.value);setSavedId(null)}}/></label>
     <label><span><Icon name="user"/>Teman perjalanan</span><select value={style} onChange={e=>{setStyle(e.target.value);setSavedId(null)}}><option value="Solo">Sendiri</option><option value="Couple">Berdua</option><option value="Family">Keluarga</option></select></label>
     <button className="primary plan-button" disabled={authLoading||loading}>{loading?<><span className="spinner"/>Menyusun rencana…</>:<>Rencanakan <Icon name={travelIcon}/></>}</button>
   </fieldset></form><div className="planner-note"><span>✧ {user?`Selamat datang, ${user.name.split(" ")[0]}. Siap berkelana?`:"Masuk untuk membuat dan menyimpan itinerary pribadimu."}</span><span>{category} · Budget per hari: <strong>USD {Number.isFinite(Number(budget)/Number(days))&&Number(days)>0?(Number(budget)/Number(days)).toLocaleString("en-US",{maximumFractionDigits:2}):"—"}</strong></span></div>
   {loading&&<div className="planning-progress" role="status"><div className="skeleton"/><p>AI sedang menyusun aktivitas harian untuk {destination}. Tunggu sebentar, ya.</p></div>}
   {error&&<div className="error-notice" role="alert">{error}{savedId&&<> Rencana dasar sudah tersimpan. Klik Rencanakan untuk mencoba AI kembali, atau <Link href={`/trips/${savedId}`}>buka perjalanan</Link>.</>}</div>}
  </section>
  <section className="inspiration section-width" id="inspirasi"><div className="section-heading"><div><p className="eyebrow">PILIH SUASANA BARU</p><h2>Jauh dari rutinitas.<br/><em>Dekat dengan dirimu.</em></h2></div><p>Laut yang luas atau kota penuh cerita?<br/>Mulai dari tempat yang memanggilmu.</p></div>
   <div className="filter-bar" aria-label="Filter inspirasi">{["Semua","Laut & pulau","Alam & tenang","Budaya & rasa"].map(x=><button key={x} aria-pressed={filter===x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div>
   <div className="destination-grid">{escapes.filter(x=>filter==="Semua"||x.category===filter).map(item=><button key={item.name} onClick={()=>choose(item)} className={`destination-card ${item.color}`} aria-label={`Pilih ${item.name}`}><div className="destination-art"><Image src={"/travel/photos/"+item.photo} alt={item.alt} fill sizes="(max-width: 650px) 100vw, 33vw" className="destination-photo"/><span className="card-coordinate">{item.category}</span></div><div className="destination-info"><span className="destination-region">{item.region}</span><h3>{item.name}<span>↗</span></h3><p>{item.description}</p><div className="destination-bottom"><span>{item.days} hari eksplorasi</span><span>{selected===item.name?"✓ Dipilih":"Pilih destinasi"}</span></div></div></button>)}</div><p className="inspiration-note">Durasi dan budget awal adalah inspirasi yang dapat kamu ubah. Foto destinasi asli. <Link href="/photo-credits">Kredit foto</Link>.</p>
  </section>
  <section className="journey-section" id="cara-kerja"><div className="section-width journey-layout"><div><p className="eyebrow">SEDERHANA SEJAK AWAL</p><h2>Lebih sedikit tab.<br/><em>Lebih banyak cerita.</em></h2><Link href="/assistant" className="journey-link">Tanya asisten pengetahuan ↗</Link></div><ol>{[["01","Ceritakan perjalananmu","Tentukan tujuan, durasi, budget, dan siapa yang ikut."],["02","Temukan rencana yang pas","AI menyusun aktivitas harian. Kamu tetap menentukan pilihan."],["03","Simpan, lalu lanjutkan","Buka itinerary di Perjalananku, atau lanjutkan percakapan di AI Chat."]].map(([n,t,d])=><li key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol></div></section>
  <footer className="site-footer section-width"><Link className="brand" href="/">Kelana<span>AI</span></Link><p>Perjalananmu, caramu.</p><Link href="/about">Tentang KelanaAI ↗</Link><span>© {new Date().getFullYear()} KelanaAI</span></footer>
 </main>
}
