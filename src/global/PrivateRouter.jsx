

import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const PrivateRouter = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This is equivalent to history.goBack()
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p style={{ fontWeight: 'bold', fontSize: 20 }}>Permission Denied: Access restricted to authorized users only.</p>
      <Button variant="contained" color="primary" onClick={handleGoBack} style={{ marginTop: '10px' }}>
        Go Back
      </Button>
    </div>
  );
}

export default PrivateRouter;

