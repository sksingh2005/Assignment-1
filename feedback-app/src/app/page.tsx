'use client';

import { useEffect, useMemo, useState } from 'react';
import { Star, Send, MessageSquare, PartyPopper, Check, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const EMOJI_BY_RATING: Record<number, string> = { 1: '😖', 2: '😕', 3: '😐', 4: '🙂', 5: '🤩' };
const LABEL_BY_RATING: Record<number, string> = {
  1: 'Ouch — that’s on us',
  2: 'Not great',
  3: 'Decent',
  4: 'Nice!',
  5: 'Loved it!',
};

function BlackAmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.25),transparent_60%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.3),transparent_55%)]" />
      <motion.div
        className="absolute -left-40 top-1/4 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(148,163,184,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
}

/** Burst for rating emojis */
function ReactionBurst({
  show,
  originKey,
  emoji,
}: {
  show: boolean;
  originKey: string | number;
  emoji: string;
}) {
  const items = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: `${originKey}-${i}`,
        x: (i % 2 === 0 ? 1 : -1) * (14 + i * 6),
        y: 22 + i * 9,
        r: (i % 2 === 0 ? 1 : -1) * (10 + i * 4),
        s: 0.95 + (i % 3) * 0.12,
        d: 0.55 + i * 0.03,
      })),
    [originKey]
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={String(originKey)}
          className="pointer-events-none absolute left-1/2 top-1/2 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {items.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-2xl drop-shadow-[0_12px_22px_rgba(0,0,0,0.70)]"
              initial={{ x: 0, y: 0, scale: 0.6, rotate: 0, opacity: 0 }}
              animate={{
                x: [0, p.x],
                y: [0, -p.y],
                scale: [0.6, 1.2, p.s],
                rotate: [0, p.r],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: p.d, ease: 'easeOut' }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** NEW: colorful emoji pop-out for success */
function EmojiConfettiBurst({
  triggerKey,
  mainEmoji = '🎉',
}: {
  triggerKey: string | number;
  mainEmoji?: string;
}) {
  const palette = [
    '🎉',
    '✨',
    '💖',
    '🌈',
    '🔥',
    '⭐',
    '🟣',
    '🟦',
    '🟡',
    '🟢',
    '🍬',
  ];

  const pieces = useMemo(() => {
    const count = 18;
    return Array.from({ length: count }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / count;
      const radius = 90 + (i % 6) * 12;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.75;

      return {
        id: `${triggerKey}-${i}`,
        emoji: i === 0 ? mainEmoji : palette[i % palette.length],
        x,
        y,
        rot: (i % 2 === 0 ? 1 : -1) * (180 + (i % 5) * 35),
        delay: i * 0.02,
      };
    });
  }, [triggerKey, mainEmoji]);

  // Uses keyframes + stagger-like delays for a lively burst. [web:170][web:169]
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-0 w-0">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute -translate-x-1/2 text-2xl drop-shadow-[0_18px_35px_rgba(0,0,0,0.65)]"
          initial={{ x: 0, y: 12, opacity: 0, scale: 0.4, rotate: 0, filter: 'blur(0px)' }}
          animate={{
            x: [0, p.x],
            y: [12, -70 + p.y],
            opacity: [0, 1, 0],
            scale: [0.4, 1.25, 0.9],
            rotate: [0, p.rot],
          }}
          transition={{ duration: 1.05, ease: 'easeOut', delay: p.delay }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

export default function UserDashboard() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const [burstKey, setBurstKey] = useState(0);
  const [showBurst, setShowBurst] = useState(false);

  const [successKey, setSuccessKey] = useState(0);

  const maxChars = 700;
  const charCount = review.length;

  const activeRating = hoverRating || rating;
  const moodLabel = activeRating ? LABEL_BY_RATING[activeRating] : 'Pick a vibe';
  const moodEmoji = activeRating ? EMOJI_BY_RATING[activeRating] : '✨';

  const canSubmit = rating > 0 && review.trim().length > 0 && !loading;

  useEffect(() => {
    if (!showBurst) return;
    const t = setTimeout(() => setShowBurst(false), 650);
    return () => clearTimeout(t);
  }, [showBurst]);

  const handleSelectRating = (value: number) => {
    setRating(value);
    setBurstKey((k) => k + 1);
    setShowBurst(false);
    requestAnimationFrame(() => setShowBurst(true));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review }),
      });

      const data = await res.json();
      if (data?.aiResponse?.userResponse) setResponse(data.aiResponse.userResponse);
      else setResponse('Thanks for your feedback — it genuinely helps.');

      // trigger success confetti
      setSuccessKey((k) => k + 1);
    } catch {
      setResponse('Feedback received. There was a small network issue fetching the AI reply.');
      setSuccessKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResponse(null);
    setRating(0);
    setHoverRating(0);
    setReview('');
  };

  if (response) {
    return (
      <div className="min-h-screen relative text-white">
        <BlackAmbientBackground />

        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="relative w-full max-w-md">
            {/* Emoji pop-out celebration */}
            <EmojiConfettiBurst triggerKey={successKey} mainEmoji="🎉" />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.9)]">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0.85, rotate: -6 }}
                    animate={{ scale: [0.85, 1.05, 1], rotate: [-6, 3, 0] }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="mx-auto w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"
                  >
                    <PartyPopper className="w-7 h-7 text-white" />
                  </motion.div>

                  <CardTitle className="text-2xl text-white mt-4">
                    Sent. Thank you <span aria-hidden>🎉</span>
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Your feedback has been logged and will help improve the product.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-white/12 bg-black/40 p-4 text-white/90 leading-relaxed">
                    “{response}”
                  </div>
                </CardContent>

                <CardFooter className="flex justify-center">
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="w-full border-white/25 text-white hover:bg-white/10"
                  >
                    Send another round
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative text-white">
      <BlackAmbientBackground />

      <div className="min-h-screen flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-5xl"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] items-stretch">
            <div className="space-y-6">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <Sparkles className="h-3 w-3" />
                  Feedback Lab · v2
                </p>
                <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Help tune this experience.
                </h1>
                <p className="mt-2 text-sm sm:text-base text-white/70">
                  Honest, specific feedback from people like you is how this product gets sharper.
                </p>
              </div>

              <div className="space-y-4 text-sm text-white/75 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl p-4 shadow-[0_18px_50px_rgba(0,0,0,0.75)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.16em] text-white/50">Reaction meter</span>
                  <motion.div
                    key={String(activeRating || 0)}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1"
                  >
                    <span className="text-lg">{moodEmoji}</span>
                    <span className="text-xs font-medium text-white/85">{moodLabel}</span>
                  </motion.div>
                </div>
              </div>
            </div>

            <Card className="border-white/12 bg-white/[0.06] backdrop-blur-2xl shadow-[0_26px_90px_rgba(0,0,0,0.95)] overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400" />

              <CardContent className="p-6 sm:p-8 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-base text-white/90">First, how did it feel overall?</Label>

                    <div className="relative overflow-visible">
                      <ReactionBurst show={showBurst} originKey={burstKey} emoji={EMOJI_BY_RATING[rating] || '✨'} />

                      <div className="overflow-x-auto overflow-y-visible pb-2 [-webkit-overflow-scrolling:touch]">
                        <div className="flex gap-3 min-w-max pr-2">
                          {[1, 2, 3, 4, 5].map((v) => {
                            const isActive = (hoverRating || rating) >= v;
                            return (
                              <motion.button
                                key={v}
                                type="button"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.92 }}
                                onMouseEnter={() => setHoverRating(v)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleSelectRating(v)}
                                className={clsx(
                                  'relative w-[86px] shrink-0 rounded-2xl border px-3 py-3 text-center transition-colors',
                                  'focus:outline-none focus:ring-2 focus:ring-white/30',
                                  isActive ? 'border-white/25 bg-white/15' : 'border-white/15 bg-black/40 hover:bg-black/55'
                                )}
                              >
                                <motion.div
                                  animate={rating === v ? { scale: [1, 1.3, 1], rotate: [0, -6, 6, 0] } : { scale: 1, rotate: 0 }}
                                  transition={{ duration: 0.35, ease: 'easeOut' }}
                                  className="text-2xl"
                                >
                                  {EMOJI_BY_RATING[v]}
                                </motion.div>

                                <div className="mt-1 flex items-center justify-center gap-1">
                                  <Star size={15} className={clsx(isActive ? 'text-amber-300 fill-amber-300' : 'text-white/35 fill-transparent')} />
                                  <span className={clsx('text-xs', isActive ? 'text-white/90' : 'text-white/60')}>{v}</span>
                                </div>

                                {rating === v && (
                                  <motion.div
                                    layoutId="selectedRing"
                                    className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-pink-300/70"
                                  />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      <p className="text-xs text-white/55">Tip: swipe the row on small screens.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="review" className="text-sm sm:text-base text-white/90">
                        Then, tell the story.
                      </Label>
                      <span className="text-[11px] text-white/55">
                        {review.length}/{maxChars}
                      </span>
                    </div>

                    <div className="relative">
                      <Textarea
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value.slice(0, maxChars))}
                        placeholder="Example: On mobile, the dashboard lagged while switching tabs. I expected it to feel instant…"
                        className={clsx(
                          'min-h-[170px] resize-none rounded-2xl p-4 text-sm sm:text-base',
                          'border border-white/15 bg-black/80',
                          'text-gray-100 placeholder:text-gray-500',
                          'focus-visible:ring-2 focus-visible:ring-fuchsia-300/60 focus-visible:ring-offset-0'
                        )}
                      />
                      <MessageSquare className="absolute bottom-4 right-4 text-gray-400 pointer-events-none" size={18} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      type="submit"
                      disabled={!(rating > 0 && review.trim().length > 0) || loading}
                      className={clsx(
                        'relative w-full h-11 sm:h-12 text-sm sm:text-base rounded-2xl overflow-hidden',
                        'bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500',
                        'hover:from-indigo-600 hover:via-fuchsia-600 hover:to-pink-600',
                        'shadow-[0_14px_40px_rgba(236,72,153,0.25)]',
                        'disabled:opacity-60 disabled:cursor-not-allowed'
                      )}
                      whileTap={!loading ? { scale: 0.97 } : undefined}
                    >
                      <AnimatePresence>
                        {loading && (
                          <motion.span
                            key="shimmer"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          />
                        )}
                      </AnimatePresence>

                      <span className="relative z-10 inline-flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <motion.span className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }} />
                            <motion.span className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }} />
                            <motion.span className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
                            <span>Sending…</span>
                          </>
                        ) : (
                          <>
                            <span>Send feedback</span>
                            <Send size={18} />
                          </>
                        )}
                      </span>
                    </motion.button>

                    <p className="text-[11px] text-center text-white/55">
                      Optional: Include device + browser if you hit bugs.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
