
import { formatSocialMessage, SocialPostData } from './formatter';
import { postToTelegram } from './telegram';
import { postToFacebook } from './facebook';
import { postToWhatsApp } from './whatsapp';

export async function shareToAllPlatforms(data: SocialPostData) {
  const message = formatSocialMessage(data);
  
  const results = await Promise.allSettled([
    postToTelegram(message),
    postToFacebook(message),
    postToWhatsApp(message)
  ]);

  return {
    telegram: results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason },
    facebook: results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason },
    whatsapp: results[2].status === 'fulfilled' ? results[2].value : { success: false, error: results[2].reason }
  };
}
