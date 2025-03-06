import puppeteer from 'puppeteer';
import { Value } from '@sinclair/typebox/value';
import { upload } from './aws';
import { username, password, START_YYYYMMDD, END_YYYYMMDD } from './env';
import { iCalConverter } from './iCalConverter';
import { ResponseTObject } from './response';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://portal.jejunu.ac.kr/login.htm');

  await page.type('#userId', username);
  await page.type('#userPswd', password);

  await page.click('[type="submit"]');

  await page.waitForNavigation();

  const response = await page.goto(
    `https://portal.jejunu.ac.kr/api/patis/timeTable.jsp?sttLsnYmd=${START_YYYYMMDD}&endLsnYmd=${END_YYYYMMDD}`
  );

  if (response?.ok()) {
    const { classTables } = Value.Parse(ResponseTObject, await response.json());

    upload(iCalConverter(classTables));
  } else {
    console.error('Failed to fetch the data');
  }

  await browser.close();
})();
