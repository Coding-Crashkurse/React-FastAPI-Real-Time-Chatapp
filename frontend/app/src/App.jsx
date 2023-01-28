import { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import "./App.css";

function App() {
  const [loggedIn, setLogin] = useState(false);
  const [userName, setUserName] = useState("");

  const login = () => {
    setLogin(true);
  };

  const setusername = (event) => {
    setUserName(event.target.value);
  };

  return (
    <div className="h-screen bg-gray-100">
      <div className="flex justify-center">
        {!loggedIn ? (
          <Login onLogin={login} onSetUsername={setusername}></Login>
        ) : (
          <Chat userName={userName}></Chat>
        )}
      </div>
    </div>
  );
}

export default App;
