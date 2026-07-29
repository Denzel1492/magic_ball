import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANSWERS = [
  'Совершенно точно', 'Определенно так', 'Все возможно', 'Можно попробовать',
  'Лучше не стоит', 'Не вздумай!', 'Перефразируй', 'Сейчас не время',
  'Забудь об этом', 'Сделай это', 'Ничто не истинно — все дозволено',
  'Лучше синица в руках', 'Даже мне не ведомо всё', 'Пути Господни неисповедимы',
  'Всё так, как должно быть', 'Нет однозначного ответа', 'Конкретизируй',
  'Да...но не сегодня', 'Поезд уже ушёл', 'Ты сможешь',
  'Не по сеньке шапка', 'Назвался груздем — полезай в кузовок',
  'Всё что не делается, всё к лучшему', 'Тебе это не нужно',
  'Беги!', 'Попробуй ещё раз', 'Ты сам знаешь ответ',
  'Оставшись один, спроси у себя',
];

const THINKING_PHRASES = [
  'Откуда вы только берётесь...', 'Это магия...', '.', '...', 'ммм...',
  'хм...', 'Это не просто', 'Сложный вопрос', 'Решаю...',
  'Ага, вроде вот оно...',
];

type AppState = 'INTRO' | 'GREETING' | 'THINKING' | 'ANSWER' | 'FAREWELL';

