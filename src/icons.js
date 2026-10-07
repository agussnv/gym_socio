import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { C } from './theme';

const P = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  dumbbell: 'M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  check: 'M5 12.5 10 17 19 7',
  plus: 'M12 5v14M5 12h14',
  back: 'M15 5 8 12l7 7',
  close: 'M6 6l12 12M18 6 6 18',
  play: 'M8 5v14l11-7z',
  note: 'M5 4h14v12l-4 4H5zM15 20v-4h4',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6',
  flame: 'M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 2 2 3 2-1-2-.5-5 0-7z',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9',
  chevron: 'M9 5l7 7-7 7',
  clock: 'M12 7v5l3 2',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0',
};

export default function Icon({ name, size = 22, color = C.text, stroke = 1.8 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === 'clock' && <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={stroke} />}
      <Path d={P[name]} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill={name === 'play' ? color : 'none'} />
    </Svg>
  );
}
