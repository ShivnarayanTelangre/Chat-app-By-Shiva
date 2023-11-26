
import './App.css';
import React,{useRef, useState} from 'react';
import firbase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';


import {useCollectionData} from 'react-firebase-hooks/firestore';



import {useAuthState } from 'react-firebase-hooks/auth';

firbase.initializeApp({
  apiKey: "AIzaSyAbWDrmX9pM66UDyPSrQcun7Rd6MgPE4io",
  authDomain: "react-chat-app-d99ba.firebaseapp.com",
  projectId: "react-chat-app-d99ba",
  databaseURL:"https:/react-chat-app-d99ba.firebaseio.com",
  storageBucket: "react-chat-app-d99ba.appspot.com",
  messagingSenderId: "1098349903135",
  appId: "1:1098349903135:web:482b812b4b6a54854ec42a",
  measurementId: "G-XMWJV0K2ET"
})

const auth=firbase.auth();
const filestore=firbase.firestore();
function App() {

const [user]=useAuthState(auth);
  return (
    <div className="App">
      <div className='App-Header'>
      <header>
       
        <h1>ChatAppBy -Shiva</h1>
        <SignOut />
       
      <section>
        {user?<ChatRoom/>:<SignIn />}
      </section>
      </header> 
      </div>
    </div>
  );
}
function SignIn(){
  const signInWithGoogle =()=>{
// error check on firbase
    const provider=new firbase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
return(
  <> 
  <button className='sign-in' onClick={signInWithGoogle}>Sign In With Google </button>
  <p> Lets connect to track and grow together. #we will rock</p>
  </>
)
}
function SignOut(){
  return auth.currentUser &&(
    <button className='sign-out' onClick={()=>auth.signOut()}>SignOut</button>
  )

   
}
function ChatRoom(){
   const  dummy=useRef();
   const messagesRef=filestore.collection('messages');
   const query= messagesRef.orderBy('createdAt').limit(2000);
   const [messages]=useCollectionData(query,{idField:'id'});
   const [formValue,setFormValue]=new useState('');
   const sendMessage=async(e)=>{
    e.preventDefault();
   
   const{uid,photoURL}=auth.currentUser;
   await messagesRef.add({
    text:formValue,
    createdAt:firbase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL 
   })
   setFormValue('');
  
  }
   return (
    <>
    {messages && messages.map(msg=><ChatMessage key={msg.id} message={msg}/>)}
    <form onSubmit={sendMessage}>
      <input value={formValue}  onChange={(e)=>setFormValue(e.target.value)} placeholder='add something'/>
      <button type="submit" disabled={!formValue}>Go</button>
    </form>
    </>
   )
}

function ChatMessage(props){
 const {text,uid,photoURL}=props.message;
 const messageClass=uid===auth.currentUser.uid?'sent':'recent';
 return (
  <>
  <div className={`message ${messageClass}`}>
    
    <p>{text}<img src={photoURL}/></p>
    
    
  </div>
  </>
 )
}

export default App;
