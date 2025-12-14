'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Submission } from '@/types';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';

interface InsightsViewProps {
    submissions: Submission[];
}

export function InsightsView({ submissions }: InsightsViewProps) {

    const insights = useMemo(() => {
        // This is a "mock" aggregation since we don't have a real backend aggregator yet.
        // In a real app, we'd ask the LLM to summarize ALL feedback.
        // For now, we extract frequent keywords from the individual AI summaries.

        const allActions = submissions.flatMap(s => s.aiResponse?.actions || []);
        const uniqueActions = Array.from(new Set(allActions)).slice(0, 5); // Take top 5 unique

        const positiveCount = submissions.filter(s => s.rating >= 4).length;
        const negativeCount = submissions.filter(s => s.rating <= 2).length;
        const total = submissions.length || 1;

        const sentimentScore = Math.round((positiveCount / total) * 100);

        return {
            topActions: uniqueActions,
            sentimentScore,
            criticalIssues: negativeCount
        };
    }, [submissions]);

    if (submissions.length === 0) return <div className="text-white/50 text-center py-20">No data for insights.</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* High Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-emerald-100 flex items-center gap-2 text-lg">
                            <TrendingUp size={20} /> Sentiment Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">{insights.sentimentScore}%</div>
                        <p className="text-emerald-200/60 text-sm mt-1">Positive feedback ratio</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-rose-500/20 to-orange-500/20 border-rose-500/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-rose-100 flex items-center gap-2 text-lg">
                            <AlertTriangle size={20} /> Critical Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">{insights.criticalIssues}</div>
                        <p className="text-rose-200/60 text-sm mt-1">Low rated (1-2 stars) feedbacks</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border-indigo-500/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-indigo-100 flex items-center gap-2 text-lg">
                            <Lightbulb size={20} /> Actionable Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">{insights.topActions.length}</div>
                        <p className="text-indigo-200/60 text-sm mt-1">Key improvement areas identified</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Plan List */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle2 className="text-indigo-400" />
                        Top Recommended Actions
                    </CardTitle>
                    <CardDescription className="text-white/50">
                        AI-suggested priorities based on recent feedback trends.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {insights.topActions.map((action, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="mt-0.5 min-w-[20px] h-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-xs text-indigo-200 font-bold border border-indigo-500/50">
                                    {i + 1}
                                </div>
                                <span className="text-white/80 text-sm">{action}</span>
                            </li>
                        ))}
                        {insights.topActions.length === 0 && (
                            <div className="text-white/30 italic">No specific actions generated yet.</div>
                        )}
                    </ul>
                </CardContent>
            </Card>

        </div>
    );
}
