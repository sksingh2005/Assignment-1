'use client';

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    LineChart, Line, CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Submission } from '@/types';
import { useMemo } from 'react';

interface ChartsViewProps {
    submissions: Submission[];
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

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
        // Group by date (simple YYYY-MM-DD)
        const groups: Record<string, number> = {};
        // improved sort
        const sorted = [...submissions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        sorted.forEach(s => {
            const date = new Date(s.timestamp).toLocaleDateString();
            groups[date] = (groups[date] || 0) + 1;
        });

        return Object.entries(groups).map(([date, count]) => ({ date, count }));
        // Limit to last 7 days or similar could be added
    }, [submissions]);

    if (submissions.length === 0) {
        return <div className="text-white/50 text-center py-20">Not enough data for analytics.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">

            {/* Rating Distribution */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-white">Rating Distribution</CardTitle>
                    <CardDescription className="text-white/50">Overall sentiment breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ratingData}>
                                <XAxis
                                    dataKey="rating"
                                    stroke="#ffffff50"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {ratingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Submission Trend */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-white">Submission Volume</CardTitle>
                    <CardDescription className="text-white/50">Feedback received over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#ffffff50"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#ffffff50"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#818cf8"
                                    strokeWidth={3}
                                    dot={{ fill: '#818cf8', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#fff' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
