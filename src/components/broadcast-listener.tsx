
"use client";

import { useEffect, useRef } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { rtdb } from '@/lib/firebase';
import { useNotifications } from '@/context/NotificationContext';

type BroadcastMessage = {
    text: string;
    timestamp: string;
};

export function BroadcastListener() {
  const { addNotification, clearAllNotifications } = useNotifications();
  const isMounted = useRef(true);

  useEffect(() => {
    const messageRef = ref(rtdb, 'broadcast/message');

    const listener = onValue(messageRef, (snapshot) => {
      if (!isMounted.current) return;

      if (snapshot.exists()) {
        const message = snapshot.val() as BroadcastMessage;
        if (message && message.timestamp) {
          addNotification({
            title: 'Broadcast',
            body: message.text,
            timestamp: message.timestamp,
          });
        }
      } else {
        // If the message is cleared from the database, clear the notifications.
        clearAllNotifications();
      }
    });

    return () => {
      isMounted.current = false;
      off(messageRef, 'value', listener);
    };
  }, [addNotification, clearAllNotifications]);

  return null;
}
