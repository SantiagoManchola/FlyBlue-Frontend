import {
    registrarUsuario,
    loginUsuario,
    obtenerPerfil,
} from "../api/auth/auth.api";
import {
    RegistroRequest,
    LoginRequest
} from "../api/types";

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
