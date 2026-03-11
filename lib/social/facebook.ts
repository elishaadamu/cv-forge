
import axios from 'axios';

export async function postToFacebook(message: string) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    console.warn('Facebook page ID or access token not set');
    return { success: false, message: 'Configuration missing' };
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const response = await axios.post(url, {
      message: message,
      access_token: accessToken,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Facebook Post Error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}
