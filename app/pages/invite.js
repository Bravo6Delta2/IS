import { useEffect, useState } from "react";
import axios from 'axios'
import Link from "next/link";
import ProfilH from "../comonents/ProfilH";




export default function Invite(){
    const [inv,setInv] = useState([]);

    
    const pr = (e) => {
        let p = e.target.name.split(' ')
        let data = {id_d:p[0],token:localStorage.getItem('token'),resp:true,ui:p[1]}
        axios.post('http://localhost:3001/rein',data).then(
            (res) => {
                if(res.data.msg=='GG'){
                    window.alert("Uspjesno ste odgovorili")
                }
                else{
                    window.alert("Greska")
                }
            },
            (err) => {
                window.alert("error")
            }
        )
    }
    
    const od = (e) => {
        let p = e.target.name.split(' ')
        let data = {id_d:p[0],token:localStorage.getItem('token'),resp:false,ui:p[1]}
        axios.post('http://localhost:3001/rein',data).then(
            (res) => {
                if(res.data.msg=='GG'){
                    window.alert("Uspjesno ste odgovorili")
                }
                else{
                    window.alert("Greska")
                }
            },
            (err) => {
                window.alert("error")
            }
        )
    }

    useEffect(()=>{
        let data = {token:localStorage.getItem('token')}
        axios.post('http://localhost:3001/getin',data).then(
            (res) => {
                if(res.data.msg == "GG"){
                    console.log(res.data.inv)
                    setInv(res.data.inv)
                }
                else{
                    window.alert("Greska")
                }
            },
            (err) =>{
                window.alert("error")
            }
        )
    },[])



    return(
        <>
        <ProfilH id="invite"/>
        <table className="table m-5">
            <thead>
                <tr>
                    <th scope="col">ID Debate</th>
                    <th scope="col">Username</th>
                    <th scope="col">Prihavit</th>
                    <th scope="col">Odbi</th>

                </tr>
            </thead>

            <tbody>
                {inv?.map(l => <tr key={l.id_d}>
                    <td><Link href={'/debata/'+l.id_d}>{l.id_d}</Link></td>
                    <td>{l.ui}</td>
                    <td><button name={l.id_d+" "+l.ui} onClick={pr} type="button" className="btn btn-outline-success">Ucestvujem</button></td>
                    <td><button name={l.id_d+" "+l.ui} onClick={od} type="button" className="btn btn-outline-danger">Ne Ucestvujem</button></td>
                </tr>)}
            </tbody>

        </table>
        </>
    )
}