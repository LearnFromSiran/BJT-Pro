import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';

export default function Card({ children, style, accent }) {
  return (
    <View
      style={[
        styles.card,
        accent && { borderLeftColor: accent, borderLeftWidth: 4 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});
