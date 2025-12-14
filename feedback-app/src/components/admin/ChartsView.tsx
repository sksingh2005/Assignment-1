'use client';

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    AreaChart, Area, CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Submission } from '@/types';
import { useMemo } from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface ChartsViewProps {
    submissions: Submission[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

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
        // Group by date
        const groups: Record<string, number> = {};
        const sorted = [...submissions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        sorted.forEach(s => {
            const date = new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
            groups[date] = (groups[date] || 0) + 1;
        });

        return Object.entries(groups).map(([date, count]) => ({ date, count }));
    }, [submissions]);

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

        </div>
    );
}
