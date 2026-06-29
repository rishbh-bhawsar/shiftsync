let initialized = false;
let initPromise = null;

export const initOneSignal = async () => {
  if (!window.OneSignal) return null;
  if (initialized) return await getOneSignalPlayerId();
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await window.OneSignal.init({
        appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerParam: { scope: '/' },
        serviceWorkerUrl: 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDKWorker.js',
      });

      initialized = true;
      console.log('OneSignal initialized');

      await new Promise((r) => setTimeout(r, 2000));
      return await getOneSignalPlayerId();
    } catch (err) {
      console.warn('OneSignal unavailable — using Socket.IO only:', err.message);
      initialized = true;
      return null;
    }
  })();

  return initPromise;
};

export const getOneSignalPlayerId = async () => {
  if (!window.OneSignal) return null;
  try {
    const isPushEnabled = await window.OneSignal.isPushNotificationsEnabled();
    if (!isPushEnabled) {
      await window.OneSignal.promptForPushNotifications();
    }
    const playerIds = await window.OneSignal.getPlayerIds();
    return playerIds?.userId || null;
  } catch {
    return null;
  }
};
