import Link from "next/link";
import { useEffect } from "react";
import Header from "./Header";


 export default function ProfilH(props){

    useEffect(()=>{
        if(props.id != "0")
        document.getElementById(props.id).className+=" active"
    },[])
    return(
        <>
            <Header/>
            <ul className="nav nav-tabs justify-content-center mb-2">
                <li className="nav-item">
                    <Link id="create" className="nav-link" href="/create">Napravi Debatu</Link>
                </li>
                <li className="nav-item">
                    <Link id="invite" className="nav-link" href="/invite">Zahtjevi za ucesce</Link>
                </li>
                <li id="invites" className="nav-item">
                     <Link id='invites' className="nav-link" href="/invites">Debate</Link>
                </li>
            </ul>
        </>
    )
}