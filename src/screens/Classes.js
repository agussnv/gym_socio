import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeIn, LinearTransition } from 'react-native-reanimated';
import { useStore } from '../store';
import { T, Card, Button, Tap, st } from '../ui';
import { C } from '../theme';
import { SCHEDULE } from '../data';

const WD = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function week() {
  const d = new Date();
  const dow = (d.getDay() + 6) % 7;
  const mon = new Date(d); mon.setDate(d.getDate() - dow);
  return WD.map((name, i) => { const x = new Date(mon); x.setDate(mon.getDate() + i); return { name, num: x.getDate() }; });
}

export default function Classes() {
  const { s, set } = useStore();
  const todayIdx = Math.min(5, (new Date().getDay() + 6) % 7);
  const [day, setDay] = useState(todayIdx);
  const days = week();
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
      <T f="display" size={30}>Clases</T>
      <T size={14} color={C.mute} style={{ marginTop: 4 }}>Kick boxing, boxeo y muay thai · 12 plazas</T>
      <View style={[st.row, { gap: 8, marginTop: 20 }]}>
        {days.map((d, i) => {
          const on = i === day;
          return (
            <Tap key={i} feedback="select" onPress={() => setDay(i)} style={[styles.day, on && { backgroundColor: C.text, borderColor: C.text }]}>
              <T f="med" size={12} color={on ? C.bg : C.mute}>{d.name}</T>
              <T f="display" size={18} color={on ? C.bg : C.text} style={{ marginTop: 2 }}>{d.num}</T>
            </Tap>
          );
        })}
      </View>

      <Animated.View key={day} entering={FadeIn.duration(200)}>
        {SCHEDULE[day].map(([time, name, coach, free], i) => {
          const key = day + '-' + i;
          const b = !!s.booked[key];
          const full = free === 0;
          const left = b && !full ? free - 1 : free;
          const spots = b ? (full ? 'En lista de espera' : 'Plaza reservada') : (full ? 'Completa' : `${left} de 12 libres`);
          const btn = b ? (full ? 'Salir de la lista' : 'Cancelar reserva') : (full ? 'Lista de espera' : 'Reservar plaza');
          return (
            <Animated.View key={key}>
              <Card style={{ marginTop: 14 }} border={b ? C.limeLine : C.line}>
                <View style={[st.row, { justifyContent: 'space-between' }]}>
                  <T f="display" size={26}>{time}</T>
                  <Animated.View key={spots} entering={FadeIn}>
                    <T f="med" size={13} color={b ? C.lime : full ? C.orange : C.mute}>{spots}</T>
                  </Animated.View>
                </View>
                <T f="dmed" size={18} style={{ marginTop: 6 }}>{name}</T>
                <T size={13} color={C.mute} style={{ marginTop: 2 }}>Con {coach} · 60 min</T>
                <View style={[styles.spots]}>
                  {Array.from({ length: 12 }).map((_, k) => (
                    <View key={k} style={[styles.spot, { backgroundColor: k < 12 - left ? (b && k === 12 - left - 1 && !full ? C.lime : C.line2) : C.line }]} />
                  ))}
                </View>
                <Button title={btn} kind={b ? 'ghost' : 'primary'} style={{ marginTop: 14, height: 46 }} feedback={b ? 'light' : 'success'}
                  onPress={() => set((p) => ({ booked: { ...p.booked, [key]: !b } }))} />
              </Card>
            </Animated.View>
          );
        })}
      </Animated.View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  day: { flex: 1, height: 62, borderRadius: 16, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  spots: { flexDirection: 'row', gap: 4, marginTop: 14 },
  spot: { flex: 1, height: 6, borderRadius: 3 },
});
