import oneSignalConfig from '../config/onesignal.config.js';

export const sendPushNotification = async ({ playerIds, title, body, data = {} }) => {
  try {
    const response = await fetch(oneSignalConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${oneSignalConfig.restApiKey}`,
      },
      body: JSON.stringify({
        app_id: oneSignalConfig.appId,
        include_player_ids: playerIds,
        headings: { en: title },
        contents: { en: body },
        data,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('OneSignal push notification error:', error);
  }
};
