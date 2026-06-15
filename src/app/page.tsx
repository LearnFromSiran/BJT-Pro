'use client';

import { useEffect, useState } from 'react';
import type { AnalysisResult, UiLang, UploadedPage } from '@/lib/types';
import { tr } from '@/lib/i18n';
import { saveResult } from '@/lib/historyStore';
import Header from '@/components/Header';
import WelcomeUpload from '@/components/WelcomeUpload';
import ReviewScreen from '@/components/ReviewScreen';
import ProcessingScreen from '@/components/ProcessingScreen';
import ResultScreen from '@/components/ResultScreen';
import ReplyScreen from '@/components/ReplyScreen';
import HistoryScreen from '@/components/HistoryScreen';
import HumanReviewScreen from '@/components/HumanReviewScreen';

type Screen = 'welcome' | 'review' | 'processing' | 'result' | 'reply' | 'history' | 'human';

export default function Page() {
  const [lang, setLang] = useState<UiLang>('ne');
  const [screen, setScreen] = useState<Screen>('welcome');
  const [pages, setPages] = useState<UploadedPage[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('bjtpro.lang')) as UiLang | null;
    if (saved) setLang(saved);
    fetch('/api/config')
      .then((r) => r.json())
      .then((c) => setDemoMode(!!c.demoMode))
      .catch(() => {});
  }, []);

  function changeLang(l: UiLang) {
    setLang(l);
    try {
      localStorage.setItem('bjtpro.lang', l);
    } catch {
      /* ignore */
    }
  }

  async function runAnalyze(body: object) {
    setScreen('processing');
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'failed');
      setResult(data as AnalysisResult);
      saveResult(data as AnalysisResult);
      setScreen('result');
    } catch (e: any) {
      setError(e?.message || tr('error', lang));
      setScreen('welcome');
    }
  }

  function reset() {
    setPages([]);
    setResult(null);
    setScreen('welcome');
  }

  return (
    <>
      <Header
        lang={lang}
        onLang={changeLang}
        onHistory={() => setScreen('history')}
        showHistory={screen === 'welcome' || screen === 'result'}
      />

      {error && (
        <div className="mx-4 mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {screen === 'welcome' && (
        <WelcomeUpload
          lang={lang}
          demoMode={demoMode}
          onPages={(p) => {
            setPages(p);
            setScreen('review');
          }}
          onSample={(id) => runAnalyze({ sampleId: id })}
        />
      )}

      {screen === 'review' && (
        <ReviewScreen
          lang={lang}
          pages={pages}
          onChange={setPages}
          onBack={() => setScreen('welcome')}
          onAnalyze={() => runAnalyze({ pages })}
        />
      )}

      {screen === 'processing' && <ProcessingScreen lang={lang} />}

      {screen === 'result' && result && (
        <ResultScreen
          lang={lang}
          result={result}
          onReply={() => setScreen('reply')}
          onHumanReview={() => setScreen('human')}
          onNew={reset}
        />
      )}

      {screen === 'reply' && result && (
        <ReplyScreen lang={lang} result={result} onBack={() => setScreen('result')} />
      )}

      {screen === 'human' && result && (
        <HumanReviewScreen lang={lang} result={result} onBack={() => setScreen('result')} />
      )}

      {screen === 'history' && (
        <HistoryScreen
          lang={lang}
          onOpen={(r) => {
            setResult(r);
            setScreen('result');
          }}
          onBack={() => setScreen('welcome')}
        />
      )}
    </>
  );
}
