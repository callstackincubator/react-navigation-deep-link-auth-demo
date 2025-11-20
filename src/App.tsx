import {
  createPathConfigForStaticNavigation,
  createStaticNavigation,
  getActionFromState,
  getStateFromPath,
  StaticParamList,
  useNavigationContainerRef,
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
          options: {
            animationTypeForReplace: 'pop',
          },
        },
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

const linking = {
  enabled: 'auto' as const,
  prefixes: [createURL('/')],
};

// Get the deep link configuration for our screens
// This is used by React Navigation to parse the incoming URLs internally
// But since we are handling deep links manually, we need this for parsing
const linkingPathConfig = createPathConfigForStaticNavigation(
  RootStack,
  // Pass `linking.options` if present
  undefined,
  true,
);

export function App() {
  const ref = useNavigationContainerRef();
  const authenticated = useAuth((state) => state.authenticated);

  const lastDeepLink = useLastDeepLink();

  // Handle the stored deep link after logging in
  useEffect(() => {
    const handleDeepLink = async () => {
      const url =
        typeof lastDeepLink === 'string' ? lastDeepLink : await lastDeepLink;

      if (ref.isReady() && url && linkingPathConfig) {
        // Strip the prefix from the URL
        const path = linking.prefixes.reduce((acc, prefix) => {
          if (acc.startsWith(prefix)) {
            return acc.slice(prefix.length);
          }

          return acc;
        }, url);

        // Get the navigation state from the path
        const state = getStateFromPath(path, { screens: linkingPathConfig });

        // If we have a valid state, get the action and dispatch it
        // This will navigate to the intended screen
        if (state) {
          const action = getActionFromState(state);

          ref.dispatch(action!);
        }
      }
    };

    if (authenticated && lastDeepLink) {
      handleDeepLink();
    }
  }, [authenticated, ref]);

  return <Navigation ref={ref} linking={linking} />;
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
