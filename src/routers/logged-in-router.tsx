import React from 'react';
import { isLoggedInVar } from '../apollo';

function LoggedInRouter() {
  return (
    <div>
      <h1>Logged in</h1>
      <button type="button" onClick={() => isLoggedInVar(false)}>
        Click to logout
      </button>
    </div>
  );
}

export default LoggedInRouter;
