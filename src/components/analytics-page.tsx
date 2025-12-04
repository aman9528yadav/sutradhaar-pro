
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
    MoreVertical,
    ChevronUp,
    ChevronDown,
    Icon as LucideIcon,
} from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { isToday, isYesterday, formatDistanceToNow, parseISO } from 'date-fns';
import { ActivityBreakdownChart } from '@/components/activity-breakdown-chart';
import { WeeklySummaryChart } from './weekly-summary-chart';

const StatCard = ({
    title,
    value,
    change,
    description,
}: {
    title: string;
    value: string | number;
    change?: number;
    description: string;
}) => {
    const isPositive = change !== undefined && change >= 0;
    return (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-lg overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="p-4 pb-2 relative z-10">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xs font-medium text-white/60 uppercase tracking-wider">{title}</CardTitle>
                    {change !== undefined && (
                        <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-full ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isPositive ? <ChevronUp className="h-3 w-3 mr-0.5" /> : <ChevronDown className="h-3 w-3 mr-0.5" />}
                            {Math.abs(change)}%
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 relative z-10">
                <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
                <p className="text-xs text-white/40 mt-1">{description}</p>
            </CardContent>
        </Card>
    );
};


const DayOverDayComparison = ({ label, value }: { label: string, value: number }) => {
    const isPositive = value >= 0;
    return (
        <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
            <span className="text-sm text-white/70">{label}</span>
            <span className={`text-sm font-bold flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {Math.abs(value)}
            </span>
        </div>
    );
};

export function AnalyticsPage() {
    const { profile } = useProfile();
    const { history, favorites, budget } = profile;
    const [showMoreStats, setShowMoreStats] = useState(false);

    const getCountForDay = (items: any[], dateFn: (d: Date) => boolean) => {
        return items.filter((c: { timestamp: string | number | Date; }) => dateFn(new Date(c.timestamp))).length;
    }

    const analyticsData = useMemo(() => {
        const { allTimeActivities = 0, streak = 0 } = profile.stats || {};

        const conversions = history.filter(h => h.type === 'conversion');
        const calculatorOps = history.filter(h => h.type === 'calculator');
        const dateCalculations = history.filter(h => h.type === 'date_calculation');

        const conversionsToday = getCountForDay(conversions, isToday);
        const conversionsYesterday = getCountForDay(conversions, isYesterday);
        const calculatorOpsToday = getCountForDay(calculatorOps, isToday);
        const calculatorOpsYesterday = getCountForDay(calculatorOps, isYesterday);
        const dateCalculationsToday = getCountForDay(dateCalculations, isToday);
        const dateCalculationsYesterday = getCountForDay(dateCalculations, isYesterday);

        const calcPercentageChange = (todayCount: number, yesterdayCount: number) => {
            if (yesterdayCount === 0) return todayCount > 0 ? 100 : 0;
            return Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);
        };

        return {
            totalActivities: {
                value: allTimeActivities,
                change: calcPercentageChange(conversionsToday + calculatorOpsToday + dateCalculationsToday, conversionsYesterday + calculatorOpsYesterday + dateCalculationsYesterday)
            },
            totalConversions: {
                value: history.filter(h => h.type === 'conversion').length,
                change: calcPercentageChange(conversionsToday, conversionsYesterday)
            },
            calculatorOps: {
                value: history.filter(h => h.type === 'calculator').length,
                change: calcPercentageChange(calculatorOpsToday, calculatorOpsYesterday)
            },
            dateCalculations: {
                value: dateCalculations.length,
                change: calcPercentageChange(dateCalculationsToday, dateCalculationsYesterday)
            },
            currentStreak: { value: streak, description: `Best: ${streak} days` },
            savedNotes: { value: profile.notes.filter(n => !n.isTrashed).length, change: 0 },
            recycleBin: { value: profile.notes.filter(n => n.isTrashed).length, description: 'Items in bin' },
            favoriteConversions: { value: favorites.length, description: 'Your top conversions' },
        };
    }, [history, favorites, profile]);

    const lastActivities = history.slice(0, 3).map(item => {
        let title = '';
        if (item.type === 'conversion') title = 'Unit Conversion';
        if (item.type === 'calculator') title = 'Calculator';
        if (item.type === 'date_calculation') title = 'Date Calculation';

        return {
            id: item.id,
            title,
            time: formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }),
        }
    });

    const allStats = [
        { id: 'totalActivities', title: 'Total Activities', value: analyticsData.totalActivities.value, change: analyticsData.totalActivities.change, description: 'vs prev day' },
        { id: 'totalConversions', title: 'Total Conversions', value: analyticsData.totalConversions.value, change: analyticsData.totalConversions.change, description: 'vs prev day' },
        { id: 'calculatorOps', title: 'Calculator Ops', value: analyticsData.calculatorOps.value, change: analyticsData.calculatorOps.change, description: 'vs prev day' },
        { id: 'dateCalculations', title: 'Date Calculations', value: analyticsData.dateCalculations.value, change: analyticsData.dateCalculations.change, description: 'vs prev day' },
        { id: 'currentStreak', title: 'Current Streak', value: analyticsData.currentStreak.value, description: analyticsData.currentStreak.description },
        { id: 'savedNotes', title: 'Saved Notes', value: analyticsData.savedNotes.value, change: analyticsData.savedNotes.change, description: 'vs prev day' },
        { id: 'recycleBin', title: 'Recycle Bin', value: analyticsData.recycleBin.value, description: analyticsData.recycleBin.description },
        { id: 'favoriteConversions', title: 'Favorite Conversions', value: analyticsData.favoriteConversions.value, description: analyticsData.favoriteConversions.description },
    ];

    const visibleStats = showMoreStats ? allStats : allStats.slice(0, 4);

    const dayOverDayConversions = getCountForDay(history.filter(h => h.type === 'conversion'), isToday) - getCountForDay(history.filter(h => h.type === 'conversion'), isYesterday);
    const dayOverDayCalculator = getCountForDay(history.filter(h => h.type === 'calculator'), isToday) - getCountForDay(history.filter(h => h.type === 'calculator'), isYesterday);
    const dayOverDayDateCalcs = getCountForDay(history.filter(h => h.type === 'date_calculation'), isToday) - getCountForDay(history.filter(h => h.type === 'date_calculation'), isYesterday);

    return (
        <div className="w-full space-y-6 pb-20">
            <div className="grid grid-cols-2 gap-4">
                {visibleStats.map(stat => (
                    // @ts-ignore
                    <StatCard key={stat.id} {...stat} />
                ))}
            </div>
            <Button
                variant="ghost"
                className="w-full text-white/60 hover:text-white hover:bg-white/5"
                onClick={() => setShowMoreStats(!showMoreStats)}
            >
                {showMoreStats ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                {showMoreStats ? 'Show Less' : 'Show More'}
            </Button>


            <div className="grid grid-cols-1 gap-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Weekly Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[150px]">
                        <WeeklySummaryChart />
                    </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Activity Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex justify-center items-center">
                        <ActivityBreakdownChart />
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-white">Day-over-Day Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <DayOverDayComparison label="Conversions" value={dayOverDayConversions} />
                    <DayOverDayComparison label="Calculator" value={dayOverDayCalculator} />
                    <DayOverDayComparison label="Date Calcs" value={dayOverDayDateCalcs} />
                </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-white">Last Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {lastActivities.length > 0 ? (
                        lastActivities.map(activity => (
                            <div key={activity.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
                                <p className="font-medium text-sm text-white">{activity.title}</p>
                                <p className="text-xs text-white/40">{activity.time}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-white/40 text-center py-4">No recent activity</p>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
