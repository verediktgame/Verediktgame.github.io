export const DEMO_CASE = {
  publicInfo: {
    titulo: "El Crimen del Callejón del Relojero",
    lugar: "Distrito Industrial Norte, Ciudad de Eldridge (Noche lluviosa)",
    fecha: "14 de Noviembre, 02:45 AM",
    victima: {
      nombre: "Arthur Pendelton (62 años)",
      descripcion: "Maestro relojero de precisión y prestamista ocasional. Su cadáver fue hallado en el taller trasero atado a una silla de roble, con las manecillas de un péndulo antiguo incrustadas en su mano izquierda."
    },
    informeGeneral: "A las 02:45 horas del 14 de noviembre, la patrulla 04 atendió un llamado anónimo que alertaba sobre una puerta forzada en el callejón de la relojería 'Cronos'. Al ingresar, los oficiales encontraron el cuerpo de Arthur Pendelton sentado y atado. La muerte fue causada por un golpe contundente en el parietal derecho y asfixia secundaria por inmersión forzada en una tina de ácido para limpieza de piezas de bronce.\n\nEn el suelo se hallaron fragmentos de porcelana y una colilla de cigarrillo extranjero aún con olor a tabaco negro. La caja fuerte del fondo estaba abierta y desvalijada.",
    descripcionEscena: "El taller tiene un olor penetrante a queroseno, aceite mineral y cobre quemado. La luz parpadea a causa de un interruptor defectuoso. En el centro, la silla con el cuerpo de Pendelton. Sobre la mesa de trabajo principal hay piezas de engranajes diminutas desparramadas en el piso junto a huellas de calzado tamaño 42 con barro arcilloso típico de la cantera norte.\n\nEn la papelera se encontró un recibo de empeño rasgado a nombre de 'G.V.' por un reloj de bolsillo de oro macizo valorado en 15.000 dólares.",
    sospechosos: [
      {
        id: "s1",
        nombre: "Gideon Vance",
        perfil: "Exaprendiz de Pendelton, despedido hace tres semanas tras ser acusado de falsificar sellos de plata. Posee deudas de juego.",
        coartada: "Afirma haber estado en la taberna 'El Ancla Oxidada' bebiendo ginebra hasta las 3:30 AM con el barman.",
        preguntas: [
          { id: "p1", pregunta: "¿Por qué tu recibo de empeño rasgado estaba en la papelera de Pendelton?", respuesta: "Le llevé un reloj familiar para pagarle una deuda que me perdonara, pero Arthur se burló de mí y lo rompió en mi cara a las ocho de la tarde. Luego me fui furioso." },
          { id: "p2", pregunta: "¿Dónde estuviste exactamente entre la 01:00 y las 03:00 AM?", respuesta: "En El Ancla Oxidada. Nadie me vio salir por la puerta trasera, pero estuve ahí... casi todo el tiempo." },
          { id: "p3", pregunta: "¿Qué marca de cigarrillos fumas?", respuesta: "Solo fumo Lucky Strike nacionales. Esos cigarrillos turcos caros son de gente con plata como el tasador Thorne." },
          { id: "p4", pregunta: "¿Sabías que la caja fuerte de Pendelton fue vaciada?", respuesta: "Viejo usurero, guardaba más de cien mil en bonos al portador. Cualquiera en el barrio lo sabía." },
          { id: "p5", pregunta: "¿De dónde sacaste el barro en tus botas?", respuesta: "Vivo cerca del río, todo el camino es un lodazal en noviembre." }
        ]
      },
      {
        id: "s2",
        nombre: "Marcus Thorne",
        perfil: "Comerciante de antigüedades finas y socio silencioso de la relojería. Su negocio atravesaba una auditoría fiscal inminente.",
        coartada: "Asegura haber estado en su despacho del centro revisando balances contables hasta el amanecer.",
        preguntas: [
          { id: "p1", pregunta: "¿Qué relación mantenía con Pendelton en los últimos días?", respuesta: "Arthur quería disolver nuestra sociedad y exigir la liquidación inmediata de mi deuda de 40.000 dólares. Tuvimos palabras duras, lo admito." },
          { id: "p2", pregunta: "¿Fuma usted cigarrillos importados 'Sobranie Black'?", respuesta: "Sí, los importo de Londres. Es una extravagancia personal que no oculto a nadie en el club." },
          { id: "p3", pregunta: "¿Posee llave o combinación de la caja fuerte del taller?", respuesta: "Solo Arthur conocía la combinación interna; yo solo tenía la llave del cerrojo exterior de seguridad." },
          { id: "p4", pregunta: "¿Alguien puede certificar que estuvo en su despacho a las dos de la mañana?", respuesta: "Mi secretaria se retiró a las diez. Después de eso estuve solo, pero firmé cheques electrónicos con registro de hora." },
          { id: "p5", pregunta: "¿Por qué se encontró barro rojizo cerca de su automóvil?", respuesta: "Ayer por la tarde visité una finca cerca de la cantera norte evaluando una colección de muebles barrocos." }
        ]
      },
      {
        id: "s3",
        nombre: "Elena Rostova",
        perfil: "Propietaria de la casa de empeños rival y prestamista clandestina. Tenía un litigio penal pendiente iniciado por Pendelton.",
        coartada: "Dice que cenó con un inspector de policía retirado en el restaurante 'La Pergola' y regresó a casa a medianoche.",
        preguntas: [
          { id: "p1", pregunta: "¿Qué motivó la demanda que Pendelton presentó en su contra?", respuesta: "Arthur afirmaba que le compré piezas robadas de la catedral. Era una calumnia absurda que mis abogados iban a desestimar." },
          { id: "p2", pregunta: "¿Cuándo fue la última vez que pisó la relojería Cronos?", respuesta: "Hace más de un año. No piso ese antro inmundo." },
          { id: "p3", pregunta: "¿Reconoce este pañuelo de seda con perfume encontrado cerca de la entrada?", respuesta: "Ese perfume barato lo compra cualquier mujer en los almacenes del puerto. Yo solo uso esencias francesas." },
          { id: "p4", pregunta: "¿Qué calibre de calzado utiliza?", respuesta: "Calzo 37, detective. A menos que crea que tengo pies de gigante, esas pisadas masculinas no son mías." },
          { id: "p5", pregunta: "¿Sabía que Pendelton guardaba los libros contables originales en su caja fuerte?", respuesta: "Esos libros contenían nombres de jueces y banqueros. Si alguien lo mató, busque a quienes figuraban en esa lista negra." }
        ]
      },
      {
        id: "s4",
        nombre: "Dr. Silas Crane",
        perfil: "Médico cirujano inhabilitado y vecino del piso superior de la relojería. Se le investigó anteriormente por tráfico de anestésicos.",
        coartada: "Sostiene que durmió profundamente bajo los efectos de somníferos desde las 23:00 horas.",
        preguntas: [
          { id: "p1", pregunta: "¿Escuchó algún ruido o grito procedente del taller a las 02:00 AM?", respuesta: "Con el temporal de viento y mis píldoras para el insomnio, no habría escuchado ni un cañonazo." },
          { id: "p2", pregunta: "¿Qué tipo de herramientas médicas o de precisión conserva en su departamento?", respuesta: "Bisturís, pinzas hemostáticas y espátulas de titanio. Nada que ver con relojería pesada." },
          { id: "p3", pregunta: "¿Por qué tenía manchas químicas en las mangas de su bata esta mañana?", respuesta: "Estaba destilando alcohol en mi laboratorio casero para esterilizar instrumental." },
          { id: "p4", pregunta: "¿Pendelton le prestó dinero recientemente?", respuesta: "Le debía dos meses de alquiler del piso. Arthur me amenazó con llamar a la brigada de narcóticos si no pagaba el lunes." },
          { id: "p5", pregunta: "¿Reconoce las pinzas de presión encontradas junto a la tina de ácido?", respuesta: "Son pinzas quirúrgicas estándar modelo Rochester. Se venden en cualquier droguería hospitalaria." }
        ]
      }
    ],
    evidencias: [
      {
        id: "e1",
        objeto: "Pesada manivela de bronce para reloj de torre",
        descripcion: "Manivela de fundición de 35 cm con bordes angulares afilados, hallada detrás de una estantería.",
        ubicacion: "Oculta detrás del mueble de engranajes del taller.",
        analisisForense: "INFORME LAB FORENSE: Se detectó tejido epitelial y sangre tipo A+ en el extremo achatado que coincide 100% con la herida parietal de la víctima. Se aislaron huellas dactilares latentes correspondientes al pulgar e índice de Marcus Thorne en el mango estriado."
      },
      {
        id: "e2",
        objeto: "Colilla de cigarrillo con filtro dorado",
        descripcion: "Cigarrillo semiconsumido de tabaco oscuro aromatizado con vainilla y cedro.",
        ubicacion: "Sobre el marco de la ventana trasera del taller.",
        analisisForense: "INFORME LAB FORENSE: Marca 'Sobranie Black Russian'. La saliva extraída para ADN contiene marcadores idénticos a las muestras de Marcus Thorne. Cenizas depositadas entre la 01:30 y las 02:30 AM."
      },
      {
        id: "e3",
        objeto: "Pinza quirúrgica de acero inoxidable",
        descripcion: "Instrumental quirúrgico de 20 cm con restos de corrosión ácida en las puntas.",
        ubicacion: "Al borde de la tina de decapado químico.",
        analisisForense: "INFORME LAB FORENSE: Residuos de ácido nítrico concentrado. Huellas dactilares borrosas con guantes de látex. Utilizada únicamente para sumergir la cabeza de la víctima en la tina tras el impacto inicial."
      },
      {
        id: "e4",
        objeto: "Barro arcilloso rojizo recogido del suelo",
        descripcion: "Muestra de sedimento húmedo con alta concentración de óxido de hierro.",
        ubicacion: "Junto a la silla del crimen.",
        analisisForense: "INFORME LAB FORENSE: Composición geológica exclusiva del estrato profundo de la Cantera Norte 'Red Hill', donde Marcus Thorne posee una finca privada."
      },
      {
        id: "e5",
        objeto: "Caja fuerte abierta sin forzar",
        descripcion: "Caja fuerte empotrada marca Chubb & Son con mecanismo de combinación de cuatro dígitos.",
        ubicacion: "Muro norte detrás de un tapiz flamenco.",
        analisisForense: "INFORME LAB FORENSE: No presenta marcas de taladro ni explosivos. Se introdujo la combinación correcta al primer intento. Se hallaron residuos de perfume masculino caro sobre la rueda de combinación."
      }
    ],
    declaraciones: [
      {
        testigo: "Jack Higgins",
        relacion: "Sereno nocturno del muelle de carga adyacente",
        texto: "Alrededor de la 01:45 vi un sedán negro de lujo estacionado sin luces a media cuadra de Cronos. Un hombre alto con abrigo oscuro y sombrero salió presuroso hacia las 02:20 llevando un maletín de cuero."
      },
      {
        testigo: "Clara Bowles",
        relacion: "Vecina del callejón",
        texto: "Escuché una discusión acalorada entre Pendelton y otro hombre con voz culta y refinada sobre 'documentos y pagarés'. Luego se oyó un golpe seco metálico y después un silencio espantoso."
      }
    ]
  },
  truth: {
    culpable: "s2",
    movil: "Marcus Thorne descubrió que Pendelton iba a entregar los libros contables secretos con sus fraudes a los inspectores fiscales y amenazaba con liquidar su sociedad arruinándolo.",
    arma: "e1",
    secuenciaReal: "Marcus Thorne acudió a la relojería a la 01:30 AM tras citar a Pendelton con el pretexto de pagar su deuda. Mientras fumaba un cigarrillo importado, exigió los libros contables y los pagarés. Ante la negativa y desprecio de Arthur, Thorne tomó la pesada manivela de bronce de un reloj de torre y le propinó un golpe certero en el cráneo, inmovilizándolo en la silla. Obligó a Pendelton a confesar la combinación de la caja fuerte sumergiéndolo en la tina de decapado ácido. Tras vaciar los libros y los bonos, Thorne huyó en su sedán negro dejando la manivela ensangrentada y la colilla en la ventana.",
    pistasClave: [
      "El cigarrillo importado Sobranie Black dejado en la ventana apuntaba directamente a Thorne.",
      "El barro arcilloso rojizo correspondía únicamente a su finca de la cantera norte.",
      "Las huellas dactilares en la manivela de bronce confirmaban su autoría material.",
      "La caja fuerte fue abierta sin dinamita ni palancas mediante la clave que le arrancó bajo tortura."
    ],
    rubrica: {
      acerto_culpable: 40,
      acerto_movil: 20,
      acerto_arma: 20,
      calidad_reconstruccion_max: 20
    },
    condenas: {
      "80_100": "Cadena perpetua sin posibilidad de libertad condicional. El tribunal halló a Marcus Thorne culpable de homicidio calificado con premeditación, alevosía y tortura.",
      "50_79": "Condena de 20 años de prisión por homicidio en ocasión de robo. Las pruebas de balística y dactiloscopia sostuvieron la acusación pese a los recursos de su defensa.",
      "20_49": "Condena reducida a 4 años por encubrimiento y obstrucción a la justicia. Las dudas razonables permitieron a sus abogados apelar la autoría material.",
      "0_19": "Veredicto: Absolución por falta de mérito probatorio. El verdadero asesino abandonó la sala de justicia como un ciudadano libre mientras el crimen quedó impune."
    }
  }
};
