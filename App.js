import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk/500Medium';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk/700Bold';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import Animated, { Easing, FadeIn, FadeOut, SlideInDown, SlideOutDown, SlideInRight, SlideOutRight } from 'react-native-reanimated';

import { C } from './src/theme';
import { Store } from './src/store';
import { CAPACITY, MY_ROUTINES } from './src/data';
import TabBar from './src/TabBar';
import Home from './src/screens/Home';
import Train from './src/screens/Train';
import Classes from './src/screens/Classes';
import Access from './src/screens/Access';
import Profile from './src/screens/Profile';
import Workout from './src/screens/Workout';
import Summary from './src/screens/Summary';
import CreateRoutine from './src/screens/CreateRoutine';
import ExerciseSheet from './src/screens/ExerciseSheet';

function Root() {
  const insets = useSafeAreaInsets();
  const [s, setS] = useState({
    tab: 'inicio', people: 18, booked: {}, myRoutines: MY_ROUTINES,
    workout: null, summary: null, creating: false, detail: null,
    freeze: 'none', plan: 'combo', workouts: 32, visits: 11, weights: null,
  });
  const set = (patch) => setS((p) => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) }));

  // Aforo en directo: cambia cada pocos segundos
  useEffect(() => {
    const iv = setInterval(() => {
      set((p) => ({ people: Math.max(8, Math.min(CAPACITY - 4, p.people + (Math.random() < 0.5 ? -1 : 1))) }));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const store = useMemo(() => ({ s, set }), [s]);
  const Screen = { inicio: Home, entrenar: Train, clases: Classes, acceso: Access, perfil: Profile }[s.tab];

  return (
    <Store.Provider value={store}>
      <View style={[styles.app, { paddingTop: insets.top }]}>
        <Animated.View key={s.tab} entering={FadeIn.duration(140)} style={{ flex: 1 }}>
          <Screen />
        </Animated.View>
        <TabBar />

        {s.creating && (
          <Animated.View entering={SlideInRight.duration(260).easing(Easing.bezier(0.2, 0.8, 0.2, 1))} exiting={SlideOutRight.duration(220)} style={[StyleSheet.absoluteFill, styles.overlay, { paddingTop: insets.top }]}>
            <CreateRoutine />
          </Animated.View>
        )}
        {s.workout && (
          <Animated.View entering={SlideInDown.duration(260).easing(Easing.bezier(0.2, 0.8, 0.2, 1))} exiting={SlideOutDown.duration(260)} style={[StyleSheet.absoluteFill, styles.overlay, { paddingTop: insets.top }]}>
            <Workout />
          </Animated.View>
        )}
        {s.summary && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)} style={[StyleSheet.absoluteFill, styles.overlay, { paddingTop: insets.top }]}>
            <Summary />
          </Animated.View>
        )}
        {s.detail && <ExerciseSheet />}
      </View>
    </Store.Provider>
  );
}

export default function App() {
  const [loaded] = useFonts({ SpaceGrotesk_500Medium, SpaceGrotesk_700Bold, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold });
  if (!loaded) return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.outer}>
        <Root />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: C.bg, alignItems: 'center' },
  app: { flex: 1, width: '100%', maxWidth: Platform.OS === 'web' ? 480 : undefined, backgroundColor: C.bg, overflow: 'hidden' },
  overlay: { backgroundColor: C.bg, zIndex: 10 },
});
