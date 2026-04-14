
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useMaintenance } from '@/context/MaintenanceContext';

const getFullUrl = (url: string) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export function AppUpdateBanner() {
  const { maintenanceConfig } = useMaintenance();
  const { appUpdate } = maintenanceConfig;

  if (!appUpdate?.showBanner) {
    return null;
  }

  const downloadUrl = getFullUrl(appUpdate.url);

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full mt-1">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-bold">New App Update Available!</h3>
            <p className="text-xs text-muted-foreground">Version {appUpdate.version} is ready to download. {appUpdate.releaseNotes}</p>
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Download APK</Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
