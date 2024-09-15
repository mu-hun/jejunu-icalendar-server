import { Type, Static } from '@sinclair/typebox';

const LectureTObject = Type.Object({
  estblScyr: Type.String({ description: '개설연도', examples: ['2024'] }),
  lsnYmd: Type.String({ description: '강의 일시', examples: ['20240912'] }),
  sbjctNm: Type.String({
    description: '강의 이름',
    examples: ['디지털영상처리'],
  }),
  cclctYn: Type.String({
    examples: ['Y', 'N'],
  }),
  splctYn: Type.String({
    examples: ['Y', 'N'],
  }),
  aftrSplctLttmSe: Type.Union([Type.String(), Type.Null()], {
    description: '수업 방법',
    examples: [null, '91'],
  }),
  untactLsnMthdSe: Type.Union([Type.String(), Type.Null()], {
    description: '수업 방법',
    examples: [null, '91'],
  }),
  lctrmNm: Type.Union([Type.String(), Type.Null()], {
    description: '강의실 위치',
    examples: ['공과4호D417'],
  }),
  empno: Type.String(),
  empnm: Type.String({ description: '교수 이름' }),
  bgngHr: Type.Union([Type.String(), Type.Null()], {
    description: '시작 시간',
    examples: ['14:00'],
  }),
  endHr: Type.Union([Type.String(), Type.Null()], {
    description: '시작 시간',
    examples: ['14:50'],
  }),
});

export const ResponseTObject = Type.Object({
  classTables: Type.Array(LectureTObject),
});

export type Lecture = Static<typeof LectureTObject>;
