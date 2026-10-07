import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';
import { useStore } from '../store';
import { T, Card, Button, Grow, st } from '../ui';
import Icon from '../icons';
import { C } from '../theme';
import { GYM, PLANS, FREEZE_FEE } from '../data';

const N = 25;
function matrix(seed) {
  let x = seed * 9301 + 49297;
  const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  const m = [];
  const finder = (r, c) => {
    const inF = (r0, c0) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    const ring = (r0, c0) => { const rr = r - r0, cc = c - c0; return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4); };
    if (inF(0, 0)) return ring(0, 0) ? 1 : 0;
    if (inF(0, N - 7)) return ring(0, N - 7) ? 1 : 0;
    if (inF(N - 7, 0)) return ring(N - 7, 0) ? 1 : 0;
    if ((r === 7 && (c < 8 || c > N - 9)) || (c === 7 && (r < 8 || r > N - 9)) || (r === N - 8 && c < 8) || (c === N - 8 && r < 8)) return 0;
    return -1;
  };
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const f = finder(r, c); if (f === 1 || (f === -1 && rnd() > 0.52)) m.push([r, c]); }
  return m;
}

function Scan() {
  const y = useSharedValue(0);
  useEffect(() => { y.value = withRepeat(withSequence(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }), withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) })), -1); }, []);
  const a = useAnimatedStyle(() => ({ top: `${y.value * 96}%` }));
  return <Animated.View pointerEvents="none" style={[styles.scan, a]} />;
}

export default function Access() {
  const { s, set } = useStore();
  const [t, setT] = useState(0);
  useEffect(() => { const iv = setInterval(() => setT((v) => v + 1), 1000); return () => clearInterval(iv); }, []);
  const period = Math.floor(t / 15);
  const left = 15 - (t % 15);
  const cells = useMemo(() => matrix(period + 7), [period]);
  const frozen = s.freeze === 'frozen';
  const fee = PLANS[s.plan].fee;
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 16 }}>
      <T f="display" size={30}>Acceso</T>
      <T size={14} color={C.mute} style={{ marginTop: 4 }}>Acerca el móvil al lector de la entrada.</T>

      <Card style={{ marginTop: 22, alignItems: 'center', paddingVertical: 26 }}>
        <View style={styles.qrWrap}>
          <Animated.View key={period} entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
            <Svg width={232} height={232} viewBox={`0 0 ${N} ${N}`}>
              {cells.map(([r, c]) => <Rect key={r + '-' + c} x={c} y={r} width={1.02} height={1.02} fill={C.bg} />)}
            </Svg>
          </Animated.View>
          {!frozen && <Scan />}
          {frozen && (
            <Animated.View entering={FadeIn} style={styles.paused}>
              <Icon name="snow" size={34} color={C.text} />
              <T f="bold" size={14} style={{ marginTop: 8, textAlign: 'center' }}>Acceso pausado</T>
            </Animated.View>
          )}
        </View>
        <T f="display" size={17} style={{ marginTop: 18 }}>Marta García · {GYM}</T>
        {!frozen ? (
          <>
            <Grow pct={left / 15} color={C.lime} height={4} style={{ width: 180, marginTop: 14 }} />
            <T size={13} color={C.mute} style={{ marginTop: 8 }}>El código cambia en {left} s</T>
            <T size={12} color={C.dim} style={{ marginTop: 2 }}>Así no se puede compartir con capturas</T>
          </>
        ) : (
          <View style={{ alignSelf: 'stretch', marginTop: 16 }}>
            <T size={13} color={C.mute} style={{ textAlign: 'center', marginBottom: 12 }}>Tu cuota está congelada este mes</T>
            <Button title={`Descongelar ahora · ${fee - FREEZE_FEE} €`} feedback="success" onPress={() => set({ freeze: 'none' })} />
          </View>
        )}
      </Card>

      {!frozen && (
        <View style={[st.row, { gap: 10, marginTop: 14 }]}>
          {[['11', 'visitas este mes'], ['6', 'semanas seguidas']].map(([v, k]) => (
            <Card key={k} style={{ flex: 1 }}>
              <T f="display" size={26} color={C.lime}>{v}</T>
              <T size={13} color={C.mute} style={{ marginTop: 2 }}>{k}</T>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  qrWrap: { width: 260, height: 260, borderRadius: 22, backgroundColor: C.text, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  scan: { position: 'absolute', left: 10, right: 10, height: 3, borderRadius: 2, backgroundColor: C.lime, shadowColor: C.lime, shadowOpacity: 0.9, shadowRadius: 10 },
  paused: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,10,11,0.88)', alignItems: 'center', justifyContent: 'center' },
});
