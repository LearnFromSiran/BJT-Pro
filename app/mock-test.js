import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../src/components/ScreenHeader';
import { colors, spacing, radius, typography, shadow } from '../src/theme';
import { mockQuestions } from '../src/data/content';

export default function MockTest() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = mockQuestions[index];
  const isLast = index === mockQuestions.length - 1;

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((n) => n + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / mockQuestions.length) * 100);
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title="Result" accent={colors.accent} />
        <View style={styles.resultWrap}>
          <View style={styles.scoreRing}>
            <Text style={styles.scorePct}>{pct}%</Text>
            <Text style={styles.scoreSub}>
              {score} / {mockQuestions.length}
            </Text>
          </View>
          <Text style={styles.resultMsg}>
            {pct >= 80
              ? 'お見事です！ Excellent business Japanese.'
              : pct >= 50
              ? 'いい調子です！ Keep practicing.'
              : 'がんばりましょう！ Review the lessons and retry.'}
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={restart} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="BJT Mock Test" accent={colors.accent} />

        {/* Progress */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${((index + 1) / mockQuestions.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Question {index + 1} of {mockQuestions.length}
          </Text>
        </View>

        <View style={styles.sectionTag}>
          <Text style={styles.sectionTagText}>{q.section}</Text>
        </View>

        <Text style={styles.question}>{q.question}</Text>

        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isChosen = i === selected;
          let state = 'idle';
          if (selected !== null) {
            if (isCorrect) state = 'correct';
            else if (isChosen) state = 'wrong';
          }
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                state === 'correct' && styles.optionCorrect,
                state === 'wrong' && styles.optionWrong,
              ]}
              onPress={() => choose(i)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.optionText,
                  (state === 'correct' || state === 'wrong') && { color: '#fff' },
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}

        {selected !== null && (
          <View style={styles.explainBox}>
            <Text style={styles.explainLabel}>
              {selected === q.answer ? '正解 Correct' : '不正解 Incorrect'}
            </Text>
            <Text style={styles.explainText}>{q.explain}</Text>
          </View>
        )}

        {selected !== null && (
          <TouchableOpacity style={styles.primaryBtn} onPress={next} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>{isLast ? 'See Result' : 'Next Question'}</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  progressWrap: { marginBottom: spacing.xl },
  progressTrack: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: radius.pill, backgroundColor: colors.accent },
  progressText: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  sectionTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  sectionTagText: { ...typography.label, color: colors.accent },
  question: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    lineHeight: 30,
  },
  option: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionCorrect: { backgroundColor: colors.success, borderColor: colors.success },
  optionWrong: { backgroundColor: colors.danger, borderColor: colors.danger },
  optionText: { ...typography.body, color: colors.textPrimary, fontSize: 16 },
  explainBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  explainLabel: { ...typography.bodyStrong, color: colors.gold, marginBottom: spacing.xs },
  explainText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadow.card,
  },
  primaryBtnText: { color: '#fff', ...typography.bodyStrong, fontSize: 16 },
  // result
  resultWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  scoreRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 10,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  scorePct: { fontSize: 48, fontWeight: '800', color: colors.textPrimary },
  scoreSub: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  resultMsg: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
});
