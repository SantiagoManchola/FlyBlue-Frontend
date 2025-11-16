import {
    registrarUsuario,
    loginUsuario,
    obtenerPerfil,
} from "../api/auth/auth.api";
import {
    RegistroRequest,
    LoginRequest
} from "../api/types";
import { emailService } from "./emailService";

export const authService = {
    registrar: async (data: RegistroRequest) => {
        try {
            const res = await registrarUsuario(data);
            
            // Enviar correo de bienvenida
            try {
                await emailService.enviarCorreo({
                    to: data.correo,
                    subject: '¡Bienvenido a FlyBlue! ✈️',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: #0057ff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="color: white; margin: 0;">✈️ ¡Bienvenido a FlyBlue!</h1>
                            </div>
                            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
                                <h2>Hola ${data.nombre}! 👋</h2>
                                <p>Tu cuenta ha sido creada exitosamente.</p>
                                <p>Ya puedes comenzar a reservar tus vuelos con nosotros.</p>
                                <p>¡Gracias por elegir FlyBlue!</p>
                            </div>
                        </div>
                    `
                });
            } catch (emailError) {
                console.warn('Error enviando correo de bienvenida:', emailError);
            }
            
            return res;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw error;
        }
    },

    login: async (data: LoginRequest) => {
        try {
            const res = await loginUsuario(data);
            if (res.access_token) {
                // Guardar el token con su tipo
                localStorage.setItem("token", `${res.token_type} ${res.access_token}`);
                
                // Guardar información del usuario
                const userData = {
                    id: res.id_usuario,
                    nombre: res.nombre,
                    correo: res.correo,
                    rol: res.rol
                };
                localStorage.setItem("user", JSON.stringify(userData));
            }
            return res;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error;
        }
    },

    obtenerPerfil: async () => {
        try {
            return await obtenerPerfil();
        } catch (error) {
            console.error("Error al obtener perfil:", error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};
