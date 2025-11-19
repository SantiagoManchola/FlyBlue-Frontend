import React, { useState } from 'react';

const EmailTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendTestEmail = async () => {
    if (!email) {
      setMessage('Por favor ingresa un email');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Prueba de correo - FlyBlue',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #0057ff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">FlyBlue</h1>
              </div>
              <div style="background: white; padding: 20px; border-radius: 0 0 8px 8px;">
                <h2>¡Correo de prueba enviado exitosamente!</h2>
                <p>Este es un correo de prueba enviado desde la aplicación FlyBlue.</p>
                <p>Si recibes este mensaje, significa que el sistema de correos está funcionando correctamente.</p>
                <hr style="margin: 20px 0;">
                <p style="color: #666; font-size: 14px;">
                  Este correo fue enviado el ${new Date().toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          `
        }),
      });

      if (response.ok) {
        setMessage('✅ Correo enviado exitosamente!');
      } else {
        const error = await response.text();
        setMessage(`❌ Error: ${error}`);
      }
    } catch (error) {
      setMessage(`❌ Error de conexión: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Prueba de Envío de Correo</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Email de destino:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      <button
        onClick={sendTestEmail}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          background: loading ? '#ccc' : '#0057ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Enviando...' : 'Enviar Correo de Prueba'}
      </button>

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          borderRadius: '4px',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default EmailTest;