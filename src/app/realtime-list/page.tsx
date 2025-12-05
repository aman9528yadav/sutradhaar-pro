import { RealtimeList } from '@/components/realtime-list';

export default function RealtimeListPage() {
    return (
        <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Realtime Database Demo</h1>
                    <p className="text-muted-foreground">
                        This list is powered by Firebase Realtime Database.
                        Open this page in multiple tabs/windows to see updates instantly.
                    </p>
                </div>
                <RealtimeList />
            </div>
        </div>
    );
}
