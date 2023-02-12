import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import axios from 'axios'

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    ime:"",
    username:""
  });
  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue
    }));
  }
  const router = useRouter()
  const send = ()=>{
      let data = {
        email:formData.email,
        password:formData.password,
        ime_przime:formData.ime,
        username:formData.username
      }
      axios.post('http://localhost:3001/register', data).then(
        (res) => {
          if(res.data.msg == "email"){
            window.alert("Email je vec iskoriscen")
            return
          }
          else if (res.data.msg == "username"){
            window.alert("Username je vec zauzet")
            return
          }
          else if (res.data.msg == "GG"){
            window.alert("Uspjesno ste registrovani \n Bicete prebaceni na Login starnu")
            router.push('/login')
            return
          }
          else{
            window.alert('Doslo je do greske')
          }
        } ,
        (err) => window.alert('Neuspjesno registrovanje'));
  }

    return (
      <>
        Register<br/>
        Forma
          <div>
          <div className="d-flex justify-content-center">
            ime i prezime:<input name='ime' onChange={handleInput}/> 
            username:<input name='username' onChange={handleInput}/>
          </div>
          <div className="d-flex justify-content-center">
            email:<input name='email' onChange={handleInput}/>
            password:<input name='password' onChange={handleInput}/>
          </div>
          <div className="d-flex justify-content-center">
            <button onClick={send}>Register</button>
          </div>
       </div>
      </>
    )
  }