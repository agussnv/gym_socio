import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, TextInput } from 'react-native';
import Animated, { FadeInDown, FadeIn, LinearTransition, useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { useStore } from '../store';
import { T, Card, Label, Tap, Button, Avatar, st } from '../ui';
import Icon from '../icons';
import { C, F } from '../theme';
import { WEIGHTS, HISTORY, PLANS, FREEZE_FEE, MONTHS } from '../data';

const dec = (n) => String(n).replace('.', ',');

function WeightChart({ data }) {
  const [w, setW] = useState(0);
  const H = 110;
  const vals = data.map((d) => d[1]);
  const min = Math.min(...vals) - 0.4, max = Math.max(...vals) + 0.4;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * (w - 16) + 8, H - 8 - ((d[1] - min) / (max - min)) * (H - 16)]);
  const reveal = useSharedValue(0);
  useEffect(() => { if (w) { reveal.value = 0; reveal.value = withDelay(200, withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) })); } }, [w, data.length]);
  const a = useAnimatedStyle(() => ({ width: `${reveal.value * 100}%` }));
  return (
    <View style={{ height: H, marginTop: 14 }} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Animated.View style={[{ height: H, overflow: 'hidden' }, a]}>
          <Svg width={w} height={H}>
            {[0.25, 0.5, 0.75].map((f) => <Line key={f} x1={0} x2={w} y1={H * f} y2={H * f} stroke={C.line} strokeWidth={1} />)}
            <Polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.lime} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? C.lime : C.bg} stroke={C.lime} strokeWidth={2} />)}
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}

function Freeze() {
  const { s, set } = useStore();
  const now = new Date();
  const fee = PLANS[s.plan].fee;
  const offset = now.getDate() > 25 ? 2 : 1;
  const fm = MONTHS[(now.getMonth() + offset) % 12];
  const curM = MONTHS[(now.getMonth() + offset - 1) % 12];
  const deadline = `25 de ${curM}`;
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  const Row = ({ k, v, hi }) => (
    <View style={[st.row, { justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line }]}>
      <T f="med" size={14}>{k}</T><T size={14} color={hi ? C.lime : C.mute}>{v}</T>
    </View>
  );
  return (
    <Animated.View layout={LinearTransition.springify()}>
      <Card style={{ marginTop: 12 }} border={s.freeze !== 'none' ? C.line2 : C.line}>
        <View style={[st.row, { gap: 8 }]}>
          <Icon name="snow" size={18} color={s.freeze === 'none' ? C.mute : C.lime} />
          <T f="dmed" size={17}>Congelar cuota</T>
          {s.freeze !== 'none' && <View style={styles.tag}><T f="bold" size={11} color={C.bg}>{s.freeze === 'frozen' ? 'CONGELADA' : 'PROGRAMADA'}</T></View>}
        </View>
        <Animated.View key={s.freeze} entering={FadeIn.duration(300)}>
          {s.freeze === 'none' && (
            <>
              <View style={{ marginTop: 8 }}>
                <Row k={cap(curM)} v={`Se cobra normal · ${fee} €`} />
                <Row k={`Desde ${fm}`} v={`${FREEZE_FEE} €/mes`} hi />
              </View>
              <T size={13} color={C.mute} style={{ marginTop: 12, lineHeight: 19 }}>La congelación empieza el mes siguiente. Puedes pedirla hasta el {deadline}; después, {fm} ya se cobra.</T>
              <Button title={`Congelar desde el 1 de ${fm}`} style={{ marginTop: 14 }} feedback="success" onPress={() => set({ freeze: 'scheduled' })} />
            </>
          )}
          {s.freeze === 'scheduled' && (
            <>
              <View style={{ marginTop: 8 }}>
                <Row k={cap(curM)} v={`Activa · ${fee} €`} />
                <Row k={`Desde el 1 de ${fm}`} v={`Congelada · ${FREEZE_FEE} €/mes`} hi />
              </View>
              <T size={13} color={C.mute} style={{ marginTop: 12, lineHeight: 19 }}>Hasta entonces sigues entrenando con normalidad. Si cambias de idea, cancélala sin coste.</T>
              <Button title="Cancelar congelación" kind="ghost" style={{ marginTop: 14 }} onPress={() => set({ freeze: 'none' })} />
              <Tap onPress={() => set({ freeze: 'frozen', tab: 'acceso' })} style={{ marginTop: 12, alignItems: 'center' }}>
                <T f="med" size={13} color={C.lime}>Ver cómo se verá en {fm}</T>
              </Tap>
            </>
          )}
          {s.freeze === 'frozen' && (
            <>
              <View style={{ marginTop: 8 }}>
                <Row k={cap(fm)} v={`Congelada · ${FREEZE_FEE} € pagados`} />
                <Row k="Si descongelas hoy" v={`${fee - FREEZE_FEE} € (${fee} − ${FREEZE_FEE})`} hi />
              </View>
              <T size={13} color={C.mute} style={{ marginTop: 12, lineHeight: 19 }}>Puedes descongelar cuando quieras. El acceso QR se activa al momento.</T>
              <Button title="Descongelar ahora" style={{ marginTop: 14 }} feedback="success" onPress={() => set({ freeze: 'none' })} />
            </>
          )}
        </Animated.View>
      </Card>
    </Animated.View>
  );
}

