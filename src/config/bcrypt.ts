import bcrypt from 'bcrypt';

const HASHED_PASSWORD = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const COMPARE_PASSWORD = async (user_password: string, encrypted_Password: string) => {
  return await bcrypt.compare(user_password, encrypted_Password);
};

export { HASHED_PASSWORD, COMPARE_PASSWORD };
