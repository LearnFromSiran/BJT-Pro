import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography, shadow } from '../src/theme';
import { homeModules } from '../src/data/content';

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>BJT Pro</Text>
            <Text style={styles.tagline}>Master Business Japanese 🇯🇵</Text>
          </View>
          <View style={styles.logoBadge}>
            <Text style={styles.logoKanji}>商</Text>
          </View>
        </View>

        {/* Progress / hero */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>YOUR PATH TO BJT</Text>
          <Text style={styles.heroTitle}>
            Speak with confidence in the Japanese workplace
          </Text>
          <View style={styles.statsRow}>
            <Stat value="3" label="Keigo forms" />
            <Stat value="6+" label="Mock questions" />
            <Stat value="5" label="Templates" />
          </View>
          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.85}
            onPress={() => router.push('/mock-test')}
          >
            <Text style={styles.ctaText}>Start a Mock Test</Text>
          </TouchableOpacity>
        </View>

        {/* Modules */}
        <Text style={styles.sectionTitle}>Learning Modules</Text>
        {homeModules.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.module}
            activeOpacity={0.85}
            onPress={() => router.push(m.route)}
          >
            <View style={[styles.moduleIcon, { backgroundColor: m.accent + '22' }]}>
              <Text style={styles.moduleEmoji}>{m.emoji}</Text>
            </View>
            <View style={styles.moduleBody}>
              <Text style={styles.moduleTitle}>{m.title}</Text>
              <Text style={styles.moduleSubtitle}>{m.subtitle}</Text>
            </View>
            <Text style={[styles.chevron, { color: m.accent }]}>›</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.footer}>BJT Pro · Learn Japanese for Business</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brand: { ...typography.display, color: colors.textPrimary },
  tagline: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  logoKanji: { color: '#fff', fontSize: 26, fontWeight: '800' },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadow.card,
  },
  heroLabel: { ...typography.label, color: colors.primary },
  heroTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    lineHeight: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { ...typography.title, color: colors.accent },
  statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', ...typography.bodyStrong, fontSize: 16 },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  module: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  moduleEmoji: { fontSize: 24 },
  moduleBody: { flex: 1 },
  moduleTitle: { ...typography.bodyStrong, color: colors.textPrimary, fontSize: 16 },
  moduleSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  chevron: { fontSize: 28, fontWeight: '300' },
  footer: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
