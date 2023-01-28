import React from "react";

const Login = ({ onLogin, onSetUsername }) => {
  return (
    <div>
      <div className="formwrapper p-10 bg-blue-700 rounded-xl mt-20">
        <h2 className="text-2xl p-4 mb-4 text-white">
          Login: Bitte Username für Chatroom angeben
        </h2>
        <input
          type="text"
          placeholder="Dein Username"
          className="input w-full mb-4 "
          onChange={onSetUsername}
        />
        <button className="btn w-full" onClick={onLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
