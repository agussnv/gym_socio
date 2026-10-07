export const GYM = 'ZGYM DIAZ';
export const CAPACITY = 40;
export const COACH = 'Dani';

export const EX = {
  pb: { ini: 'PB', name: 'Press banca', muscle: 'Pecho · tríceps · hombro', group: 'Pecho', rest: 120, best: 60,
    sets: [[60, 10, '60 kg × 10'], [62.5, 8, '60 kg × 9'], [62.5, 8, '60 kg × 8'], [60, 8, '57,5 kg × 8']],
    steps: ['Túmbate con los ojos bajo la barra y los pies firmes en el suelo.', 'Agarra la barra algo más ancho que los hombros y lleva los omóplatos atrás y abajo.', 'Baja la barra controlada hasta la parte media del pecho.', 'Empuja hasta estirar los brazos sin bloquear los codos.'],
    tip: 'Despegar los glúteos del banco o rebotar la barra en el pecho.',
    coach: 'Baja la barra en 2 segundos y haz una pausa corta en el pecho. Si la última serie no sale limpia, quédate en 60 kg.' },
  pm: { ini: 'PM', name: 'Press militar', muscle: 'Hombro · tríceps', group: 'Hombro', rest: 90, best: 30,
    sets: [[32.5, 10, '30 kg × 10'], [32.5, 9, '30 kg × 10'], [30, 9, '30 kg × 9']],
    steps: ['De pie, barra a la altura de las clavículas y agarre al ancho de hombros.', 'Aprieta glúteos y abdomen para no arquear la espalda.', 'Empuja la barra hacia arriba pasando cerca de la cara.', 'Bloquea arriba con la barra sobre la cabeza y baja controlado.'],
    tip: 'Arquear la zona lumbar para empujar más peso.',
    coach: 'Mantén el core apretado todo el rato; si notas la zona lumbar, hazlo sentada con respaldo.' },
  fo: { ini: 'FO', name: 'Fondos', muscle: 'Tríceps · pecho', group: 'Brazos', rest: 90, best: 0,
    sets: [[0, 12, '× 12'], [0, 11, '× 10'], [0, 10, '× 9']],
    steps: ['Sujétate en las paralelas con los brazos estirados.', 'Baja flexionando los codos hasta formar unos 90 grados.', 'Sube empujando sin balancear las piernas.'],
    tip: 'Bajar demasiado y cargar los hombros.' },
  do: { ini: 'DO', name: 'Dominadas', muscle: 'Espalda · bíceps', group: 'Espalda', rest: 120, best: 0,
    sets: [[0, 8, '× 7'], [0, 7, '× 7'], [0, 6, '× 6']],
    steps: ['Cuélgate de la barra con agarre algo más ancho que los hombros.', 'Lleva los omóplatos abajo antes de tirar.', 'Sube hasta pasar la barbilla por encima de la barra.', 'Baja controlado hasta estirar los brazos.'],
    tip: 'Hacer medias repeticiones o balancearse.',
    coach: 'Si no llegas a las 6 reps, usa la goma verde en la última serie.' },
  rb: { ini: 'RB', name: 'Remo con barra', muscle: 'Espalda · bíceps', group: 'Espalda', rest: 90, best: 50,
    sets: [[50, 10, '50 kg × 10'], [50, 10, '50 kg × 9'], [52.5, 8, '50 kg × 8']],
    steps: ['Inclina el tronco unos 45 grados con la espalda recta.', 'Tira de la barra hacia el ombligo llevando los codos atrás.', 'Baja controlado sin perder la postura.'],
    tip: 'Redondear la espalda o tirar con impulso.' },
  cb: { ini: 'CB', name: 'Curl de bíceps', muscle: 'Bíceps', group: 'Brazos', rest: 60, best: 12,
    sets: [[12, 12, '12 kg × 12'], [12, 10, '12 kg × 10'], [14, 8, '12 kg × 9']],
    steps: ['De pie, mancuernas a los lados y codos pegados al cuerpo.', 'Sube flexionando los codos sin mover los hombros.', 'Baja despacio hasta estirar del todo.'],
    tip: 'Balancear el cuerpo para subir el peso.' },
  se: { ini: 'SE', name: 'Sentadilla', muscle: 'Pierna · glúteo', group: 'Pierna', rest: 150, best: 80,
    sets: [[80, 8, '80 kg × 8'], [80, 8, '80 kg × 8'], [85, 6, '80 kg × 7']],
    steps: ['Barra sobre los trapecios y pies al ancho de hombros.', 'Baja llevando la cadera atrás y las rodillas hacia fuera.', 'Baja hasta que el muslo quede paralelo al suelo.', 'Sube empujando el suelo con todo el pie.'],
    tip: 'Juntar las rodillas al subir.',
    coach: 'Ojo con la rodilla izquierda: baja solo hasta el paralelo y empuja con el talón.' },
  pr: { ini: 'PR', name: 'Peso muerto rumano', muscle: 'Isquios · glúteo', group: 'Pierna', rest: 120, best: 70,
    sets: [[70, 10, '70 kg × 10'], [70, 10, '70 kg × 10'], [75, 8, '70 kg × 8']],
    steps: ['De pie con la barra delante de los muslos.', 'Lleva la cadera atrás con las rodillas casi estiradas.', 'Baja la barra pegada a las piernas hasta notar estiramiento.', 'Vuelve arriba apretando glúteos.'],
    tip: 'Redondear la espalda al bajar.',
    coach: 'Rodillas un poco flexionadas y la barra siempre rozando las piernas.' },
  el: { ini: 'EL', name: 'Elevaciones laterales', muscle: 'Hombro', group: 'Hombro', rest: 60, best: 8,
    sets: [[8, 15, '8 kg × 15'], [8, 14, '8 kg × 12'], [10, 10, '8 kg × 12']],
    steps: ['De pie, mancuernas a los lados y codos un poco flexionados.', 'Sube los brazos hacia los lados hasta la altura de los hombros.', 'Baja despacio.'],
    tip: 'Subir con impulso o por encima de los hombros.' },
  sa: { ini: 'SA', name: 'Saco: combinaciones', muscle: 'Artes marciales · cardio', group: 'Artes marciales', rest: 60, best: 0,
    sets: [[0, 3, '3 min'], [0, 3, '3 min'], [0, 3, '3 min']],
    steps: ['Guardia alta y pies a la anchura de los hombros.', 'Encadena jab, directo y gancho girando la cadera.', 'Vuelve siempre a la guardia después de cada golpe.'],
    tip: 'Bajar la guardia al cansarse.' },
};

