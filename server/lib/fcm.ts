import { messaging } from "./firebase-admin.ts";

type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
};

// Send to single device
export async function sendPushNotification(
  fcmToken: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    await messaging.send({
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data || {},
      android: {
        priority: "high",
        notification: { sound: "default", clickAction: "FLUTTER_NOTIFICATION_CLICK" },
      },
      apns: {
        payload: { aps: { sound: "default", badge: 1 } },
      },
      webpush: {
        notification: { icon: "/logo-192.png", badge: "/badge.png" },
        fcmOptions: { link: payload.data?.url || "/" },
      },
    });
    return true;
  } catch (err) {
    console.error("FCM send failed:", err);
    return false;
  }
}

// Send to multiple agents at once
export async function sendMulticastNotification(
  fcmTokens: string[],
  payload: NotificationPayload
): Promise<void> {
  if (!fcmTokens.length) return;

  const chunks = [];
  // FCM multicast max is 500 per call
  for (let i = 0; i < fcmTokens.length; i += 500) {
    chunks.push(fcmTokens.slice(i, i + 500));
  }

  for (const chunk of chunks) {
    await messaging.sendEachForMulticast({
      tokens: chunk,
      notification: { title: payload.title, body: payload.body },
      data: payload.data || {},
    });
  }
}

// Send to Firestore topic (e.g. all agents in ZW)
export async function sendTopicNotification(
  topic: string, // e.g. "agents-ZW", "referrers-ZA"
  payload: NotificationPayload
): Promise<void> {
  await messaging.send({
    topic,
    notification: { title: payload.title, body: payload.body },
    data: payload.data || {},
  });
}

// Subscribe user to topic (call when user logs in)
export async function subscribeToTopics(
  fcmToken: string,
  userId: string,
  role: string,
  country: string
): Promise<void> {
  const topics = [
    `${role}s-${country}`,      // e.g. "agents-ZW"
    `users-${country}`,          // everyone in country
    `user-${userId}`,            // individual user topic
  ];

  await Promise.all(
    topics.map((topic) => messaging.subscribeToTopic([fcmToken], topic))
  );
}
