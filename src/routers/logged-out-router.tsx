import React from 'react';
import { isLoggedInVar } from '../apollo';

function LoggedOutRouter() {
  const handleLogin = () => {
    isLoggedInVar(true);
  };

  return (
    <div>
      <h1>Logged out</h1>
      <button type="button" onClick={handleLogin}>
        Click to login
      </button>
    </div>
  );
}

export default LoggedOutRouter;
