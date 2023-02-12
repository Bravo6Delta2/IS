import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from 'axios'
import Link from 'next/link';
import ProfilH from "../comonents/ProfilH";

export default function Invites(props){
    const [debate,setDebate] = useState([]);
    const router = useRouter()
    useEffect(()=>{
        axios.post('http://localhost:3001/getuc',{token:localStorage.getItem('token')}).then(
            (res) => {
                if(res.data.msg = "GG"){
                    setDebate(res.data.debate)
                }
                else{
                    window.alert("Morate se ulogovati")
                    router.push('/login')
                }
            },
            (err) => {
                window.alert("Greska")
            }
        )
    },[])

    return(
        <>
        <ProfilH id="invites"/>
        <table className='table m-5'>
                    <thead>
                        <tr>
                        <th scope="col">Naziv</th>
                        <th scope="col">Username</th>
                        <th scope='col'>Datum</th>
                        <th scope="col">Opis</th>
                        <th scope="col">Javno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debate?.map(l => {
                            return(
                                <tr key={l.id}>
                                    <td className='w-10'><Link href={"/debata/"+l.id}>{l.naziv}</Link></td>
                                    <td className='w-10'>{l.username}</td>
                                    <td className='w-20'>{l.datum.split('T')[0]+" "+l.datum.split('T')[1].split('Z')[0].substring(0,5) }</td>
                                    <td className='w-40'>{l.opis.substring(0,30)+" ..."}</td>
                                    <td>{l.javna}</td>
                                </tr>
                                )
                        })}
                        </tbody>
                
                </table>
        </>
    )
}
