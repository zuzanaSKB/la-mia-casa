import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ authStatus, allowedRole, userRole, children }) {
  //if not authenticated, redirect to home
  if (!authStatus) {
    return <Navigate to="/" />;
  }

  //if user role doesn't match the allowed role, redirect to home
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" />;
  }

  //render the protected children
  return children;
}

export default ProtectedRoute;
