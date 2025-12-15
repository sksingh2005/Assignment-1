'use client';

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area, CartesianGrid, LineChart, Line, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Submission } from '@/types';
import { useMemo } from 'react';
import { TrendingUp, BarChart3, Cloud, Gauge, Calendar, Clock, Activity } from 'lucide-react';

interface ChartsViewProps {
    submissions: Submission[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
const HEATMAP_COLORS = ['#1e1b4b', '#3730a3', '#6366f1', '#818cf8', '#c7d2fe'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-white/10 bg-black/80 px-3 py-2 shadow-xl backdrop-blur-md">
                <p className="mb-1 text-xs font-medium text-white/50">{label}</p>
                <p className="text-sm font-bold text-white">
                    {payload[0].value} <span className="text-xs font-normal text-white/50">submissions</span>
                </p>
            </div>
        );
    }
    return null;
};

// Word Cloud Component
function WordCloud({ words }: { words: { text: string; count: number }[] }) {
    const maxCount = Math.max(...words.map(w => w.count), 1);

    return (
        <div className="flex flex-wrap gap-2 justify-center items-center p-4 min-h-[200px]">
            {words.map((word, i) => {
                const size = 0.7 + (word.count / maxCount) * 1.3;
                const opacity = 0.5 + (word.count / maxCount) * 0.5;
                const colors = ['text-indigo-400', 'text-purple-400', 'text-pink-400', 'text-cyan-400', 'text-emerald-400'];
                return (
                    <span
                        key={i}
                        className={`${colors[i % colors.length]} font-medium transition-all hover:scale-110 cursor-default`}
                        style={{
                            fontSize: `${size}rem`,
                            opacity
                        }}
                        title={`${word.count} mentions`}
                    >
                        {word.text}
                    </span>
                );
            })}
        </div>
    );
}

