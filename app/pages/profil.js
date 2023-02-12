import React from "react";
import axios from 'axios'
import { withRouter } from 'next/router'
import DebateK from "../comonents/DebateK";
import Header from "../comonents/Header";
import ProfilH from "../comonents/ProfilH";

class Profil extends React.Component{
  
    
    constructor(props){
        super(props);
        this.state = {logged:false}
    }

    componentDidMount(){
        let data = {token:localStorage.getItem('token')};
        if(data.token == null){
            window.alert("Morate se ulogovati")
            this.props.router.push('/login')
        }

        //console.log(data)
        axios.post("http://localhost:3001/profil",data).then(
            (res)=>{
                if(res.data.msg=='GG'){
                    this.setState({
                        logged:true,
                        user:res.data.user
                    })
                }
                else{
                    window.alert("Morate se ulogovati")
                    this.props.router.push('/login')
                }
            },
            (err)=>{
                window.alert("error")
                this.props.router.push('/')
            }
        )
    }

    render(){
        if(this.state.logged)
        return(
            <>
                <ProfilH id="0"/>
                <DebateK/>
            </>
        )

    }

}

export default withRouter(Profil);