export const CIUDADES_FAMOSAS = [
  "🎲 Aleatoria — La IA elige la ciudad y la época",
  "Buenos Aires, Argentina",
  "Ciudad de México, México",
  "Madrid, España",
  "Barcelona, España",
  "Nueva York, Estados Unidos",
  "Londres, Reino Unido",
  "París, Francia",
  "Tokio, Japón",
  "São Paulo, Brasil",
  "Berlín, Alemania",
  "Roma, Italia",
  "Chicago, Estados Unidos",
  "Los Ángeles, Estados Unidos",
  "Moscú, Rusia",
  "Estambul, Turquía",
  "Shanghai, China",
  "Bogotá, Colombia",
  "Lima, Perú",
  "Santiago, Chile",
  "Montevideo, Uruguay",
  "La Habana, Cuba",
  "Lisboa, Portugal",
  "Ámsterdam, Países Bajos",
  "Viena, Austria",
  "Praga, República Checa",
  "El Cairo, Egipto",
  "Lagos, Nigeria",
  "Mumbai, India",
  "Sydney, Australia",
  "Toronto, Canadá"
];

export async function searchCitiesNominatim(query) {
  if (!query || query.trim().length < 3) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&featuretype=city&limit=6&format=json&accept-language=es`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'es' }
    });
    const data = await res.json();
    return data.map(r => r.display_name.split(',').slice(0, 2).join(',').trim());
  } catch {
    return [];
  }
}
