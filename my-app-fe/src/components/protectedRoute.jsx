import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ authStatus, children}) {
  return authStatus ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
