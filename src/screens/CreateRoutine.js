import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, TextInput } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn, LinearTransition } from 'react-native-reanimated';
import { useStore } from '../store';
import { T, Tap, Avatar, Chip, Button, Label, st } from '../ui';
import Icon from '../icons';
import { C, F } from '../theme';
import { EX, EX_ORDER, GROUPS } from '../data';

export default function CreateRoutine() {
  const { set } = useStore();
  const [filter, setFilter] = useState('Todos');
  const [picked, setPicked] = useState([]);
  const [name, setName] = useState('');
  const list = EX_ORDER.filter((id) => filter === 'Todos' || EX[id].group === filter);
  const canSave = picked.length > 0 && name.trim().length > 0;
  const save = () => {
    if (!canSave) return;
    set((p) => ({ creating: false, tab: 'entrenar', myRoutines: [...p.myRoutines, { id: 'U' + Date.now(), name: name.trim(), ids: picked, own: true }] }));
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.head}>
        <Tap onPress={() => set({ creating: false })} style={styles.icoBtn} accessibilityLabel="Volver"><Icon name="back" size={20} /></Tap>
        <T f="dmed" size={16}>Nueva rutina</T>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        <TextInput placeholder="Nombre de la rutina" placeholderTextColor={C.dim} value={name} onChangeText={setName} style={styles.name} />
        <View style={[st.row, { justifyContent: 'space-between', marginTop: 22 }]}>
          <Label>Elige ejercicios</Label>
          <Animated.View key={picked.length} entering={FadeIn}><T f="med" size={13} color={C.lime}>{picked.length} elegidos</T></Animated.View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12, marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          {GROUPS.map((g) => <Chip key={g} title={g} active={g === filter} onPress={() => setFilter(g)} />)}
        </ScrollView>
        {list.map((id, i) => {
          const idx = picked.indexOf(id);
          const on = idx >= 0;
          return (
            <Animated.View key={id} entering={FadeInDown.delay(i * 40)} layout={LinearTransition}>
              <Tap feedback="select" scale={0.98} onPress={() => setPicked(on ? picked.filter((x) => x !== id) : [...picked, id])}
                style={[styles.item, on && { borderColor: C.limeLine, backgroundColor: C.limeSoft }]}>
                <Avatar ini={EX[id].ini} size={42} />
                <View style={{ flex: 1 }}>
                  <T f="med" size={15}>{EX[id].name}</T>
                  <T size={12} color={C.mute} style={{ marginTop: 2 }}>{EX[id].muscle}</T>
                </View>
                <View style={[styles.ord, on && { backgroundColor: C.lime, borderColor: C.lime }]}>
                  {on && <Animated.View entering={ZoomIn.springify()}><T f="bold" size={13} color={C.bg}>{idx + 1}</T></Animated.View>}
                </View>
              </Tap>
            </Animated.View>
          );
        })}
      </ScrollView>
      <View style={styles.foot}>
        <T size={12} color={C.dim} style={{ textAlign: 'center', marginBottom: 10 }}>
          {canSave ? 'Podrás ajustar descansos y series en tu rutina' : 'Ponle nombre y elige al menos un ejercicio'}
        </T>
        <Button title="Guardar rutina" disabled={!canSave} onPress={save} feedback="success" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60 },
  icoBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card },
  name: { fontFamily: F.display, fontSize: 26, color: C.text, borderBottomWidth: 1, borderBottomColor: C.line2, paddingVertical: 10, outlineStyle: 'none' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10, padding: 12, borderRadius: 18, borderWidth: 1, borderColor: C.line, backgroundColor: C.card },
  ord: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: C.line2, alignItems: 'center', justifyContent: 'center' },
  foot: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20, paddingBottom: 30, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.line },
});
