require('dotenv').config();

export default class ENV {
  public static X_CSCAPI_API_URL = process.env.X_CSCAPI_API_URL;
  public static X_CSCAPI_API_KEY = process.env.X_CSCAPI_API_KEY;
}
