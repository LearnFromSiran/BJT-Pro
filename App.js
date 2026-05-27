import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const features = [
    { id: 1, title: 'Keigo Mastery', desc: 'Learn respectful, humble, and polite Japanese' },
    { id: 2, title: 'BJT Mock Tests', desc: 'Practice for Business Japanese Proficiency Test' },
    { id: 3, title: 'Business Communication', desc: 'Email, phone calls, and meeting templates' },
    { id: 4, title: 'Cultural Context', desc: 'Japanese corporate etiquette and culture' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BJT Pro</Text>
        <Text style={styles.headerSubtitle}>Business Japanese Learning App</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollContent}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to BJT Pro</Text>
          <Text style={styles.welcomeText}>
            Master Business Japanese and prepare for the BJT exam with our comprehensive learning platform.
          </Text>
        </View>

        {/* Features */}
        <Text style={styles.sectionTitle}>Features</Text>
        {features.map((feature) => (
          <TouchableOpacity key={feature.id} style={styles.featureCard}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDesc}>{feature.desc}</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        ))}

        {/* Start Button */}
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Learning</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>BJT Pro - Learn Japanese for Business</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#16213e',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 4,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#8892b0',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  featureCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4ff',
  },
  featureDesc: {
    fontSize: 13,
    color: '#8892b0',
    marginTop: 4,
  },
  arrow: {
    fontSize: 18,
    color: '#00d4ff',
    marginLeft: 12,
  },
  startButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#16213e',
  },
  footerText: {
    fontSize: 12,
    color: '#4a5568',
  },
});
