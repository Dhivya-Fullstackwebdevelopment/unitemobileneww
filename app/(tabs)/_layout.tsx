import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { THEME } from '@/components/Reuse/Reusecolor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabIcon({
  name,
  focused,
  isAI,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  isAI?: boolean;
}) {
  return (
    <View style={styles.iconWrapper}>
      {focused && (
        <View 
          style={[
            styles.activePill, 
            isAI && { backgroundColor: 'rgba(213, 0, 249, 0.1)' } // Custom soft purple background matching theme
          ]} 
        />
      )}
      <Ionicons
        name={name}
        size={22}
        color={focused ? (isAI ? '#D500F9' : THEME.primary) : Colors.tabBarInactive}
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 66 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      {/* ── 1st Menu Item: Home ── */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
          ),
        }}
      />
      
      {/* ── 2nd Menu Item: AI Chat (Shifted up) ── */}
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: 'Chat',
          tabBarActiveTintColor: '#D500F9', 
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'chatbubble' : 'chatbubble-outline'}
              focused={focused}
              isAI
            />
          ),
        }}
      />
      
      {/* ── 3rd Menu Item: Bookings (Shifted up) ── */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              focused={focused}
            />
          ),
        }}
      />

      {/* ── 4th Menu Item: Notifications (Newly Added) ── */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifs',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'notifications' : 'notifications-outline'}
              focused={focused}
            />
          ),
        }}
      />

      {/* ── 5th Menu Item: Profile ── */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 86 : 86,
    paddingBottom: Platform.OS === 'ios' ? 26 : 8,
    paddingTop: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 16,
    borderTopColor: 'transparent',
  },
  tabItem: {
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
    marginTop: 0,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 30,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 36,
    height: 30,
    borderRadius: 10,
    backgroundColor: THEME.light,
  },
});