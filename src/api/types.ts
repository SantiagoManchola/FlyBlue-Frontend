// Interfaces centralizadas para las APIs

export interface CiudadRequest {
  nombre: string;
  codigo: string;
}

export interface EquipajeRequest {
  tipo: string;
  precio: number;
  descripcion: string;
  peso_maximo: number;
}

export interface VueloRequest {
  id_origen: number;
  id_destino: number;
  fecha_salida: string;
  fecha_llegada: string;
  precio_base: number;
}

export interface RegistroRequest {
  correo: string;
  nombre: string;
  contraseña: string;
}

export interface LoginRequest {
  correo: string;
  contraseña: string;
}

export interface ReservaRequest {
  id_usuario: number;
  id_vuelo: number;
  id_asiento: number;
  id_equipaje: number;
}