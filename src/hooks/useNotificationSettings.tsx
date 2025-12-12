import { useEffect, useState } from "react";

interface NotificationSettings {
  matchReminders: boolean;
  communityAlerts: boolean;
  generalAlerts: boolean;
}

const STORAGE_KEY = "lbpl_notification_settings";

const defaultSettings: NotificationSettings = {
  matchReminders: false,
  communityAlerts: false,
  generalAlerts: false,
};

export function useNotificationSettings() {
  const [settings, setSettingsState] = useState<NotificationSettings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      setPermission("granted");
      return true;
    }

    if (Notification.permission === "denied") {
      setPermission("denied");
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  };

  const updateSetting = async (key: keyof NotificationSettings, value: boolean): Promise<boolean> => {
    // If enabling a notification and permission not granted, request it
    if (value && permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) {
        return false;
      }
    }

    const newSettings = { ...settings, [key]: value };
    setSettingsState(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    return true;
  };

  const isPermissionDenied = permission === "denied";

  return { settings, updateSetting, permission, isPermissionDenied, requestPermission };
}
