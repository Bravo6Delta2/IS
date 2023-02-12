import Link from 'next/link';
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";


export default function Header() {
    const [childCount, setChildCount] = useState(0);
    useEffect(() => {
        setChildCount(localStorage.getItem('token'))
      }, []);

    const xx = () =>{
      console.log(childCount)
      const d = new Date();
      if(childCount!= null && childCount != 0 && jwt_decode(childCount).exp < d.getTime())
        return(<Link href={'/profil'}>Profil</Link>)
      else
        return(<Link href={'/login'}>Login</Link>)
    }
    //if (childCount > 0)
    return (
     <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand ms-5" href="/"><h3>Debate</h3></Link>
         
      <div className="collapse navbar-collapse ms-5" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" href="/">O nama</Link>
            </li>
          </ul>
    </div>
    <div className='d-flex me-5'>{xx()}</div>
  </div>
</nav>
       
    )
  
  
  }