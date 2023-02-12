import axios from 'axios'
import React, { useEffect, useState } from "react";
import { useRouter, withRouter } from 'next/router';
import { io } from "socket.io-client";
import jwt_decode from "jwt-decode";
import Header from '../../comonents/Header';

const socket = io('http://localhost:3001/');

export default function Room(){
    const router = useRouter();
    const [arr,setArr] = useState([]);

    const up =(media,id,t)=>{
       for (let p = 0; p<arr.length;p++) {
        if(arr[p].id == id)
            return
       }
        const videoGrid = document.getElementById('video-grid')
        const video = document.createElement('video')
        video.muted = t
        video.srcObject = media
        video.addEventListener('loadedmetadata', () => {
          video.play()
        })
        videoGrid.append(video)
        arr.push({id:id,media:media})
        console.log(arr)
    }

    useEffect(()=>{
        console.log('aa')
        const meetingID =window.location.href.split('/').pop();
        const username = jwt_decode(localStorage.getItem('token')).username
        const  peer = new Peer(username, {
            host: '/',
            port: '3002'
          });

          navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          }).then(stream => {
                up(stream,username,true);
                socket.emit('join-room', meetingID, username);    
          })

        
        socket.on('user-connected',(userId)=>{
            var mediaStream = arr.find(l =>l.id == username).media
            var call = peer.call(userId,mediaStream);
            console.log(call)
            up(call.options._stream,userId)
        })

        peer.on('call', function(call) {
            var mediaStream = arr.find(l =>l.id == username).media
            let x = call.peer
            call.answer(mediaStream);
            call.on('stream', function(stream) {
                up(stream,x,false)
              });
          });


        socket.on('dis',userId =>{
            //document.getElementById("11").innerHTML+=userId+"d \n"
        })

        socket.on('rcv-msg',(data)=>{
            document.getElementById('msg').innerHTML += data.userId + " : " + data.msg +"<br/>"
            document.getElementById('msg').lastElementChild.scrollIntoView({
                block:"end",
                inline:"nearest",
                behavior:"smooth"
            })
        })

        return()=>{
            console.log(arr[0].media.getTracks())
            arr[0].media.getTracks()[0].stop();
            arr[0].media.getTracks()[1].stop();
            socket.emit('dis');
        }
          
    },[])

    
    const send =()=>{
        const meetingID =window.location.href.split('/').pop();
        const username = jwt_decode(localStorage.getItem('token')).username
        const msg = document.getElementById("in").value

        const data = {
            roomId:meetingID,
            userId:username,
            msg:msg
        }

        socket.emit('send-msg',data);

        document.getElementById('msg').innerHTML += data.userId + " : " + data.msg +"<br/>"
        document.getElementById('msg').lastElementChild.scrollIntoView({
            block:"end",
            inline:"nearest",
            behavior:"smooth"
        })
    }

  

   

    return(
        <>
        <Header/>
        <div className='con d-inline-flex mt-3'>
        <div id="video-grid">
         
        </div>
        <div id="chat">
            <div id="msg">

            </div>
            <input id="in" type='text'/> <button onClick={send}>Posalji</button>
        </div>
        </div>
        </>
    )

}