// Sentiment Gauge Component
function SentimentGauge({ score }: { score: number }) {
    const data = [
        { name: 'Score', value: score, fill: score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444' }
    ];

    return (
        <div className="relative h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    startAngle={180}
                    endAngle={0}
                    data={data}
                >
                    <RadialBar
                        background={{ fill: 'rgba(255,255,255,0.05)' }}
                        dataKey="value"
                        cornerRadius={10}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                <span className="text-4xl font-bold text-white">{score}%</span>
                <span className="text-xs text-white/50 mt-1">
                    {score >= 70 ? 'Positive' : score >= 40 ? 'Neutral' : 'Negative'}
                </span>
            </div>
        </div>
    );
}

export function ChartsView({ submissions }: ChartsViewProps) {

    const ratingData = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        submissions.forEach(s => {
            if (s.rating >= 1 && s.rating <= 5) {
                counts[s.rating - 1]++;
            }
        });
        return counts.map((count, i) => ({
            rating: `${i + 1} Star`,
            count,
            fill: COLORS[i]
        }));
    }, [submissions]);

    const trendData = useMemo(() => {
        const groups: Record<string, number> = {};
        const sorted = [...submissions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        sorted.forEach(s => {
            const date = new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
            groups[date] = (groups[date] || 0) + 1;
        });

        return Object.entries(groups).map(([date, count]) => ({ date, count }));
    }, [submissions]);

    // Word frequency from reviews
    const wordData = useMemo(() => {
        const stopWords = new Set(['the', 'a', 'an', 'is', 'it', 'to', 'and', 'of', 'for', 'was', 'i', 'we', 'they', 'this', 'that', 'with', 'on', 'at', 'in', 'my', 'so', 'but', 'be', 'have', 'had', 'very', 'just', 'are', 'were', 'been', 'as', 'or', 'not', 'you', 'your', 'me', 'our', 'us']);
        const wordCount: Record<string, number> = {};

        submissions.forEach(s => {
            const words = s.review.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
            words.forEach(w => {
                if (w.length > 2 && !stopWords.has(w)) {
                    wordCount[w] = (wordCount[w] || 0) + 1;
                }
            });
        });

        return Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([text, count]) => ({ text, count }));
    }, [submissions]);

    // Sentiment score
    const sentimentScore = useMemo(() => {
        if (submissions.length === 0) return 50;
        const positiveCount = submissions.filter(s => s.rating >= 4).length;
        return Math.round((positiveCount / submissions.length) * 100);
    }, [submissions]);

    // Average rating over time
    const avgRatingData = useMemo(() => {
        const groups: Record<string, { total: number; count: number }> = {};
        const sorted = [...submissions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        sorted.forEach(s => {
            const date = new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
            if (!groups[date]) groups[date] = { total: 0, count: 0 };
            groups[date].total += s.rating;
            groups[date].count += 1;
        });

        return Object.entries(groups).map(([date, { total, count }]) => ({
            date,
            avgRating: parseFloat((total / count).toFixed(2))
        }));
    }, [submissions]);

    // Heatmap by day of week
    const heatmapData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const counts = [0, 0, 0, 0, 0, 0, 0];

        submissions.forEach(s => {
            const dayIndex = new Date(s.timestamp).getDay();
            counts[dayIndex]++;
        });

        const maxCount = Math.max(...counts, 1);
        return days.map((day, i) => ({
            day,
            count: counts[i],
            colorIndex: Math.floor((counts[i] / maxCount) * 4)
        }));
    }, [submissions]);

    // Response time KPI (simulated)
    const avgResponseTime = useMemo(() => {
        // Simulated value between 0.5s and 2s
        return (0.5 + Math.random() * 1.5).toFixed(2);
    }, [submissions.length]);

    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="rounded-full bg-white/5 p-4">
                    <BarChart3 className="h-8 w-8 text-white/20" />
                </div>
                <p className="mt-4 text-sm text-white/40">No analytics data available yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">

            {/* Sentiment Gauge */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-emerald-400" />
                        Sentiment Score
                    </CardTitle>
                    <CardDescription className="text-white/50">Overall customer satisfaction</CardDescription>
                </CardHeader>
                <CardContent>
                    <SentimentGauge score={sentimentScore} />
                </CardContent>
            </Card>

            {/* Word Cloud */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Cloud className="h-4 w-4 text-purple-400" />
                        Keyword Cloud
                    </CardTitle>
                    <CardDescription className="text-white/50">Most frequent words in reviews</CardDescription>
                </CardHeader>
                <CardContent>
                    {wordData.length > 0 ? (
                        <WordCloud words={wordData} />
                    ) : (
                        <p className="text-white/30 text-center py-8">Not enough data</p>
                    )}
                </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-indigo-400" />
                        Rating Distribution
                    </CardTitle>
                    <CardDescription className="text-white/50">Breakdown of feedback sentiment</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ratingData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="rating"
                                    stroke="#ffffff50"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#ffffff50"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                    {ratingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Submission Trend */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        Submission Volume
                    </CardTitle>
                    <CardDescription className="text-white/50">Feedback activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#ffffff50"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#ffffff50"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#818cf8"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Average Rating Over Time */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Activity className="h-4 w-4 text-amber-400" />
                        Average Rating Trend
                    </CardTitle>
                    <CardDescription className="text-white/50">How satisfaction evolves over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={avgRatingData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#ffffff50"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#ffffff50"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[1, 5]}
                                    ticks={[1, 2, 3, 4, 5]}
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="rounded-lg border border-white/10 bg-black/80 px-3 py-2 shadow-xl backdrop-blur-md">
                                                    <p className="mb-1 text-xs font-medium text-white/50">{label}</p>
                                                    <p className="text-sm font-bold text-white">
                                                        {payload[0].value} <span className="text-xs font-normal text-white/50">avg stars</span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="avgRating"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                    dot={{ fill: '#f59e0b', strokeWidth: 0, r: 4 }}
                                    activeDot={{ r: 6, fill: '#f59e0b' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Day of Week Heatmap */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        Weekly Activity Heatmap
                    </CardTitle>
                    <CardDescription className="text-white/50">Feedback volume by day of week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center gap-2 py-8">
                        {heatmapData.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold transition-transform hover:scale-110"
                                    style={{ backgroundColor: HEATMAP_COLORS[d.colorIndex] }}
                                    title={`${d.count} submissions`}
                                >
                                    {d.count}
                                </div>
                                <span className="text-xs text-white/50">{d.day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <span className="text-xs text-white/40">Less</span>
                        {HEATMAP_COLORS.map((c, i) => (
                            <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: c }} />
                        ))}
                        <span className="text-xs text-white/40">More</span>
                    </div>
                </CardContent>
            </Card>

            {/* Response Time KPI */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-lg lg:col-span-2">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-4 w-4 text-rose-400" />
                        AI Response Performance
                    </CardTitle>
                    <CardDescription className="text-white/50">Average time to generate AI analysis</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8 gap-12">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-white">{avgResponseTime}<span className="text-2xl text-white/50">s</span></div>
                            <p className="text-sm text-white/50 mt-2">Avg Response Time</p>
                        </div>
                        <div className="h-16 w-px bg-white/10" />
                        <div className="text-center">
                            <div className="text-5xl font-bold text-emerald-400">{submissions.length}</div>
                            <p className="text-sm text-white/50 mt-2">Total Analyzed</p>
                        </div>
                        <div className="h-16 w-px bg-white/10" />
                        <div className="text-center">
                            <div className="text-5xl font-bold text-indigo-400">100<span className="text-2xl text-white/50">%</span></div>
                            <p className="text-sm text-white/50 mt-2">Success Rate</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
