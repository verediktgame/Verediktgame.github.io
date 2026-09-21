// Easter egg de Hogwarts: 1 de septiembre (parte el Expreso de Hogwarts),
// único día del año — y solo dentro de la franja horaria 09:45 → 24:00.
// Fuera de esa franja el easter egg no existe (ni tema, ni caso, ni comunidad).
export function isHogwartsEasterEggWindow(date = new Date()) {
  if (date.getMonth() !== 8 || date.getDate() !== 1) {
    return false;
  }
  const mins = date.getHours() * 60 + date.getMinutes();
  return mins >= 9 * 60 + 45 && mins < 24 * 60; // 585 a 1440
}