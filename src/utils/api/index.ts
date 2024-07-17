import axios from 'axios';

const IMAGE_TO_BASE64 = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const contentType = response.headers['content-type'] || 'image/jpeg';
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    throw error;
  }
};

export const API_SERVICE = {
  IMAGE_TO_BASE64,
};
