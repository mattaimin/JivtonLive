'use server'

import { RtcTokenBuilder, RtcRole, RtmTokenBuilder } from 'agora-token';

export async function getToken(channelName: string, uid: number) {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    throw new Error("Agora App ID or Certificate is missing in .env.local");
  }

  const role = RtcRole.PUBLISHER; 
  const tokenExpirationInSeconds = 3600; 
  const privilegeExpirationInSeconds = 3600; 
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + privilegeExpirationInSeconds;

  // RTC (Video) uses Timestamp (privilegeExpiredTs)
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    tokenExpirationInSeconds,
    privilegeExpiredTs
  );

  return token;
}

export async function getRtmToken(userId: string) {
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    throw new Error("Agora App ID or Certificate is missing in .env.local");
  }

  // RTM (Chat) uses Duration (seconds from now) based on your header definition
  const expirationInSeconds = 3600;

  const token = RtmTokenBuilder.buildToken(
    appId,
    appCertificate,
    userId,
    expirationInSeconds // FIX: Pass duration (3600), not timestamp
  );

  return token;
}