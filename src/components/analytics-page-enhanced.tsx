"use client";

import React, { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Target,
    Award,
    Calendar,
    Clock,
    Zap,
    BarChart3,
    PieChart,
    Download,
    Share2,
    Filter,
} from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { isToday, isYesterday, formatDistanceToNow, startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';
import { ActivityBreakdownChart } from '@/components/activity-breakdown-chart';
import { WeeklySummaryChart } from './weekly-summary-chart';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const StatCard = ({
    title,
    value,
    change,
    description,
    icon: Icon,
    trend,
}: {
    title: string;
    value: string | number;
    change?: number;
    description: string;
    icon?: any;
    trend?: 'up' | 'down' | 'neutral';
}) => {
    const isPositive = change !== undefined && change >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 shadow-lg overflow-hidden relative group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="p-4 pb-2 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4 text-primary" />}
                        <CardTitle className="text-xs font-medium text-white/60 uppercase tracking-wider">{title}</CardTitle>
                    </div>
                    {change !== undefined && (
                        <Badge variant={isPositive ? "default" : "destructive"} className="text-xs px-2 py-0.5">
                            <TrendIcon className="h-3 w-3 mr-0.5" />
                            {Math.abs(change)}%
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 relative z-10">
                <div className="text-3xl font-bold text-white tracking-tight mb-1">{value}</div>
                <p className="text-xs text-white/40">{description}</p>
            </CardContent>
        </Card>
    );
};

const InsightCard = ({ title, description, icon: Icon, color }: { title: string; description: string; icon: any; color: string }) => (
    <div className={cn("p-4 rounded-xl border", `bg-${color}-500/10 border-${color}-500/20`)}>
        <div className="flex items-start gap-3">
            <div className={cn("p-2 rounded-lg", `bg-${color}-500/20`)}>
                <Icon className={cn("h-4 w-4", `text-${color}-400`)} />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
                <p className="text-xs text-white/60">{description}</p>
            </div>
        </div>
    </div>
);

export function AnalyticsPageEnhanced() {
    const { profile } = useProfile();
    const { history, favorites, budget } = profile;
    const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
    const [showInsights, setShowInsights] = useState(true);

    const getCountForDay = (items: any[], dateFn: (d: Date) => boolean) => {
        return items.filter((c: { timestamp: string | number | Date; }) => dateFn(new Date(c.timestamp))).length;
    };

    const getCountForWeek = (items: any[]) => {
        const now = new Date();
        const start = startOfWeek(now);
        const end = endOfWeek(now);
        return items.filter((c: { timestamp: string | number | Date; }) =>
            isWithinInterval(new Date(c.timestamp), { start, end })
        ).length;
    };

    const analyticsData = useMemo(() => {
        const { allTimeActivities = 0, streak = 0 } = profile.stats || {};

        const conversions = history.filter(h => h.type === 'conversion');
        const calculatorOps = history.filter(h => h.type === 'calculator');
        const dateCalculations = history.filter(h => h.type === 'date_calculation');

        const conversionsToday = getCountForDay(conversions, isToday);
        const conversionsYesterday = getCountForDay(conversions, isYesterday);
        const conversionsWeek = getCountForWeek(conversions);

        const calculatorOpsToday = getCountForDay(calculatorOps, isToday);
        const calculatorOpsYesterday = getCountForDay(calculatorOps, isYesterday);

        const dateCalculationsToday = getCountForDay(dateCalculations, isToday);
        const dateCalculationsYesterday = getCountForDay(dateCalculations, isYesterday);

        const calcPercentageChange = (todayCount: number, yesterdayCount: number) => {
            if (yesterdayCount === 0) return todayCount > 0 ? 100 : 0;
            return Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);
        };

        // Calculate productivity score (0-100)
        const productivityScore = Math.min(100, Math.round(
            (conversionsToday * 2 + calculatorOpsToday * 1.5 + dateCalculationsToday * 1.5) / 10 * 100
        ));

        // Most active hour
        const hourCounts = history.reduce((acc: any, item) => {
            const hour = new Date(item.timestamp).getHours();
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
        }, {});
        const mostActiveHour = Object.entries(hourCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 12;

        return {
            totalActivities: {
                value: allTimeActivities,
                change: calcPercentageChange(
                    conversionsToday + calculatorOpsToday + dateCalculationsToday,
                    conversionsYesterday + calculatorOpsYesterday + dateCalculationsYesterday
                )
            },
            todayActivities: {
                value: conversionsToday + calculatorOpsToday + dateCalculationsToday,
                description: 'Activities today'
            },
            weekActivities: {
                value: conversionsWeek,
                description: 'This week'
            },
            totalConversions: {
                value: conversions.length,
                change: calcPercentageChange(conversionsToday, conversionsYesterday)
            },
            calculatorOps: {
                value: calculatorOps.length,
                change: calcPercentageChange(calculatorOpsToday, calculatorOpsYesterday)
            },
            currentStreak: {
                value: streak,
                description: `${streak} day${streak !== 1 ? 's' : ''} streak`
            },
            favoriteConversions: {
                value: favorites.length,
                description: 'Saved favorites'
            },
            productivityScore: {
                value: productivityScore,
                description: 'Today\'s productivity'
            },
            mostActiveHour: {
                value: `${mostActiveHour}:00`,
                description: 'Peak activity time'
            },
            avgPerDay: {
                value: Math.round(allTimeActivities / Math.max(1, streak)),
                description: 'Average per day'
            }
        };
    }, [history, favorites, profile, timeRange]);

    // Generate insights
    const insights = useMemo(() => {
        const insights = [];

        if (analyticsData.currentStreak.value >= 7) {
            insights.push({
                title: '🔥 On Fire!',
                description: `You've maintained a ${analyticsData.currentStreak.value}-day streak. Keep it up!`,
                icon: Award,
                color: 'orange'
            });
        }

        if (analyticsData.productivityScore.value >= 80) {
            insights.push({
                title: '⚡ High Productivity',
                description: `Your productivity score is ${analyticsData.productivityScore.value}%. You're crushing it today!`,
                icon: Zap,
                color: 'green'
            });
        }

        if (analyticsData.todayActivities.value > analyticsData.avgPerDay.value) {
            insights.push({
                title: '📈 Above Average',
                description: `You're ${Math.round((analyticsData.todayActivities.value / analyticsData.avgPerDay.value - 1) * 100)}% more active than usual!`,
                icon: TrendingUp,
                color: 'blue'
            });
        }

        if (favorites.length >= 10) {
            insights.push({
                title: '⭐ Power User',
                description: `You have ${favorites.length} favorite conversions. You know what you need!`,
                icon: Target,
                color: 'purple'
            });
        }

        return insights;
    }, [analyticsData, favorites]);

    const exportData = () => {
        const data = {
            exported: new Date().toISOString(),
            stats: analyticsData,
            history: history.slice(0, 100),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-sm text-white/60">Track your productivity and usage</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportData} className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Key Metrics - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard
                    title="Today"
                    value={analyticsData.todayActivities.value}
                    description={analyticsData.todayActivities.description}
                    icon={Activity}
                    change={analyticsData.totalActivities.change}
                />
                <StatCard
                    title="Streak"
                    value={analyticsData.currentStreak.value}
                    description={analyticsData.currentStreak.description}
                    icon={Award}
                />
                <StatCard
                    title="Productivity"
                    value={`${analyticsData.productivityScore.value}%`}
                    description={analyticsData.productivityScore.description}
                    icon={Zap}
                />
                <StatCard
                    title="Peak Time"
                    value={analyticsData.mostActiveHour.value}
                    description={analyticsData.mostActiveHour.description}
                    icon={Clock}
                />
            </div>

            {/* Insights */}
            {showInsights && insights.length > 0 && (
                <Card className="bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-xl border-primary/20 shadow-xl">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Zap className="h-5 w-5 text-primary" />
                                Insights
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowInsights(false)} className="text-white/60 hover:text-white">
                                Hide
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {insights.map((insight, idx) => (
                            <InsightCard key={idx} {...insight} />
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Weekly Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[180px]">
                        <WeeklySummaryChart />
                    </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-white flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Activity Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex justify-center items-center">
                        <ActivityBreakdownChart />
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Stats Grid */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="text-white">Detailed Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-white/60">Total Activities</p>
                            <p className="text-2xl font-bold text-white">{analyticsData.totalActivities.value}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-white/60">Conversions</p>
                            <p className="text-2xl font-bold text-white">{analyticsData.totalConversions.value}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-white/60">Calculator Ops</p>
                            <p className="text-2xl font-bold text-white">{analyticsData.calculatorOps.value}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-white/60">Favorites</p>
                            <p className="text-2xl font-bold text-white">{analyticsData.favoriteConversions.value}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-white/60">This Week</p>
                            <p className="text-2xl font-bold text-white">{analyticsData.weekActivities.value}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-white/60">Avg/Day</p>
                            <p className="text-2xl font-bold text-white">{analyticsData.avgPerDay.value}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
