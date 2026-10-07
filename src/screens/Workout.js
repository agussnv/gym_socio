import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, TextInput } from 'react-native';
import Animated, { Easing, FadeInDown, FadeIn, ZoomIn, SlideInDown, SlideOutDown, LinearTransition, useSharedValue, useAnimatedStyle, withTiming, withSequence, withSpring, interpolateColor } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { T, Tap, Avatar, haptic, st } from '../ui';
import Icon from '../icons';
import { C, F } from '../theme';
import { EX, COACH } from '../data';

export const mmss = (t) => Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
const dec = (n) => String(n).replace('.', ',');

function SetRow({ n, prev, kg, reps, done, pr, onToggle }) {
  const p = useSharedValue(done ? 1 : 0);
  useEffect(() => { p.value = withTiming(done ? 1 : 0, { duration: 180 }); }, [done]);
  const row = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(p.value, [0, 1], ['rgba(198,244,50,0)', 'rgba(198,244,50,0.10)']) }));
  const box = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(p.value, [0, 1], [C.line, C.lime])}));
  const press = () => {
    haptic(done ? 'light' : 'medium');
    onToggle();
  };
  return (
    <Animated.View style={[styles.setRow, row]} entering={FadeIn.duration(150)}>
      <T f="bold" size={14} color={C.sub} style={styles.cN}>{n}</T>
      <T size={13} color={C.dim} style={styles.cPrev}>{prev}</T>
      <View style={styles.cKg}>
        <T f="bold" size={15}>{kg ? dec(kg) : 'PC'}</T>
        {pr && <Animated.View entering={FadeIn.duration(180)} style={styles.pr}><Icon name="trophy" size={11} color={C.bg} stroke={2.2} /></Animated.View>}
      </View>
      <T f="bold" size={15} style={styles.cReps}>{reps}</T>
      <Tap onPress={press} feedback={null} scale={1} style={styles.cChk} accessibilityLabel={`Serie ${n} hecha`}>
        <Animated.View style={[styles.chk, box]}>
          <Icon name="check" size={18} color={done ? C.bg : C.mute} stroke={2.6} />
        </Animated.View>
      </Tap>
    </Animated.View>
  );
}

function RestBar({ left, max, onAdj, onSkip }) {
  const insets = useSafeAreaInsets();
  const w = useSharedValue(left / max);
  useEffect(() => { w.value = withTiming(left / max, { duration: 950 }); }, [left, max]);
  const a = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <Animated.View entering={SlideInDown.duration(260).easing(Easing.bezier(0.2, 0.8, 0.2, 1))} exiting={SlideOutDown.duration(200)} style={[styles.rest, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.restTrack}><Animated.View style={[styles.restFill, a]} /></View>
      <View style={[st.row, { justifyContent: 'space-between', marginTop: 12 }]}>
        <Tap onPress={() => onAdj(-15)} style={styles.restBtn}><T f="bold" size={14}>−15</T></Tap>
        <View style={{ alignItems: 'center' }}>
          <T size={12} color={C.mute}>Descanso</T>
          <T f="display" size={30} color={C.lime}>{mmss(left)}</T>
        </View>
        <Tap onPress={() => onAdj(15)} style={styles.restBtn}><T f="bold" size={14}>+15</T></Tap>
        <Tap onPress={onSkip} style={[styles.restBtn, { backgroundColor: C.lime, borderColor: C.lime }]}><T f="bold" size={14} color={C.bg}>Saltar</T></Tap>
      </View>
    </Animated.View>
  );
}

