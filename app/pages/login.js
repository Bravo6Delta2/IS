import { useRouter } from 'next/dist/client/router';
import { useContext, useState } from 'react';
import Header from '../comonents/Header';
import LogContext from '../context/log';
import axios from 'axios'
import Link from 'next/link';

export default function Login() {
    const [logged,change] = useContext(LogContext)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
    const x = ()=>{
        let data = {email:formData.email,password:formData.password}
        console.log(data);
        axios.post('http://localhost:3001/login', data).then(
            (response) => {
                if(response.data.msg != 'GG')
                    window.alert(response.data.msg);
                else{
                    localStorage.setItem('token', response.data.token);
                    change();
                    router.push('/')
                }
            } ,
            (err) => window.alert('Neuspjesno logovanje'));
    }
    
    return (
      <>
      <Header/>
      <center>
      <div className='mt-1'>
        Login page
        <div className='m-2 p-2'>
       <div className='m-3'>email: <input name={"email"} type={"text"} onChange={handleInput}/></div>
        <div className='m-3'>password: <input name={"password"} type={"text"} onChange={handleInput}/></div> 
        </div>
        <button className='btn btn-light' onClick={x}>Log in</button>
        <div className='m-3 p-2'>Ako nemate profil pritsninte na <Link href={'/register'}>Register</Link></div>
      </div>
      </center>  
      </>    
    )
  }