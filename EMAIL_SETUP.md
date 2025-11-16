# 📧 Configuración de Correos Reales - FlyBlue

## 🚀 Configuración Rápida

### 1. Configurar Gmail SMTP

1. **Activar verificación en 2 pasos:**
   - Ve a https://myaccount.google.com/security
   - Activa la verificación en 2 pasos

2. **Generar contraseña de aplicación:**
   - En la misma página, busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo"
   - Copia la contraseña generada (16 caracteres)

3. **Configurar variables de entorno:**
   ```bash
   # En tu archivo .env
   GMAIL_USER=flyblue2025@gmail.com
   GMAIL_APP_PASSWORD=tu_password_de_aplicacion_aqui
   ```

### 2. Instalar dependencias

```bash
pnpm install @vercel/node @types/nodemailer
```

## 🧪 Pruebas

### Prueba desde línea de comandos:
```bash
node tools/send-real-email.js tu@email.com
```

### Prueba desde la aplicación web:
1. Ejecuta `pnpm dev`
2. Ve a la página de prueba de correos
3. Ingresa un email de destino
4. Haz clic en "Enviar Correo de Prueba"

## 📁 Archivos Creados

- `src/components/EmailTest.tsx` - Componente React para pruebas
- `src/pages/EmailTestPage.tsx` - Página de prueba
- `api/email/send.ts` - API endpoint para Vercel
- `tools/send-real-email.js` - Script de prueba CLI

## 🔧 Uso en Producción

### Para enviar correos desde tu aplicación:

```typescript
const response = await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'cliente@email.com',
    subject: 'Confirmación de vuelo',
    html: '<h1>Tu vuelo está confirmado</h1>'
  })
});
```

## ⚠️ Notas Importantes

- **Gmail tiene límites:** 500 correos/día para cuentas gratuitas
- **Para producción:** Considera usar SendGrid, AWS SES, o similar
- **Seguridad:** Nunca expongas las credenciales en el frontend
- **Variables de entorno:** Asegúrate de configurarlas en Vercel también

## 🐛 Solución de Problemas

### Error de autenticación:
- Verifica que la verificación en 2 pasos esté activada
- Usa una contraseña de aplicación, no tu contraseña normal
- Revisa que GMAIL_USER y GMAIL_APP_PASSWORD estén correctos

### Correos no llegan:
- Revisa la carpeta de spam
- Verifica que el email de destino sea válido
- Comprueba los logs de la consola

## 📞 Soporte

Si tienes problemas, revisa:
1. Las variables de entorno están configuradas
2. La contraseña de aplicación es correcta
3. Los logs de error en la consola