export default function Profile() {
  const { s, set } = useStore();
  const weights = s.weights || WEIGHTS;
  const [adding, setAdding] = useState(false);
  const [val, setVal] = useState('');
  const last = weights[weights.length - 1][1];
  const delta = last - weights[0][1];
  const saveW = () => {
    const v = parseFloat(val.replace(',', '.'));
    if (!v) return;
    set({ weights: [...weights, ['hoy', v]] });
    setAdding(false); setVal('');
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeInDown.duration(400)} style={[st.row, { gap: 14 }]}>
        <Avatar ini="MG" size={64} bg={C.lime} color={C.bg} />
        <View style={{ flex: 1 }}>
          <T f="display" size={24}>Marta García</T>
          <T size={13} color={C.mute} style={{ marginTop: 2 }}>Socia desde marzo 2025 · Objetivo: ganar fuerza</T>
        </View>
      </Animated.View>

      <View style={[st.row, { gap: 10, marginTop: 20 }]}>
        {[[String(s.visits), 'visitas\neste mes'], ['6', 'semanas\nseguidas'], [String(s.workouts), 'entrenos\nhechos']].map(([v, k], i) => (
          <Animated.View key={k} entering={FadeInDown.delay(80 + i * 60)} style={{ flex: 1 }}>
            <Card style={{ padding: 14 }}>
              <Animated.View key={v} entering={FadeIn}><T f="display" size={26}>{v}</T></Animated.View>
              <T size={12} color={C.mute} style={{ marginTop: 2, lineHeight: 16 }}>{k}</T>
            </Card>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInDown.delay(260)}>
        <Card style={{ marginTop: 14 }}>
          <View style={[st.row, { justifyContent: 'space-between' }]}>
            <Label>Tu progreso · peso</Label>
            <T f="med" size={13} color={C.lime}>{delta <= 0 ? '−' : '+'}{dec(Math.abs(delta).toFixed(1))} kg</T>
          </View>
          <T f="display" size={34} style={{ marginTop: 8 }}>{dec(last)} kg</T>
          <WeightChart data={weights} />
          <View style={[st.row, { justifyContent: 'space-between', marginTop: 6 }]}>
            <T size={11} color={C.dim}>{weights[0][0]}</T><T size={11} color={C.dim}>{weights[weights.length - 1][0]}</T>
          </View>
          {adding ? (
            <Animated.View entering={FadeIn} style={[st.row, { gap: 10, marginTop: 14 }]}>
              <TextInput autoFocus keyboardType="decimal-pad" placeholder="64,0" placeholderTextColor={C.dim} value={val} onChangeText={setVal} style={styles.input} />
              <T color={C.mute}>kg</T>
              <Button title="Guardar" style={{ height: 46, flex: 1 }} feedback="success" onPress={saveW} />
            </Animated.View>
          ) : (
            <Button title="+ Añadir pesaje" kind="ghost" style={{ marginTop: 14, height: 46 }} onPress={() => setAdding(true)} />
          )}
        </Card>
      </Animated.View>

      <Label style={{ marginTop: 26 }}>Últimos entrenamientos</Label>
      {HISTORY.map((h, i) => (
        <Animated.View key={i} entering={FadeInDown.delay(320 + i * 60)} style={styles.hist}>
          <View style={styles.date}><T size={11} color={C.mute}>{h.wd}</T><T f="display" size={18}>{h.d}</T></View>
          <View style={{ flex: 1 }}>
            <T f="med" size={15}>{h.name}</T>
            <T size={12} color={C.mute} style={{ marginTop: 2 }}>{h.meta}</T>
          </View>
          <Icon name="chevron" size={16} color={C.dim} />
        </Animated.View>
      ))}

      <Label style={{ marginTop: 26 }}>Mi cuota</Label>
      <Card style={{ marginTop: 12 }}>
        <View style={[st.row, { justifyContent: 'space-between' }]}>
          <View>
            <T f="dmed" size={17}>{PLANS[s.plan].name}</T>
            <T size={13} color={s.freeze === 'frozen' ? C.orange : C.lime} style={{ marginTop: 3 }}>{s.freeze === 'frozen' ? 'Congelada' : 'Activa · domiciliación'}</T>
          </View>
          <T f="display" size={22}>{s.freeze === 'frozen' ? FREEZE_FEE : PLANS[s.plan].fee} €<T size={13} color={C.mute}>/mes</T></T>
        </View>
        <Tap onPress={() => set({ plan: s.plan === 'combo' ? 'gym' : 'combo' })} style={{ marginTop: 14 }}>
          <T f="med" size={13} color={C.lime}>{s.plan === 'combo' ? 'Cambiar a solo Gym · 45 €' : 'Añadir artes marciales · 65 €'}</T>
        </Tap>
      </Card>
      <Freeze />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tag: { backgroundColor: C.lime, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, marginLeft: 'auto' },
  hist: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line },
  date: { width: 46, height: 50, borderRadius: 12, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  input: { width: 90, height: 46, borderRadius: 12, backgroundColor: C.card2, color: C.text, paddingHorizontal: 12, fontFamily: F.display, fontSize: 18, outlineStyle: 'none' },
});
