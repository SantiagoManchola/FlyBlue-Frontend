import {
    registrarUsuario,
    loginUsuario,
    obtenerPerfil,
} from "../api/auth/auth.api";
import {
    RegistroRequest,
    LoginRequest
} from "../api/types";

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export const authService = {
    registrar: async (data: RegistroRequest) => {
        try {
            const res = await registrarUsuario(data);
            return res;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw error;
        }
    },

    login: async (data: LoginRequest) => {
        try {
            const res = await loginUsuario(data);
            console.log("✅ Response completo:", res);
            
            if (res.token) {
                console.log("✅ Token guardado:", res.token.substring(0, 20) + "...");
                localStorage.setItem("token", res.token);
                
                // Validar si el token es exactamente igual al token de admin
                const isAdminToken = res.token === ADMIN_TOKEN;
                
                const userData = {
                    id_usuario: res.id_usuario,
                    nombre: res.nombre,
                    correo: res.correo,
                    rol: isAdminToken ? "admin" : "client",
                };
                localStorage.setItem("user", JSON.stringify(userData));
                console.log("✅ Rol guardado:", isAdminToken ? "admin" : "client");
            } else {
                console.error("❌ NO HAY TOKEN EN LA RESPUESTA");
            }
            return res;
        } catch (error) {
            console.error("❌ Error al iniciar sesión:", error);
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
