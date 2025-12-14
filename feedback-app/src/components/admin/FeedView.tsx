'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Sparkles } from 'lucide-react';
import { Submission } from '@/types';

interface FeedViewProps {
    submissions: Submission[];
}

function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    size={14}
                    className={i < rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-white/20'}
                />
            ))}
        </div>
    );
}

export function FeedView({ submissions }: FeedViewProps) {
    if (submissions.length === 0) {
        return (
            <div className="text-center py-14 rounded-2xl border border-white/10 bg-white/5 text-white/60 shadow-[0_18px_55px_rgba(0,0,0,0.75)]">
                No feedback collected yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Recent submissions</h2>
                    <p className="text-sm text-white/55">Newest feedback appears here automatically.</p>
                </div>
            </div>

            <motion.div layout className="grid gap-4">
                <AnimatePresence initial={false}>
                    {submissions.map((sub) => (
                        <motion.div
                            key={sub.id}
                            layout
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_22px_70px_rgba(0,0,0,0.85)] hover:shadow-[0_30px_90px_rgba(0,0,0,0.9)] transition-shadow">
                                <CardContent className="p-6">
                                    <div className="grid gap-6 md:grid-cols-[1fr_1.6fr] md:items-start">
                                        {/* Review */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <RatingStars rating={sub.rating} />
                                                <span className="text-xs text-white/50 tabular-nums">
                                                    {new Date(sub.timestamp).toLocaleString()}
                                                </span>
                                            </div>

                                            <p className="text-white/85 text-sm leading-relaxed">
                                                “{sub.review}”
                                            </p>
                                        </div>

                                        {/* AI analysis */}
                                        <div className="space-y-4 md:border-l md:border-white/10 md:pl-6">
                                            <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3">
                                                <h4 className="text-[11px] font-semibold text-indigo-200 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Sparkles size={12} /> AI summary
                                                </h4>
                                                <p className="text-indigo-100/90 text-sm">
                                                    {sub.aiResponse?.summary || 'Processing...'}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-[11px] font-semibold text-white/55 uppercase tracking-widest mb-2">
                                                    Recommended actions
                                                </h4>

                                                <div className="flex flex-wrap gap-2">
                                                    {(sub.aiResponse?.actions?.length ? sub.aiResponse.actions : ['Pending actions']).map(
                                                        (action, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center rounded-md border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-medium text-white/80 shadow-sm"
                                                            >
                                                                {action}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
