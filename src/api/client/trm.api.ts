export const obtenerTRM = async (): Promise<number> => {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/EUR");
    const data = await response.json();

    if (!data.rates || !data.rates.COP) {
      throw new Error("TRM no encontrada");
    }

    return data.rates.COP; // COP por 1 EUR
  } catch (e) {
    console.error("❌ Error obteniendo TRM:", e);

    // Fallback por si falla la API
    return 4500;
  }
};
