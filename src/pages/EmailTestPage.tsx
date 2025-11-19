import React from 'react';
import EmailTest from '../components/EmailTest';

const EmailTestPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: '20px',
        minWidth: '400px'
      }}>
        <EmailTest />
      </div>
    </div>
  );
};

export default EmailTestPage;