import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../src/components/ScreenHeader';
import Card from '../src/components/Card';
import { colors, spacing, radius, typography } from '../src/theme';
import { keigoLessons } from '../src/data/content';

export default function Keigo() {
  const [active, setActive] = useState(keigoLessons[0].id);
  const lesson = keigoLessons.find((l) => l.id === active);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Keigo Mastery"
          subtitle="The three registers of Japanese politeness"
        />

        {/* Tabs */}
        <View style={styles.tabs}>
          {keigoLessons.map((l) => {
            const selected = l.id === active;
            return (
              <TouchableOpacity
                key={l.id}
                onPress={() => setActive(l.id)}
                style={[
                  styles.tab,
                  selected && { backgroundColor: l.color },
                ]}
                activeOpacity={0.85}
              >
                <Text style={[styles.tabText, selected && styles.tabTextActive]}>
                  {l.title.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Card accent={lesson.color}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
          <Text style={styles.lessonIntro}>{lesson.intro}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Common Conversions</Text>
        {lesson.items.map((item, i) => (
          <Card key={i} style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.plain}>{item.plain}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.keigo, { color: lesson.color }]}>{item.keigo}</Text>
              <Text style={styles.romaji}>{item.romaji}</Text>
            </View>
          </Card>
        ))}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabText: { ...typography.bodyStrong, color: colors.textSecondary, fontSize: 14 },
  tabTextActive: { color: '#fff' },
  lessonTitle: { ...typography.heading, color: colors.textPrimary },
  lessonSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  lessonIntro: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  row: {
    marginHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: { flex: 1, paddingRight: spacing.md },
  rowRight: { alignItems: 'flex-end' },
  plain: { ...typography.body, color: colors.textSecondary },
  keigo: { ...typography.heading, fontSize: 18 },
  romaji: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});
