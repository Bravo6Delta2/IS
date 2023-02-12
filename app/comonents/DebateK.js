import React from "react";
import axios from 'axios'
import { withRouter } from 'next/router'
import Link from 'next/link';

class DebateK extends React.Component{

    constructor(props){
        super(props);
        this.state = {page:1,ren:false,debate:null}

    }

    componentDidMount(){
        let data = {token:localStorage.getItem('token'),page:this.state.page}
        axios.post('http://localhost:3001/debatek',data).then(
            (res) => {
                if(res.data.msg == "GG"){
                    this.setState({
                        ren:true,
                        debate:res.data.debate
                    })}
                else if (res.data.msg == "Xd"){
                    window.alert("Morate se ulogovati")
                    this.props.router.push('/login')
                }

            },
            (err) => {
                window.alert("Error")
            }
        )
    }

    handleCh =(e)=>{
        let ch = 1;
        if (e.target.name == 'nazad')
            ch = -1;
        
        if(this.state.page == 1 && ch == -1)
            return
        let data = {token:localStorage.getItem('token'),page:this.state.page}
        data.page += ch
        
        axios.post('http://localhost:3001/debatek',data).then(
            (res)=>{
                if(res.data.msg == "GG"){
                    this.setState({
                        debate:res.data.debate,
                        page:data.page
                    })
                }
                else if (res.data.msg == "Xd"){
                    window.alert("Morate se ulogovati")
                    this.props.router.push('/login')
                }
            },
            (err)=>{
                Window.alert('error')
            }
        )
        }

    sendInv =(e)=>{
        let k = "i"+e.target.name

        let doc = document.getElementById(k)
        let data = {username:doc.value,id:e.target.name,token:localStorage.getItem('token')}

        axios.post('http://localhost:3001/sein',data).then(
            (res) => {
                if(res.data.msg == 'GG'){
                    doc.value = ""
                }
                else{
                    window.alert("Greska")
                }
            },
            (err) => {
                window.alert("Error")
            }
            
            )
    }

    start =(e)=>{
        let data = {token:localStorage.getItem('token'),id:e.target.name}
        console.log(data)
        axios.post('http://localhost:3001/start',data).then(
            (res) => {
                if(res.data.msg == "GG"){
                    window.alert('Debata je pocela')
                }
            },
            (err) => {
                window.alert("error")
            }
        )
    }

    end = (e) =>{
        if( e.target.className == "btn btn-danger")
            return
        const data = {token:localStorage.getItem('token'),id:e.target.name}    
        axios.post('http://localhost:3001/chz',data).then(
            (res) => {
                if(res.data.msg == 'GG'){
                    e.target.className ="btn btn-danger"
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
    priv = (e)=>{
        let data = {token:localStorage.getItem('token'),id:e.target.name,javna:e.target.checked}

        axios.post('http://localhost:3001/chp',data).then(
            (res) => {
                if(res.data.msg == "GG"){
                    for (let i = 0 ; i< this.state.debate.length;i++){
                        if(this.state.debate[i].id.toString()==e.target.name){
                            this.state.debate[i].javna = e.target.checked
                            this.setState({
                                dabate:this.state.debate
                            })
                        }
                    }
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
    render(){

        if (this.state.ren)
            return(
                <>
                <div className='mar mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                        <th scope="col">Naziv</th>
                        <th scope="col">Datum</th>
                        <th scope='col'>Pozovi Korisnika</th>
                        <th scope="col">Pocni</th>
                        <th scope="col">Zaustavi</th>
                        <th scope="col">Javna</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.debate?.map(l => {
                            return(
                                <tr key={l.id}>
                                    <td className='wk-10'> <Link href={"/debata/"+l.id}>{l.naziv}</Link></td>
                                    <td className='wk-10'> {l.datum.split('T')[0]+" "+l.datum.split('T')[1].split('Z')[0].substring(0,5) }</td>
                                    <td className='wk-20'> <input id={'i'+l.id} className="form-control" type="text"/><button onClick={this.sendInv} className="btn btn-light mt-2" name={l.id}>Posalji</button></td>
                                    <td className='wk-10'> <button className="btn btn-light" onClick={this.start} name={l.id}>Pocni</button></td>
                                    <td className='wk-10'> <button className="btn btn-light" onClick={this.end} name={l.id}>Zaustavi</button></td>
                                    <td className='wk-10'>
                                        <label className="switch">
                                        <input name={l.id} type="checkbox" checked={l.javna} onChange={this.priv}/>
                                        <span className="slider round"></span>
                                        </label>
                                    </td>
                                </tr>
                                )
                        })}
                        </tbody>
                
                </table>
                </div>
                <div className='d-flex justify-content-center'>
                    
                    <button className='m-1 btn btn-light' name='nazad' onClick={this.handleCh}>Nazad</button>
                    
                    <button className='m-1 btn btn-light' name="naprijed" onClick={this.handleCh}>Naprijed</button>
                
                </div>
                </>
            )
    }

}

export default  withRouter(DebateK) 