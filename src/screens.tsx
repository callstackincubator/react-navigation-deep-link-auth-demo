import { Button, Text, View, StyleSheet } from 'react-native';
import { create } from 'zustand';

export const useAuth = create<{
  authenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}>((set) => ({
  authenticated: false,
  signIn: () => set({ authenticated: true }),
  signOut: () => set({ authenticated: false }),
}));

export function Home() {
  const signOut = useAuth((state) => state.signOut);

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

export function Profile() {
  const signOut = useAuth((state) => state.signOut);

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

export function SignIn() {
  const signIn = useAuth((state) => state.signIn);

  return (
    <View style={styles.container}>
      <Text>Sign In Screen</Text>
      <Button title="Sign In" onPress={signIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
