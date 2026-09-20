// Día especial de Hogwarts: 1 de septiembre (cuando parte el Expreso de Hogwarts).
// Ese día el caso easter egg de Harry Potter está disponible, los casos generados
// con IA se ambientan en el mundo mágico y la comunidad muestra solo expedientes
// que apuntan a la carpeta Harry Potter.
//
// Se aplica exclusivamente el 1 de septiembre de cada año; cualquier otro día no
// hay forma de acceder a esta vista (no existe override por URL).
export function isHogwartsDay(date = new Date()) {
  return date.getMonth() === 8 && date.getDate() === 1;
}