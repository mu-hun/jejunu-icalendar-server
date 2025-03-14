import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (
  !process.env.username ||
  !process.env.password ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.START_YYYYMMDD ||
  !process.env.END_YYYYMMDD
)
  throw new Error('Please provide the environment variables');

const {
  username,
  password,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  START_YYYYMMDD,
  END_YYYYMMDD,
} = process.env;

export {
  username,
  password,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  START_YYYYMMDD,
  END_YYYYMMDD,
};
