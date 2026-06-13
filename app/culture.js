import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../src/components/ScreenHeader';
import Card from '../src/components/Card';
import { colors, spacing, radius, typography } from '../src/theme';
import { cultureTips } from '../src/data/content';

export default function Culture() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Cultural Context"
          subtitle="Etiquette that earns trust in Japanese business"
          accent={colors.success}
        />

        {cultureTips.map((tip) => (
          <View key={tip.id} style={styles.cardWrap}>
            <Card accent={colors.success}>
              <View style={styles.head}>
                <View style={styles.emojiBadge}>
                  <Text style={styles.emoji}>{tip.emoji}</Text>
                </View>
                <Text style={styles.title}>{tip.title}</Text>
              </View>
              <Text style={styles.body}>{tip.body}</Text>
            </Card>
          </View>
        ))}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  cardWrap: { paddingHorizontal: spacing.xl },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  emojiBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emoji: { fontSize: 22 },
  title: { ...typography.heading, color: colors.textPrimary, flex: 1 },
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
});
