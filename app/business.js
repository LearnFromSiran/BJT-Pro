import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../src/components/ScreenHeader';
import Card from '../src/components/Card';
import { colors, spacing, radius, typography } from '../src/theme';
import { businessTemplates } from '../src/data/content';

const categories = ['All', 'Email', 'Phone', 'Meeting'];

export default function Business() {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const items =
    filter === 'All'
      ? businessTemplates
      : businessTemplates.filter((t) => t.category === filter);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Business Communication"
          subtitle="Ready-to-use templates for the workplace"
          accent={colors.gold}
        />

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {categories.map((c) => {
            const active = c === filter;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setFilter(c)}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {items.map((t) => {
          const open = expanded === t.id;
          return (
            <View key={t.id} style={styles.cardWrap}>
              <Card accent={colors.gold}>
                <TouchableOpacity
                  onPress={() => setExpanded(open ? null : t.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardHead}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.category}>{t.category.toUpperCase()}</Text>
                      <Text style={styles.title}>{t.title}</Text>
                    </View>
                    <Text style={styles.toggle}>{open ? '−' : '+'}</Text>
                  </View>
                  <Text style={styles.japanese}>{t.japanese}</Text>
                  {open && (
                    <View style={styles.translation}>
                      <Text style={styles.translationLabel}>ENGLISH</Text>
                      <Text style={styles.english}>{t.english}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Card>
            </View>
          );
        })}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  filters: { paddingHorizontal: spacing.xl, gap: spacing.sm, marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText: { ...typography.bodyStrong, color: colors.textSecondary, fontSize: 14 },
  chipTextActive: { color: colors.background },
  cardWrap: { paddingHorizontal: spacing.xl },
  cardHead: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  category: { ...typography.label, color: colors.gold },
  title: { ...typography.heading, color: colors.textPrimary, marginTop: 2 },
  toggle: { fontSize: 26, color: colors.textSecondary, marginLeft: spacing.md, lineHeight: 26 },
  japanese: { ...typography.body, color: colors.textPrimary, lineHeight: 26, fontSize: 16 },
  translation: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  translationLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.xs },
  english: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
});
