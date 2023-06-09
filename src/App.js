import React, { useRef, useState } from 'react';
import './App.css';



import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyArfBv-fneJnpMGVt1bCoapNItNdgzNZTg",
  authDomain: "chatapp-97f74.firebaseapp.com",
  projectId: "chatapp-97f74",
  storageBucket: "chatapp-97f74.appspot.com",
  messagingSenderId: "687812789928",
  appId: "1:687812789928:web:80a362742f5fc09934649d",
  measurementId: "G-ZWXJBXBQGB"
 })
 

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h3>Talk to Napoleon The Plant </h3>
        <p>Send NapoleonThePlant some motivating messages to help him grow! </p>
        <a href='https://anavpatel.github.io/NapoleonThePlant/index.html'>Back</a>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}



function SignIn()
{
 const signInWithGoogle = () => {
   const provider = new firebase.auth.GoogleAuthProvider();
   auth.signInWithPopup(provider); // add this line to sign in with Google
 }
 return(
   <button onClick={signInWithGoogle}>Sign In With Google</button>
 )
}


function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>😀</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
