import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

export interface AuthScreenProps {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/** Full-screen shell for auth-flow screens (login, reset password, invitations, …):
 * theme-aware background, keyboard-avoiding, scrollable, centered content. */
export const AuthScreen: React.FC<AuthScreenProps> = ({ children, contentContainerStyle }) => {
  const { palette } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 28 },
});
