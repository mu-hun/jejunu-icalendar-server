# 제주대학교 포털 강의 시간표 icalendar 포멧 컨버터

[![Test · Workflow runs](https://github.com/mu-hun/jejunu-icalendar-server/workflows/Test/badge.svg)](https://github.com/mu-hun/jejunu-icalendar-server/actions/workflows/test.yml)

## 보강, 휴강, 온라인 판단 로직

```js
const isNine = (str) => str && str.substr(0, 1) == '9';

if (item['cclctYn'] == 'Y') {
  if (isNine(item['aftrSplctLttmSe'])) {
    // 온라인 영상
    td += '<span class="label label-red">온</span>';
  } else {
    td += '<span class="label label-cancle">휴</span>';
  }
} else if (item['splctYn'] == 'Y') {
  const isUntactNine = isNine(item['untactLsnMthdSe']);
  const isAftrNine = isNine(item['aftrSplctLttmSe']);

  if (isUntactNine && isAftrNine) {
    // 온라인 (녹화)
    td += '<span class="label label-red">온</span>';
  } else if (isUntactNine) {
    // 온라인 (실시간)
    td += '<span class="label label-blue">온</span>';
  } else {
    td += '<span class="label label-supplement">보</span>';
  }
}
```
