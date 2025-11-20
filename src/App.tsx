import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createURL } from 'expo-linking';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { Home, Profile, SignIn, useAuth } from './screens';

const RootStack = createNativeStackNavigator({
  groups: {
    authenticated: {
      if: () => useAuth((state) => state.authenticated),
      screens: {
        Home: {
          screen: Home,
        },
        Profile: {
          screen: Profile,
        },
      },
    },
    unauthenticated: {
      if: () => useAuth((state) => !state.authenticated),
      screens: {
        SignIn: {
          screen: SignIn,
        },
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export function App() {
  const lastDeepLink = useLastDeepLink();
  const authenticated = useAuth((state) => state.authenticated);

  return (
    <Navigation
      // Change key when authentication state changes
      // This forces a remount of the navigator container
      // So it will handle the initial URL again
      key={authenticated ? 'authenticated' : 'unauthenticated'}
      linking={{
        enabled: 'auto',
        prefixes: [createURL('/')],
        // Override initial URL to use the stored deep link
        getInitialURL: () => lastDeepLink,
      }}
    />
  );
}

function useLastDeepLink() {
  const authenticated = useAuth((state) => state.authenticated);

  // Keep track of the incoming deep links to handle after logging in
  const [deepLink, setDeepLink] = useState<
    string | null | Promise<string | null>
  >(() => (authenticated ? null : Linking.getInitialURL()));

  useEffect(() => {
    // Clear initial URL after logging in
    // This prevents handling the same deep link again after logging out and logging back in
    if (authenticated) {
      setDeepLink(null);
    }

    // Store incoming deep links if not authenticated
    // They will be handled after logging in
    const subscription = Linking.addEventListener('url', ({ url }) => {
      if (!authenticated) {
        setDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [authenticated]);

  return deepLink;
}

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
