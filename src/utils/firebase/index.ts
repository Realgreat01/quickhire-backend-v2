import admin from 'firebase-admin';
import * as serviceAccount from './service-account.json';
interface MesasgeInterface {
  token: string;
  notification: { title: string; body: string };
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const SEND_NOTIFICATION = async (message: MesasgeInterface) => {
  try {
    const notification = {
      token: message.token,
      // message: {
      data: {
        message: 'This is a message from the server.',
      },
      notification: {
        title: message.notification.title,
        body: message.notification.body,
        image: 'https://example.com/image.png',
      },
      // },
    };
    const response = await admin.messaging().send(notification);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
export { SEND_NOTIFICATION };
