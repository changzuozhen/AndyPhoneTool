import { Tabs } from 'expo-router';

import { AppTheme } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        sceneStyle: { backgroundColor: AppTheme.background },
      }}>
      <Tabs.Screen name="index" options={{ title: '工具' }} />
    </Tabs>
  );
}
