// Interfaces centralizadas para las APIs

// Error responses
export interface ApiError {
  detail: string;
}

// Auth interfaces
export interface RegistroRequest {
  nombre: string;
  correo: string;
  contraseña: string;
}

export interface RegistroResponse {
  message: string;
}

export interface LoginRequest {
  correo: string;
  contraseña: string;
}

export interface LoginResponse {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  access_token: string;
  token_type: string;
}

export interface UsuarioResponse {
  id_usuario: number;
  nombre: string;
  correo: string;
}

// Admin interfaces
export interface CiudadRequest {
  nombre: string;
  codigo: string;
}

export interface CiudadResponse {
  id_ciudad: number;
  nombre: string;
  codigo: string;
}

export interface CiudadCreateResponse {
  message: string;
  id_ciudad: number;
  nombre: string;
  codigo: string;
}

export interface EquipajeRequest {
  tipo: string;
  precio: number;
  descripcion: string;
  peso_maximo: number;
}

export interface EquipajeResponse {
  id_equipaje: number;
  tipo: string;
  precio: number;
  descripcion: string;
  peso_maximo: number;
}

export interface EquipajeCreateResponse {
  message: string;
  id_equipaje: number;
  tipo: string;
  descripcion: string;
  peso_maximo: number;
  precio: number;
}

export interface VueloRequest {
  id_origen: number;
  id_destino: number;
  fecha_salida: string;
  fecha_llegada: string;
  precio_base: number;
}

export interface VueloCreateResponse {
  message: string;
  id_vuelo: number;
  codigo: string;
  precio_base: number;
}

export interface VueloResponse {
  id: number;
  codigo: string;
  fecha_salida: string;
  fecha_llegada: string;
  ciudad_salida: string;
  ciudad_llegada: string;
  precio_base: number;
  asientos_totales: number;
  asientos_disponibles: number;
}

export interface VueloBusquedaResponse {
  id_vuelo: number;
  codigo: string;
  fecha_salida: string;
  fecha_llegada: string;
  precio_base: number;
}

export interface Asiento {
  id_asiento: number;
  id_vuelo: number;
  fila: number;
  columna: string;
  disponible: boolean;
}

export interface AsientosResponse {
  asientos: Asiento[];
}

// Cliente interfaces
export interface ReservaRequest {
  id_usuario: number;
  id_vuelo: number;
  id_asiento: number;
  id_equipaje: number;
}

export interface ReservaCreateResponse {
  message: string;
  id_reserva: number;
}

export interface ReservaResponse {
  id_reserva: number;
  vuelo: string;
  fecha_salida: string;
  total: number;
}

export interface PagoRequest { //ESTÁ COMO BASE, NO IMPLICA QUE EL REQUEST FINAL SEA ASÍ
  numero_tarjeta: string;
  fecha_vencimiento: string;
  cvv: string;
  nombre_titular: string;
}

export interface PagoResponse {
  message: string;
  id_pago: number;
}