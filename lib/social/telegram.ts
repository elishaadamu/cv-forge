
import axios from 'axios';

export async function postToTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram token or chat ID not set');
    return { success: false, message: 'Configuration missing' };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Telegram Post Error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}
