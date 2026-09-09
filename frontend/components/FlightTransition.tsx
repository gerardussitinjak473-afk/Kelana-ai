"use client";
import {useEffect,useState} from "react";
import {usePathname} from "next/navigation";
export default function FlightTransition(){
 const path=usePathname();const [flight,setFlight]=useState(0);
 useEffect(()=>{setFlight(n=>n+1)},[path]);
 useEffect(()=>{const trigger=()=>setFlight(n=>n+1);window.addEventListener("kelana-flight",trigger);return()=>window.removeEventListener("kelana-flight",trigger)},[]);
 return <div key={flight} className="flight-transition" aria-hidden="true"><div className="flight-cloud"/><img src="/travel/icons/plane.svg" alt=""/><span/></div>
}