export const EX_ORDER = ['pb', 'pm', 'fo', 'do', 'rb', 'cb', 'se', 'pr', 'el', 'sa'];
export const GROUPS = ['Todos', 'Pecho', 'Espalda', 'Hombro', 'Brazos', 'Pierna', 'Artes marciales'];

export const COACH_ROUTINES = [
  { id: 'A', name: 'Día A · Empuje', ids: ['pb', 'pm', 'fo'], next: true, last: 'lunes' },
  { id: 'B', name: 'Día B · Tirón', ids: ['do', 'rb', 'cb'], last: 'miércoles' },
  { id: 'C', name: 'Día C · Pierna', ids: ['se', 'pr'], last: 'viernes' },
];

export const MY_ROUTINES = [{ id: 'U1', name: 'Saco y hombro', ids: ['sa', 'el'], own: true }];

// Ocupación media por hora, de 7:00 a 23:00 (%)
export const HOURLY = [55, 80, 60, 40, 30, 28, 22, 18, 25, 35, 50, 75, 95, 90, 70, 45, 20];

// Por día de la semana (0 = lunes)
export const SCHEDULE = [
  [['19:30', 'Kick boxing', 'Dani', 6], ['20:45', 'Muay thai', 'Álex', 0]],
  [['19:00', 'Boxeo', 'Álex', 4], ['20:30', 'Kick boxing', 'Dani', 7]],
  [['19:30', 'Muay thai', 'Álex', 3], ['20:45', 'Boxeo', 'Dani', 8]],
  [['19:30', 'Kick boxing', 'Dani', 2], ['20:45', 'Muay thai', 'Álex', 5]],
  [['19:00', 'Boxeo', 'Álex', 9]],
  [['11:00', 'Muay thai', 'Dani', 10]],
];

export const WEIGHTS = [
  ['3 ago', 66.8], ['17 ago', 66.1], ['31 ago', 65.6], ['14 sep', 65.0], ['28 sep', 64.6], ['5 oct', 64.2],
];

export const HISTORY = [
  { wd: 'Lun', d: '5', name: 'Día A · Empuje', meta: '52 min · 3.840 kg · 10 series' },
  { wd: 'Sáb', d: '3', name: 'Muay thai', meta: 'Clase con Dani · 60 min' },
  { wd: 'Vie', d: '2', name: 'Día C · Pierna', meta: '48 min · 4.410 kg · 6 series' },
  { wd: 'Mié', d: '30', name: 'Día B · Tirón', meta: '45 min · 2.120 kg · 9 series' },
];

export const PLANS = {
  gym: { name: 'Gym', fee: 45 },
  combo: { name: 'Gym + artes marciales', fee: 65 },
};
export const FREEZE_FEE = 5;

export const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
