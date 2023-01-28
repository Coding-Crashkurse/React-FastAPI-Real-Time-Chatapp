import React, { useState } from "react";
import { useEffect } from "react";

const Chat = ({ userName }) => {
  const [data, setData] = useState([]);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);

  const catchmsg = (event) => {
    setData(event.target.value);
  };

  function sendMessage(event) {
    ws.send(data);
    setData("");
    event.preventDefault();
  }

  useEffect(() => {
    let ws = new WebSocket(`ws://localhost:4455/ws/${userName}`);
    setWs(ws);
    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log(data.client_ids);
      let client_ids = [...data.client_ids];
      setClients(client_ids);

      setMessages((prevMessages) => [...prevMessages, data.message]);
    };
  }, []);

  return (
    <div className="flex mt-20 rounded border-2 border-gray-400">
      <div className="bg-white border-r-2 p-4 bg-green-400">
        <h2 className="text-xl">Teilnehmer {clients.length}:</h2>
        {clients.map((message, index) => (
          <p className="text-white pt-2" key={index}>
            {message}
          </p>
        ))}
      </div>
      <div className="p-4 bg-white h-fit rounded">
        <h2 className="text-xl mb-4">
          Hallo {userName}! Viel Spaß beim Chatten
        </h2>

        <input
          type="text"
          onChange={catchmsg}
          className="p-3 w-2/3"
          placeholder="Chatnachricht..."
        />
        <button className="btn bg-red-400 ml-4 w-20" onClick={sendMessage}>
          Send
        </button>
        <ul
          id="messages"
          className="p-2 text-gray-500 text-left mt-4 bg-gray-200"
        >
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
