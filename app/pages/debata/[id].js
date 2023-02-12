import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from 'axios'
import Link from "next/link";
import Header from "../../comonents/Header";


export default function Debata(props){
    const [info,setInfo] = useState({
        info:{
            naziv:"NEMA DEBATE",
            kategorija:'404',
            opis:"DEBATA NE POSTIJI",
            datum:"",
            username:""
        },
        ucs:null
    })
    
    const xx = () =>{
        if(info.info.javna == true)
        return(<div><Link href={"/room/"+info.info.id}>GLEDAJ</Link></div>)
    }


    useEffect(()=>{
       let data = {id:props.id}
        console.log(data)
        /*if(props.data.msg == "GG")
            setInfo(props.data.info)*/
       axios.post('http://localhost:3001/debata',data).then(
            (res) => {
                if(res.data.msg == "GG"){
                    console.log(res.data.info)
                    setInfo(res.data.info)
                }
                else{
                    window.alert("Debate ne postoji")
                }
            },
            (err) => {
                window.alert('Error')
            }
        )


    },[])

    return (
        <>
        <Header/>
        <center>
        <div className="m-5 deb p-5">
            
        <div><h3>{info.info.naziv}</h3> <h4>{info.info.kategorija}</h4></div>
        <div className="m-3">
            <div className="mb-2">Opis:</div>
            <div className="opis">{info.info.opis}</div>    
        </div>
        <div>Datum: {info.info.datum.split('T')[0].replaceAll("-",".")+" "+info.info.datum.split('T')[1]?.split('Z')[0].substring(0,5) }</div>
        <div className="d-flex justify-content-around m-3">
            <div>Kreator: {info.info.username}</div>
            <div>
            {info.ucs!=null && info.ucs.legth>0?"Ucesnici:":""}
                <ul>
                    {info.ucs?.map(l => <li>{l.ur}</li>)}
                </ul>
            </div>
        </div>
        {xx()}
       
        </div>
        </center>
        </>
    )
}


export async function getServerSideProps(context) {
   const { id } = context.query;
    const res = await axios.post('http://localhost:3001/debata',{id:id})
    const data = res.data
    return { props: { id,data } };
  }