'use client';

import { useEffect, useState } from 'react';
import { Submission } from '@/types';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

import { AdminSidebar, ViewType } from '@/components/admin/Sidebar'; // Updated import
import { FeedView } from '@/components/admin/FeedView';
import { ChartsView } from '@/components/admin/ChartsView';
import { InsightsView } from '@/components/admin/InsightsView';
import { SidebarTrigger } from '@/components/ui/sidebar'; // Trigger for mobile

function BlackAmbientBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.22),transparent_62%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.26),transparent_55%)]" />
            <motion.div
                className="absolute -left-40 top-1/4 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl"
                animate={{ y: [0, -28, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
                animate={{ y: [0, 28, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(148,163,184,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.5)_1px,transparent_1px)] [background-size:52px_52px]" />
        </div>
    );
}

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeView, setActiveView] = useState<ViewType>('feed');

    const fetchSubmissions = async (opts?: { manual?: boolean }) => {
        try {
            if (opts?.manual) setRefreshing(true);
            const res = await fetch('/api/submissions');
            const data = await res.json();
            setSubmissions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setSubmissions([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
        const interval = setInterval(fetchSubmissions, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen text-white">
            <BlackAmbientBackground />

            <AdminSidebar activeView={activeView} onChangeView={setActiveView}>
                <div className="flex flex-col h-screen">

                    {/* Top Header */}
                    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Sidebar Trigger for Mobile/Collapse */}
                            <SidebarTrigger className="text-white hover:bg-white/10" />

                            <div>
                                <h1 className="text-lg font-semibold tracking-tight capitalize">
                                    {activeView === 'charts' ? 'Analytics' : activeView === 'insights' ? 'AI Insights' : 'Feedback Feed'}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                Live
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchSubmissions({ manual: true })}
                                className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                                disabled={refreshing}
                            >
                                <motion.span
                                    animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                                    transition={refreshing ? { repeat: Infinity, duration: 0.9, ease: 'linear' } : { duration: 0.2 }}
                                    className="mr-2 inline-flex"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </motion.span>
                                Refresh
                            </Button>
                        </div>
                    </header>

                    {/* View Content */}
                    <main className="flex-1 p-6 overflow-y-auto scrollbar-thin">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeView === 'feed' && <FeedView submissions={submissions} />}
                                {activeView === 'charts' && <ChartsView submissions={submissions} />}
                                {activeView === 'insights' && <InsightsView submissions={submissions} />}
                            </motion.div>
                        )}
                    </main>
                </div>
            </AdminSidebar>
        </div>
    );
}
