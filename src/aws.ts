import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from './env';

const client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const upload = (data: string) =>
  client.send(
    new PutObjectCommand({
      Bucket: 'jejunu.muhun.dev',
      Key: 'timetable/data.ics',
      Body: data,
    })
  );
