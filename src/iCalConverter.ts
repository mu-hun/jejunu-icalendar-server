export function parseLectureStatus(lecture: Lecture): LectureStatus {
  const hasLeadingNine = (str: string | null) => str?.[0] == '9';

  const isRecordedLecture = hasLeadingNine(lecture.aftrSplctLttmSe);

  if (lecture.cclctYn == 'Y')
    return isRecordedLecture ? '온라인(녹화)' : '휴강';

  if (lecture.splctYn == 'Y') {
    const isLiveStreamLecture = hasLeadingNine(lecture.untactLsnMthdSe);

    if (isRecordedLecture) return '온라인(녹화)';
    if (isLiveStreamLecture) return '온라인(실시간)';

    return '보강';
  }

  return '일반';
}

/**
 * @param date string @example '20240909'
 * @param time string @example '09:00'
 * @returns string @example '20240909T090000'
 */
export function formatToICalDate(date: string, time: string) {
  return `${date}T${time.replace(':', '')}00`;
}

export function reconstructedLecture(
  lecture: Lecture,
  status: LectureStatus
): ReconstructedLecture {
  if (status == '휴강') return null;

  const startTime = formatToICalDate(lecture.lsnYmd, lecture.bgngHr);
  const endTime = formatToICalDate(lecture.lsnYmd, lecture.endHr);

  return {
    startTime,
    endTime,
    date: lecture.lsnYmd,
    name: lecture.sbjctNm,
    lecturer: lecture.empnm,
    ...(status == '온라인(실시간)' || status == '온라인(녹화)'
      ? { status, location: null }
      : { status, location: lecture.lctrmNm }),
  };
}

export function mergeLectures(lectures: ReconstructedLecture[]) {
  return lectures
    .filter((lecture) => lecture !== null)
    .reduce((reducing, lecture) => {
      if (reducing.length === 0) return [lecture];
      const previousLecture = reducing.at(-1)!;

      if (previousLecture.name === lecture.name) {
        const status = (() => {
          if (previousLecture.status !== '일반') return previousLecture.status;
          if (lecture.status !== '일반') return lecture.status;
          return '일반';
        })();

        previousLecture.endTime = lecture.endTime;
      } else {
        reducing.push(lecture);
      }

      return reducing;
    }, [] as Exclude<ReconstructedLecture, null>[]);
}

export function lectureToICalEvent(
  lecture: Exclude<ReconstructedLecture, null>
): string {
  return `BEGIN:VEVENT
DTSTART;TZID=Asia/Seoul:${lecture.startTime}
DTEND;TZID=Asia/Seoul:${lecture.endTime}
SUMMARY:${lecture.name}${
    lecture.status !== '일반' ? ` - ${lecture.status}` : ''
  }${lecture.location ? `\nLOCATION:${lecture.location}` : ''}
DESCRIPTION:${lecture.lecturer}
END:VEVENT`.trim();
}

export function iCalConverter(lectures: Lecture[]) {
  const reconstructedLectures = lectures
    .filter((lecture) => lecture !== null)
    .map((lecture) => {
      const status = parseLectureStatus(lecture);
      return reconstructedLecture(lecture, status);
    })
    .filter(
      (lecture): lecture is Exclude<ReconstructedLecture, null> =>
        lecture !== null
    );

  const events = mergeLectures(reconstructedLectures)
    .map(lectureToICalEvent)
    .join('\n\n');
  return `BEGIN:VCALENDAR
VERSION:2.0

${events}

END:VCALENDAR
`;
}
