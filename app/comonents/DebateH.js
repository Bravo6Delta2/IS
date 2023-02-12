import axios from 'axios'
import Link from 'next/link';
import React from "react";


class DebateH extends React.Component{

    constructor(props){
        super(props);
        this.state = {page:1,kategorija:'Obrazovanje',load:false,debate:null,pocela:true}
    }
    
    componentDidMount(){
        let data = {kategorija:this.state.kategorija, page:this.state.page,pocela:this.state.pocela}
    
        axios.post('http://localhost:3001/debateh',data).then(
            (res)=>{
                if(res.data.msg == "GG"){
                    this.setState({
                        load:true,
                        debate:res.data.debate
                    })
                }
                else{
                    this.setState({
                        load:true,
                        debate:null
                    })
                }
            },
            (err)=>{
                window.alert('error')
            }
        )
    }

    handleInput =(e)=>{

        let data = {kategorija:this.state.kategorija, page:this.state.page,pocela:this.state.pocela}

        data[e.target.name] = e.target.value;
        data.page = 1;

        axios.post('http://localhost:3001/debateh',data).then(
            (res)=>{
                if(res.data.msg == "GG"){
                    this.setState({
                        debate:res.data.debate,
                        [e.target.name] : e.target.value,
                        page:1
                    })
                }
                else{
                    this.setState({
                        debate:null,
                        [e.target.name] : e.target.value,
                        page:1
                    })
                }
            },
            (err)=>{
                Window.alert('error')
            }
        )
    }

    handleCh =(e)=>{
        let ch = 1;
        if (e.target.name == 'nazad')
            ch = -1;
        
        if(this.state.page == 1 && ch == -1)
            return
        let data = {kategorija:this.state.kategorija, page:this.state.page,pocela:this.state.pocela}
        data.page += ch
        console.log(data)

        axios.post('http://localhost:3001/debateh',data).then(
            (res)=>{
                if(res.data.msg == "GG"){
                    this.setState({
                        debate:res.data.debate,
                        page:data.page
                    })
                }
                else{
                    this.setState({
                        debate:null,
                        page:data.page
                    })
                }
            },
            (err)=>{
                Window.alert('error')
            }
        )
        }
   
    render(){
        if(!this.state.load)
        return(
            <>Hahah</>
        )
        else{
            return(
                <>
                
                <div className='d-flex justify-content-around mt-3'>
                    <div className='d-flex'>Kategorija: <select name="kategorija"  onChange={this.handleInput}> 
                                <option value='Obrazovanje'>OBRAZOVANJE</option> 
                                <option value='Programiranje'>PROGRAMIRANJE</option>
                            </select> <br/>
                    </div>

                    <div className='d-flex'>
                        Stanje: <select name="pocela" onChange={this.handleInput}>
                                    <option value={true}>Debate u toku</option>
                                    <option value={false}>Zakazane debate</option>
                                </select>
                    </div>
                </div>
                <br/>
                <div className='mar mt-3'>
                <table className='table'>
                    <thead>
                        <tr>
                        <th scope="col">Naziv</th>
                        <th scope="col">Username</th>
                        <th scope='col'>Datum</th>
                        <th scope="col">Opis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.debate?.map(l => {
                            return(
                                <tr key={l.id}>
                                    <td className='w-10'><Link href={"/debata/"+l.id}>{l.naziv}</Link></td>
                                    <td className='w-10'>{l.username}</td>
                                    <td className='w-20'>{l.datum.split('T')[0]+" "+l.datum.split('T')[1].split('Z')[0].substring(0,5) }</td>
                                    <td className='w-40'>{l.opis.substring(0,30)+" ..."}</td>
                                </tr>
                                )
                        })}
                        </tbody>
                
                </table>
                </div>
                <div className='d-flex justify-content-center'>
                    
                    <button className='m-1' name='nazad' onClick={this.handleCh}>Nazad</button>
                    
                    <button className='m-1' name="naprijed" onClick={this.handleCh}>Naprijed</button>
                
                </div>
                </>

            )
        }
    }
}

export default DebateH;