type Lecture = {
  /** 개설연도
   * @example '2024'
   */
  estblScyr: string;
  /** 강의 일시
   * @example '20240912'
   */
  lsnYmd: string;
  /** 강의 이름
   * @example '디지털영상처리'
   */
  sbjctNm: string;
  /**
   * @example 'Y'
   * @example 'N'
   */
  cclctYn: string;
  /**
   * @example 'Y'
   * @example 'N'
   */
  splctYn: string;
  /** 수업 방법
   * @example null
   * @example '91'
   */
  aftrSplctLttmSe: string | null;
  /** 수업 방법
   * @example null
   * @example '91'
   */
  untactLsnMthdSe: string | null;
  /** 강의실 위치
   * @example '공과4호D417'
   */
  lctrmNm: string;
  empno: string;
  /** 교수 이름 */
  empnm: string;
  /** 시작 시간
   * @example '14:00'
   */
  bgngHr: string;
  /** 종료 시간
   * @example '14:50'
   */
  endHr: string;
};
