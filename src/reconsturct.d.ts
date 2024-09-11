type LectureStatus =
  | '일반'
  | '보강'
  | '휴강'
  | '온라인(실시간)'
  | '온라인(녹화)';

type ReconstructedLecture =
  | ({
      /** Date String
       * @example 19980119
       */
      date: string;
      /** Date String with local timezone
       * @example 19980119T070000
       */
      startTime: string;
      /** Date String with local timezone
       * @example 19980119T070000
       */
      endTime: string;
      name: string;
      /**
       * @example '김철수'
       */
      lecturer: string;
    } & (
      | {
          status: Exclude<
            LectureStatus,
            '휴강' | '온라인(실시간)' | '온라인(녹화)'
          >;
          location: string;
        }
      | {
          status: Extract<LectureStatus, '온라인(실시간)' | '온라인(녹화)'>;
          location: null;
        }
    ))
  // 휴강인 경우에는 null 을 반환
  | null;
