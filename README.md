📅 제주대학교 강의 시간표 데이터를 매일 갱신하여 기기의 기본 캘린더 클라이언트(Google, Apple Calendar 등)에서 구독할 수 있는 icalendar 서버를 구축하는 웹 오토메이션 프로젝트입니다.

|                                                                   [컨버터 명세](src/tests/index.test.ts) 커버리지                                                                   |                                                                                 AWS S3 업로드 상태                                                                                  |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| [![Test · Workflow runs](https://github.com/mu-hun/jejunu-icalendar-server/workflows/Test/badge.svg)](https://github.com/mu-hun/jejunu-icalendar-server/actions/workflows/test.yml) | [![cron · Workflow runs](https://github.com/mu-hun/jejunu-icalendar-server/workflows/cron/badge.svg)](https://github.com/mu-hun/jejunu-icalendar-server/actions/workflows/cron.yml) |

## 작업 동기

지난 학기<sup>(2024년 1학기)</sup>, 강의 일정의 잦은 변동(공휴일 대체 수업, 교수님의 개인 사정으로 인한 휴강 등)을 제주대학교 포털 웹 서비스를 통해 확인하는 과정에서 아래와 같은 불편을 반복적으로 겪었습니다:

1. 포털 서비스의 **로딩 경험**과 **응답성**이 상당히 부족합니다.
   - **웹 서비스 로그인 지연**: 로그인 과정에서 필수가 아닌 부가적인 내부 로직으로 인해 약 3초가량 불필요한 지연이 발생하고 있습니다. 이에 임시 해결책으로 [SSO 요청만 바로 수행하는 유저스크립트](https://github.com/mu-hun/jejunu-sw/blob/e190950/portal.user.js#L21-L23)를 직접 작성해서 개인적으로 이용하고 있습니다.
     - 후술할 애플 [비공개 릴레이] 활성화와 무관한 기술적 문제입니다.
   - **불안정한 앱 서비스**: 앱 실행 후 잠시 다른 작업을 하거나 몇 분 후에 다시 앱으로 복귀하면 흰 화면만 표시됩니다. 이 경우 앱을 강제 종료하고 재실행해야 사용이 가능합니다. [재현 영상 첨부](https://youtube.com/shorts/qfZ4gfhK5WA)
2. iOS 환경의 제약: iOS에서 [비공개 릴레이]를 활성화할 경우, 포털 웹 및 앱 서비스의 요청 지연이 사용이 불가능할 정도로 길어져 데스크탑 환경을 주로 이용해야 했습니다.
3. iOS Safari 호환성(해결됨): iPhone에서 포털 로그인 페이지 로드가 되지 않는 문제가 자주 발생했습니다.

   <img width="200px" src="screenshots/ios-safari-portal-jejunu-cant-load.webp" alt="네트워크 서버에 연결할 수 없기 때문에 Safari가 해당 페이지를 열 수 없습니다."/>

[비공개 릴레이]: (https://support.apple.com/ko-kr/102602)

이와 같은 문제를 해결하기 위해 강의 시간표 데이터를 매일 갱신하여 [icalendar 표준](https://icalendar.org/) 형식의 `.ics` 파일로 변환하여, 이를 외부 캘린더 클라이언트(Google Calendar, Apple Calendar 등)에서 구독할 수 있도록 지원하는 HTTP GET 서버 파이프라인을 구축했습니다.

![showcases](screenshots/showcases.webp)

이전보다 시간표 변동 사항을 기기에서 바로 확인하는 편리한 경험을 누리고 있는 중입니다.

## 테스트 주도 구현

휴강, 보강, 연강 등 다양한 경우를 포함한 제주대학교 포털의 [강의 시간표 데이터 스키마를 분류](src/response.ts#L44)하고, 이를 작업 과정에서 보다 쉽게 식별할 수 있도록 [재구성한 강의 형식]을 준비했습니다. 각 경우에 적합한 입력 데이터를 준비하고, 해당 데이터의 기대 출력도 함께 정의하여 테스트에 활용했습니다.

[재구성한 강의 형식]: src/reconsturct.d.ts#L8_L41

재구성한 강의 형식을 기반으로 단위 테스트를 우선 작성한 후, icalendar 형식으로 변환하는 유틸리티를 구현하였으며 통합 테스트를 통해 변환 과정의 정확성을 검증했습니다.

1. 단위 테스트 케이스 준비 작업
   - 강의 시간표의 다양한 상황(휴강, 보강 등)을 반영한 [단위 테스트 케이스 세트](src/tests/testcases.json)을 작성했습니다.
2. 단위 테스트 명세 작성
   - 준비한 테스트 케이스 입력을 기반으로 [테스트 명세](src/tests/index.test.ts#L17-L77)를 작성하고, 유틸리티 구현은 [`src/iCalConverter.ts`](`src/iCalConverter.ts)에서 진행했습니다.
     - [#L3-L21](src/iCalConverter.ts#L40-L59): 포털 강의 시간표 데이터에서 일반 강의, 휴강, 보강, 연강을 구분하는 유틸리티
     - [#L40-L59](src/iCalConverter.ts#L40-L59): 포털 강의 시간표 데이터를 [재구성한 강의 형식]으로 변환하는 유틸리티
     - [#L61-L82](src/iCalConverter.ts#L61-L82): 연강 시간표를 하나로 병합하는 유틸리티
     - [#L84-L95](src/iCalConverter.ts#L84-L95): 재구성한 데이터를 icalendar 이벤트 형식으로 변환하는 유틸리티
3. 통합 테스트 전용 덤프 데이터 및 기대 출력 파일 준비
   - 강의 시간표 [샘플 덤프 데이터]와 기대 출력 [`.ics` 파일](src/tests/excepted.ics)을 준비하고, [통합 테스트](src/tests/index.test.ts#L79-L86)를 통해 전체 변환 과정을 검증했습니다.

[샘플 덤프 데이터]: src/tests/response.json

## 관리 시 참고 사항

### 제주대학교 포털에서 시간표 데이터 받기

- GET https://portal.jejunu.ac.kr/api/patis/timeTable.jsp
- query params: -`sttLsnYmd`, `endLsnYmd` 값 형태는 `YYYYMMDD`

> 예) https://portal.jejunu.ac.kr/api/patis/timeTable.jsp?sttLsnYmd=20240902&endLsnYmd=20241221

위 HTTP GET 요청 전 제주대학교 포털 로그인을 거쳐야 합니다.

### 응답 예시

강의 시간표 [샘플 덤프 데이터]를 참고 바랍니다.