function MagicBallVisual({ state }: { state: AppState }) {
  const isThinking = state === 'THINKING';
  const isAnswer = state === 'ANSWER';

  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 my-8 mx-auto">
      <motion.div
        className="absolute w-full h-full rounded-full bg-gradient-to-br from-[#1a0b2e] to-[#0a0410] border border-purple-900/30 overflow-hidden"
        animate={{
          boxShadow: isThinking
            ? ['0 0 40px rgba(124,58,237,0.4)', '0 0 100px rgba(45,212,191,0.6)', '0 0 40px rgba(124,58,237,0.4)']
            : isAnswer
              ? '0 0 80px rgba(124,58,237,0.7)'
              : ['0 0 30px rgba(124,58,237,0.2)', '0 0 50px rgba(124,58,237,0.4)', '0 0 30px rgba(124,58,237,0.2)'],
          scale: isThinking ? [1, 1.05, 1] : isAnswer ? 1.02 : 1,
        }}
        transition={{ duration: isThinking ? 2 : 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence>
          {(isThinking || isAnswer) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isThinking ? 0.8 : 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 magic-ball-inner-fog fog-animate"
            />
          )}
        </AnimatePresence>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-purple-500/20 blur-xl mix-blend-screen"
          animate={{ scale: isThinking ? [1, 1.5, 1] : 1, opacity: isThinking ? [0.3, 0.8, 0.3] : 0.3 }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="glass-reflection" />
        <div className="absolute bottom-4 right-8 w-1/3 h-1/4 rounded-full bg-purple-900/40 blur-md transform rotate-12" />
      </motion.div>

      <motion.div
        className="absolute -bottom-10 w-48 h-8 bg-black/80 rounded-[100%] blur-md"
        animate={{ scale: isThinking ? [1, 1.1, 1] : 1, opacity: isThinking ? [0.5, 0.8, 0.5] : 0.5 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('INTRO');
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [thinkingPhrase, setThinkingPhrase] = useState('');
  const [dots, setDots] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (appState === 'INTRO' || appState === 'GREETING') {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [appState]);

  const handleNameSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (name.trim()) setAppState('GREETING');
  };

  const handleQuestionSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim()) return;
    setShowWarning(false);
    setAppState('THINKING');
    setThinkingPhrase(THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)]);
    setDots('');

    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount++;
      setDots('.'.repeat(dotCount % 4));
    }, 500);

    setTimeout(() => {
      clearInterval(dotInterval);
      setAnswer(ANSWERS[Math.floor(Math.random() * ANSWERS.length)]);
      setAppState('ANSWER');
      setQuestion('');
    }, 3000);
  };

  const handleAnotherQuestion = () => {
    setAppState('GREETING');
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 4000);
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
  };

  const inputClass =
    'bg-purple-950/40 border border-purple-500/30 text-center rounded-full px-6 py-3 text-purple-100 placeholder:text-purple-700/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all';
  const btnClass =
    'px-8 py-3 rounded-full bg-purple-900/50 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-widest uppercase text-sm';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-2xl flex flex-col items-center">
        <MagicBallVisual state={appState} />

        <div className="mt-8 w-full min-h-[200px] flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">

            {appState === 'INTRO' && (
              <motion.div key="intro" variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full">
                <p className="text-xl md:text-2xl font-serif text-purple-200 mb-6 italic tracking-wide leading-relaxed">
                  "Разверзнутся чертоги магии... Я — магический шар. Я знаю ответ на твой вопрос."
                </p>
                <p className="text-lg text-purple-300/80 mb-6 font-serif">Представься...</p>
                <form onSubmit={handleNameSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <input ref={inputRef} type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Твое имя" className={inputClass} autoComplete="off" />
                  <button type="submit" disabled={!name.trim()} className={btnClass} style={{ fontFamily: 'var(--app-font-serif)' }}>
                    Войти
                  </button>
                </form>
              </motion.div>
            )}

            {appState === 'GREETING' && (
              <motion.div key={showWarning ? 'warning' : 'greeting'} variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full">
                {showWarning ? (
                  <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-lg md:text-xl font-serif text-teal-300/90 mb-6 italic tracking-wide">
                    Назидание: не используй меня слишком часто, иначе растратишь попусту знаки, посылаемые тебе свыше...
                  </motion.p>
                ) : (
                  <>
                    <p className="text-xl md:text-2xl font-serif text-purple-200 mb-4 italic tracking-wide">
                      Я долго ждал тебя, {name}!
                    </p>
                    <p className="text-lg text-purple-300/80 mb-6 font-serif">Итак, твой вопрос...</p>
                    <form onSubmit={handleQuestionSubmit} className="flex flex-col gap-4 justify-center items-center w-full max-w-md mx-auto">
                      <input ref={inputRef} type="text" value={question} onChange={e => setQuestion(e.target.value)}
                        placeholder="Что тебя тревожит?" className={`w-full ${inputClass}`} autoComplete="off" />
                      <button type="submit" disabled={!question.trim()} className={`${btnClass} mt-2`} style={{ fontFamily: 'var(--app-font-serif)' }}>
                        Вопросить
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            )}

            {appState === 'THINKING' && (
              <motion.div key="thinking" variants={variants} initial="hidden" animate="visible" exit="exit"
                className="w-full flex flex-col items-center justify-center h-[120px]">
                <p className="text-xl md:text-2xl font-serif text-teal-200/80 mb-4 italic tracking-widest">
                  Шар затуманился<span className="inline-block w-8 text-left">{dots}</span>
                </p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                  className="text-lg text-purple-400/60 font-serif">
                  {thinkingPhrase}
                </motion.p>
              </motion.div>
            )}

            {appState === 'ANSWER' && (
              <motion.div key="answer" variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full">
                <p className="text-sm font-sans text-purple-400/60 mb-2 tracking-[0.2em] uppercase">Ответ свыше:</p>
                <motion.p
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1, textShadow: '0px 0px 20px rgba(124,58,237,0.5)' }}
                  transition={{ duration: 0.8, type: 'spring' }}
                  className="text-3xl md:text-4xl font-serif text-white mb-10 italic font-medium">
                  "{answer}"
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button onClick={handleAnotherQuestion}
                    className="px-6 py-3 rounded-full bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/30 text-purple-200 transition-all font-serif tracking-wider text-sm w-full sm:w-auto">
                    Задать ещё вопрос
                  </button>
                  <button onClick={() => setAppState('FAREWELL')}
                    className="px-6 py-3 rounded-full border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5 transition-all font-serif tracking-wider text-sm w-full sm:w-auto">
                    Уйти
                  </button>
                </div>
              </motion.div>
            )}

            {appState === 'FAREWELL' && (
              <motion.div key="farewell" variants={variants} initial="hidden" animate="visible" exit="exit" className="w-full">
                <p className="text-2xl md:text-3xl font-serif text-purple-300/80 mb-10 italic tracking-wide">
                  До встречи в чертогах магии...
                </p>
                <button onClick={() => { setName(''); setQuestion(''); setAppState('INTRO'); }}
                  className="px-8 py-3 rounded-full bg-purple-900/20 hover:bg-purple-800/40 border border-purple-500/20 text-purple-400/80 hover:text-purple-200 transition-all font-serif tracking-widest uppercase text-sm">
                  Вернуться
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}