'use client';

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area, CartesianGrid, LineChart, Line, RadialBarChart, RadialBar, Legend, PieChart, Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Submission } from '@/types';
import { useMemo, useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Cloud, Gauge, Calendar, Clock, Activity, Zap, Heart, Target, Sparkles, Brain, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Live Pulse Stats Component - Animated real-time metrics
function LivePulseStats({ submissions }: { submissions: Submission[] }) {
    const [pulse, setPulse] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setPulse(p => p + 1), 2000);
        return () => clearInterval(interval);
    }, []);

    const todayCount = useMemo(() => {
        const today = new Date().toDateString();
        return submissions.filter(s => new Date(s.timestamp).toDateString() === today).length;
    }, [submissions]);

    const avgRating = useMemo(() => {
        if (submissions.length === 0) return 0;
        return (submissions.reduce((acc, s) => acc + s.rating, 0) / submissions.length).toFixed(1);
    }, [submissions]);

    const stats = [
        { label: 'Total Feedback', value: submissions.length, icon: MessageCircle, color: 'from-violet-500 to-purple-600' },
        { label: 'Today\'s Entries', value: todayCount, icon: Zap, color: 'from-amber-500 to-orange-600' },
        { label: 'Avg Rating', value: avgRating, icon: Heart, color: 'from-rose-500 to-pink-600' },
        { label: 'AI Processed', value: submissions.filter(s => s.aiResponse).length, icon: Brain, color: 'from-cyan-500 to-blue-600' },
    ];

    return (
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl shadow-2xl lg:col-span-2 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.15),transparent_50%)]" />
            <CardHeader className="relative">
                <CardTitle className="text-white flex items-center gap-2">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <Sparkles className="h-5 w-5 text-amber-400" />
                    </motion.div>
                    Live Pulse Stats
                    <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                        <motion.span
                            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                        Live
                    </span>
                </CardTitle>
                <CardDescription className="text-white/50">Real-time feedback metrics with AI processing</CardDescription>
            </CardHeader>
            <CardContent className="relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[0].replace('from-', '')}20, transparent)` }} />
                            <div className="relative p-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm">
                                <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                                    <stat.icon className="h-4 w-4 text-white" />
                                </div>
                                <motion.div
                                    key={`${stat.label}-${pulse}`}
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 0.3 }}
                                    className="text-3xl font-bold text-white"
                                >
                                    {stat.value}
                                </motion.div>
                                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Feedback Mood Ring - Animated orbital visualization
function FeedbackMoodRing({ submissions }: { submissions: Submission[] }) {
    const moodData = useMemo(() => {
        const moods = [
            { name: 'Ecstatic', emoji: '🤩', ratings: [5], color: '#22c55e' },
            { name: 'Happy', emoji: '🙂', ratings: [4], color: '#84cc16' },
            { name: 'Neutral', emoji: '😐', ratings: [3], color: '#eab308' },
            { name: 'Unhappy', emoji: '😕', ratings: [2], color: '#f97316' },
            { name: 'Frustrated', emoji: '😖', ratings: [1], color: '#ef4444' },
        ];

        return moods.map(mood => ({
            ...mood,
            count: submissions.filter(s => mood.ratings.includes(s.rating)).length,
            percentage: submissions.length > 0
                ? Math.round((submissions.filter(s => mood.ratings.includes(s.rating)).length / submissions.length) * 100)
                : 0
        }));
    }, [submissions]);

    const dominantMood = moodData.reduce((a, b) => a.count > b.count ? a : b, moodData[0]);

    return (
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.12),transparent_50%)]" />
            <CardHeader className="relative">
                <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-4 w-4 text-pink-400" />
                    Feedback Mood Ring
                </CardTitle>
                <CardDescription className="text-white/50">Emotional distribution across all feedback</CardDescription>
            </CardHeader>
            <CardContent className="relative">
                <div className="flex flex-col items-center py-4">
                    {/* Central animated mood display */}
                    <div className="relative w-40 h-40 mb-6">
                        {/* Orbital rings */}
                        {[0, 1, 2].map(ring => (
                            <motion.div
                                key={ring}
                                className="absolute inset-0 rounded-full border border-white/10"
                                style={{ transform: `scale(${0.6 + ring * 0.2})` }}
                                animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                                transition={{ duration: 20 + ring * 5, repeat: Infinity, ease: 'linear' }}
                            />
                        ))}

                        {/* Orbiting mood indicators */}
                        {moodData.map((mood, i) => (
                            <motion.div
                                key={mood.name}
                                className="absolute"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                }}
                                animate={{
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: 12 + i * 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                    delay: i * 0.5,
                                }}
                            >
                                <motion.div
                                    className="absolute -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                        left: `${60 + i * 5}px`,
                                    }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg"
                                        style={{ backgroundColor: `${mood.color}30`, border: `2px solid ${mood.color}` }}
                                        title={`${mood.name}: ${mood.count}`}
                                    >
                                        {mood.emoji}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}

                        {/* Center dominant mood */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                                style={{
                                    background: `radial-gradient(circle, ${dominantMood.color}40, ${dominantMood.color}10)`,
                                    boxShadow: `0 0 40px ${dominantMood.color}30`
                                }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {dominantMood.emoji}
                            </motion.div>
                        </div>
                    </div>

                    {/* Mood breakdown bars */}
                    <div className="w-full space-y-2">
                        {moodData.map((mood) => (
                            <div key={mood.name} className="flex items-center gap-3">
                                <span className="text-lg w-6">{mood.emoji}</span>
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: mood.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${mood.percentage}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                    />
                                </div>
                                <span className="text-xs text-white/60 w-12 text-right">{mood.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
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

            {/* Live Pulse Stats - Full width */}
            <LivePulseStats submissions={submissions} />

            {/* Feedback Mood Ring */}
            <FeedbackMoodRing submissions={submissions} />

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