export default function Workout() {
  const { s, set } = useStore();
  const w = s.workout;
  const r = w.routine;
  const own = !!r.own;
  const [now, setNow] = useState(Date.now());
  const [rest, setRest] = useState({ left: 0, max: 90 });
  useEffect(() => {
    const iv = setInterval(() => {
      setNow(Date.now());
      setRest((p) => {
        if (p.left <= 0) return p;
        if (p.left === 1) haptic('success');
        return { ...p, left: p.left - 1 };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  const elapsed = Math.floor((now - w.start) / 1000);
  const upd = (patch) => set((p) => ({ workout: { ...p.workout, ...patch(p.workout) } }));
  const restOf = (id) => (own && w.restEdit[id]) || (r.rest && r.rest[id]) || EX[id].rest;

  let volume = 0, doneCount = 0, total = 0;
  const prs = [];
  const blocks = r.ids.map((id) => {
    const e = EX[id];
    const base = ((r.sets && r.sets[id]) || e.sets).slice();
    for (let k = 0; k < (w.extra[id] || 0); k++) { const l = base[base.length - 1]; base.push([l[0], l[1], '—']); }
    let exPr = 0;
    const sets = base.map(([kg, reps, prev], i) => {
      const key = id + (i + 1);
      const done = !!w.done[key];
      total += 1;
      const isPr = kg > e.best && kg > 0;
      if (done) { doneCount += 1; volume += kg * reps; if (isPr && kg > exPr) exPr = kg; }
      return { key, n: i + 1, kg, reps, prev, done, pr: done && isPr };
    });
    if (exPr) prs.push({ name: e.name, val: dec(exPr) + ' kg' });
    return { id, e, sets };
  });

  const toggle = (id, key, done) => {
    upd((wk) => ({ done: { ...wk.done, [key]: !done } }));
    if (!done) setRest({ left: restOf(id), max: restOf(id) });
  };
  const finish = () => {
    haptic('success');
    const notes = r.ids.filter((id) => (w.notes[id] || '').trim()).map((id) => ({ name: EX[id].name, text: w.notes[id] }));
    set((p) => ({ workout: null, workouts: p.workouts + 1, summary: { name: r.name, elapsed, volume, doneCount, prs, notes } }));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.head}>
        <Tap onPress={() => set({ workout: null })} style={styles.icoBtn} accessibilityLabel="Salir del entrenamiento">
          <Icon name="close" size={20} />
        </Tap>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <T f="dmed" size={15}>{r.name}</T>
          <T f="display" size={13} color={C.lime} style={{ marginTop: 2 }}>{mmss(elapsed)}</T>
        </View>
        <Tap onPress={finish} style={styles.finish}><T f="bold" size={14} color={C.bg}>Terminar</T></Tap>
      </View>

      <View style={styles.stats}>
        {[['Volumen', `${volume.toLocaleString('es-ES')} kg`], ['Series', `${doneCount} / ${total}`], ['Récords', String(prs.length)]].map(([k, v]) => (
          <View key={k} style={{ flex: 1 }}>
            <T size={12} color={C.mute}>{k}</T>
            <Animated.View key={v} entering={FadeIn.duration(250)}><T f="display" size={17} style={{ marginTop: 2 }}>{v}</T></Animated.View>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {blocks.map(({ id, e, sets }, bi) => (
          <Animated.View key={id} style={styles.block}>
            <Tap onPress={() => set({ detail: { id, own } })} scale={0.98} style={[st.row, { gap: 12, paddingHorizontal: 20 }]}>
              <Avatar ini={e.ini} size={44} bg={C.card2} color={C.lime} />
              <View style={{ flex: 1 }}>
                <T f="dmed" size={17} color={C.lime}>{e.name}</T>
                <T size={12} color={C.dim} style={{ marginTop: 2 }}>Toca para ver cómo se hace</T>
              </View>
              <Icon name="chevron" size={18} color={C.dim} />
            </Tap>

            <View style={styles.noteBox}>
              <Icon name="note" size={16} color={w.notes[id] ? C.lime : C.dim} />
              <TextInput
                placeholder={`Nota para ${COACH}: molestias, sensaciones, dudas…`}
                placeholderTextColor={C.dim}
                value={w.notes[id] || ''}
                onChangeText={(v) => upd((wk) => ({ notes: { ...wk.notes, [id]: v } }))}
                style={styles.note}
              />
            </View>

            <View style={[st.row, { paddingHorizontal: 20, marginTop: 10, gap: 8 }]}>
              <Icon name="clock" size={16} color={C.lime} />
              <T f="med" size={13} color={C.lime}>Descanso {mmss(restOf(id))}</T>
              {own ? (
                <View style={[st.row, { gap: 6, marginLeft: 'auto' }]}>
                  <Tap onPress={() => upd((wk) => ({ restEdit: { ...wk.restEdit, [id]: Math.max(15, restOf(id) - 15) } }))} style={styles.mini}><T f="bold" size={12}>−15</T></Tap>
                  <Tap onPress={() => upd((wk) => ({ restEdit: { ...wk.restEdit, [id]: Math.min(600, restOf(id) + 15) } }))} style={styles.mini}><T f="bold" size={12}>+15</T></Tap>
                </View>
              ) : (
                <View style={[st.row, { gap: 4, marginLeft: 'auto' }]}>
                  <Icon name="lock" size={13} color={C.dim} />
                  <T size={12} color={C.dim}>Fijado por {COACH}</T>
                </View>
              )}
            </View>

            <View style={[styles.setRow, { marginTop: 10, height: 30 }]}>
              {[['Serie', styles.cN], ['Anterior', styles.cPrev], ['kg', styles.cKg], ['Reps', styles.cReps]].map(([h, sty]) => (
                <T key={h} f="med" size={11} color={C.dim} style={[sty, { textTransform: 'uppercase', letterSpacing: 0.8 }]}>{h}</T>
              ))}
              <View style={styles.cChk}><Icon name="check" size={14} color={C.dim} /></View>
            </View>
            {sets.map((x) => <SetRow key={x.key} {...x} onToggle={() => toggle(id, x.key, x.done)} />)}
            {own && (
              <Tap onPress={() => upd((wk) => ({ extra: { ...wk.extra, [id]: (wk.extra[id] || 0) + 1 } }))} style={styles.addSet} scale={0.98}>
                <T f="bold" size={13} color={C.sub} style={{ letterSpacing: 1 }}>+ AGREGAR SERIE</T>
              </Tap>
            )}
          </Animated.View>
        ))}
      </ScrollView>

      {rest.left > 0 && (
        <RestBar left={rest.left} max={rest.max}
          onAdj={(d) => setRest((p) => ({ left: Math.max(1, p.left + d), max: Math.max(p.max, p.left + d) }))}
          onSkip={() => setRest({ left: 0, max: 90 })} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 60, gap: 12 },
  icoBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card },
  finish: { height: 40, paddingHorizontal: 16, borderRadius: 12, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  block: { paddingTop: 22, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: C.line },
  noteBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginTop: 12, paddingHorizontal: 12, borderRadius: 12, backgroundColor: C.card, height: 44 },
  note: { flex: 1, color: C.text, fontFamily: F.body, fontSize: 14, height: 44, outlineStyle: 'none' },
  mini: { height: 30, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: C.line, justifyContent: 'center' },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 50 },
  cN: { width: 44 },
  cPrev: { flex: 1 },
  cKg: { width: 74, flexDirection: 'row', alignItems: 'center', gap: 6 },
  cReps: { width: 50 },
  cChk: { width: 44, alignItems: 'flex-end', justifyContent: 'center', height: 44 },
  chk: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pr: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' },
  addSet: { marginHorizontal: 20, marginTop: 8, height: 42, borderRadius: 12, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  rest: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: C.line2, paddingHorizontal: 20, paddingTop: 14 },
  restTrack: { height: 4, borderRadius: 2, backgroundColor: C.line, overflow: 'hidden' },
  restFill: { height: 4, backgroundColor: C.lime },
  restBtn: { height: 44, minWidth: 60, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
});
