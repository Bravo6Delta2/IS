import { useState } from "react";
import axios from 'axios'
import ProfilH from "../comonents/ProfilH";

export default function Create(){
    let token = ""
    const [formData, setFormData] = useState({
       token:'',
       naziv:'',
       kategorija:'Obrazovanje',
       datum:'',
       opis:''

      });
      const handleInput = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        
    
        setFormData((prevState) => ({
          ...prevState,
          [fieldName]: fieldValue
        }));
      }

      const create = ()=>{
        
          formData.token =  localStorage.getItem('token')

          console.log(formData)
          axios.post('http://localhost:3001/create',formData).then(
            (res) => {
                if(res.data.msg=="GG"){
                    window.alert("Uspjesno kreirana debata")
                }
                else if(res.data.msg=="xD"){
                    window.alert("Morate se ulogovati")
                    this.props.router.push('/login')
                }
                else{
                    window.alert("Error")
                }
            },
            (err) => {
                window.alert("ErrorXd")
            }
          )
      }

    return(
        <div>
            <ProfilH id="create"/>
        <div className="d-flex justify-content-md-around">
            <div>
                Naziv:<input name="naziv" type="text" onChange={handleInput}/> <br/>
                Kategorija: <select name="kategorija"  onChange={handleInput}> 
                                <option value='Obrazovanje'>OBRAZOVANJE</option> 
                                <option value='Programiranje'>PROGRAMIRANJE</option>
                            </select> <br/>
                Datum: <input name="datum" type='datetime-local' onChange={handleInput}/> 
            </div>
            <div>
                <textarea name="opis" rows={10} cols={35} onChange={handleInput}></textarea>
            </div>
        </div>
        <div>
            <button onClick={create}>Kreiraj</button>
        </div>
        </div>
    )
}