import React, {useEffect, useState, useRef} from 'react';
import * as signalR from "@microsoft/signalr";
import logo from './logo.svg';
import './App.css';

interface IMessage {
  message : string,
  user : string
}

function App() {

  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection>();
  const [counter , setCounter] = useState(0);

  const [message, setMessage] = useState('');
  const userRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    
    const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:44317/chat")
    .build();

    hubConnection.start()
    .then(a =>{
      console.log("Connection Started With Hub")
    })
    .catch(e =>{
      console.log(e)
    })

    hubConnection.on("ReceiveMessage", (user : string, message :string)=>{
      setMessages((prevState)=>[...prevState, {message, user}])
    })

    setHubConnection(hubConnection);

    return () => {
      // setHubConnection(null);
    };
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <ul>
          {
            messages.map((message:IMessage, index : number) => <li key={index}>{message.user} -> {message.message}</li>)
          }
        </ul>
        <input type="text" ref={userRef} placeholder="User" />
        <input type="text" value={message} placeholder="Message" onChange={(e)=>{
          setMessage(e.target.value);
        }} />
        <button onClick={()=>{
            hubConnection?.invoke("SendMessage", `${userRef.current?.value}`, `${message}`)
            setMessage('');
        }} >Send</button>
      </header>
    </div>
  );
}

export default App;
