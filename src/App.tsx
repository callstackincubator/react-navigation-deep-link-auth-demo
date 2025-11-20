import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createURL } from 'expo-linking';
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

export function App() {
  return (
    <Navigation
      linking={{
        enabled: 'auto',
        prefixes: [createURL('/')],
      }}
    />
  );
}

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
