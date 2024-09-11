export function parseLectureStatus(lecture: Lecture): LectureStatus {
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
  return null;
}

export function mergeLectures(
  lectures: ReconstructedLecture[]
): ReconstructedLecture[] {
  return [];
}

export function lectureToICalEvent(lecture: ReconstructedLecture): string {
  return '';
}

export function iCalConverter(lectures: Lecture[]) {
  const reconstructedLectures = lectures.map((lecture) => {
    const status = parseLectureStatus(lecture);
    return reconstructedLecture(lecture, status);
  });

  const events = reconstructedLectures.map(lectureToICalEvent).join('\n\n');
  return `BEGIN:VCALENDAR
  VERSION:2.0

  ${events}

  END:VCALENDAR`.trim();
}
