"use client";
import {useEffect,useRef,useState} from "react";
import type {BudgetCategory} from "@/types/trip";
import {getTravelIcon} from "@/utils/travelCategory";
export default function FlightTransition(){
 const [journey,setJourney]=useState<{category:BudgetCategory;id:number}|null>(null);
 const timer=useRef<ReturnType<typeof setTimeout>>();
 useEffect(()=>{const trigger=(event:Event)=>{
 const category=(event as CustomEvent).detail?.category;
 if(!["Backpacker","Standard","Luxury"].includes(category)||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 clearTimeout(timer.current);setJourney({category,id:Date.now()});timer.current=setTimeout(()=>setJourney(null),1800);
 };window.addEventListener("kelana-journey",trigger);return()=>{window.removeEventListener("kelana-journey",trigger);clearTimeout(timer.current)}},[]);
 if(!journey)return null;
 return <div key={journey.id} className={"journey-transition journey-"+journey.category.toLowerCase()} aria-hidden="true"><img src={"/travel/icons/"+getTravelIcon(journey.category)+".svg"} alt=""/>{journey.category==="Backpacker"&&<img className="journey-camp" src="/travel/icons/tent.svg" alt=""/>}</div>
}
