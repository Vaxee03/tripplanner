# ✈️ 여행 플래너 (Trip Planner)

일정·예산·체크리스트를 동행자와 **실시간으로 함께** 짜고, 지도 동선 · 1/N 정산 · AI 맛집 추천까지 한곳에서 하는 여행 계획 서비스입니다.

| 항목 | 값 |
|---|---|
| 웹 | https://tripplanner.kr |
| 안드로이드 앱 | `kr.tripplanner.app` (Play 스토어) |
| 운영자 | 초보개발자 (basicdeveloper) |
| 가격 | 무료, 광고 없음 |

## 📌 주요 기능

| 영역 | 내용 |
|---|---|
| 여행 관리 | 여러 여행 만들기 · 수정 · 삭제 · 복제, 국내/해외 구분, Google Places 목적지 검색, D-day |
| 일정 | 날짜별 일정, 시간순 타임라인, 드래그 정렬, 지도에서 위치 찍기, 하루 동선 지도 |
| 함께 쓰기 | 초대 카드 · 링크 · 코드, 초대 수락 카드, 실시간 동기화, 방장/동행자 권한 |
| 예산 | 지출 기록, 결제자 · 분담자 지정, 1/N 정산 |
| 체크리스트 | 국내/해외 기본 준비물, 담당자 지정, 다른 여행에서 가져오기 |
| 예약정보 | 항공 · 숙소 · 투어 예약번호 · 링크 메모 |
| AI 맛집 추천 | Gemini 기반, 조건 입력, 일정에 바로 추가 |
| 후기 | 여행 종료 후 작성자별 후기 · 사진 |
| 공유 | 로그인 없는 공개 링크, 카카오톡 링크 미리보기, 캘린더(.ics) 내보내기 |
| 계정 | 이메일 · Google · 카카오 로그인 |
| 앱 전용 | 네이티브 소셜 로그인, 푸시 알림, 초대 링크로 앱 열기 |

## 🛠️ 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 프런트엔드 | React 19, react-router-dom 7, Vite 6 |
| 지도 | Google Maps JavaScript API, Places API |
| 백엔드 | Firebase (Auth · Firestore · Storage · Cloud Functions v2 · Hosting) |
| AI | Google Gemini (`@google/genai`) |
| 앱 | Capacitor 8 (Android), `@capacitor-firebase/*` |
| 테스트 | `@firebase/rules-unit-testing`, `node --test`, puppeteer-core |

## 🏗️ 아키텍처

별도 백엔드 서버 없이 **React SPA + Firebase**로 구성하고, 같은 웹 코드를 Capacitor로 감싸 안드로이드 앱을 만듭니다.

```text
[웹 브라우저 / 안드로이드 WebView]
   App.jsx ─ components/* ─ lib/data.js → Firestore(travelplanner)
      │                       └ lib/tripsApi.js ─→ Storage(후기 사진)
      ├ lib/firebase.js ─→ Firebase Auth (이메일 · Google · 카카오)
      └ httpsCallable ─→ Cloud Functions ─┬→ Gemini API
                                          ├→ FCM 푸시
                                          └→ Firestore(admin 권한)
```

```text
travel-planner/
├─ index.html       # 최초 프로토타입(레거시)
└─ web/             # 실제 서비스 코드 (React + Vite + Firebase)
   ├─ src/          # components, lib, styles
   ├─ functions/    # Cloud Functions
   ├─ android/      # Capacitor 안드로이드 프로젝트
   └─ tests/, e2e/  # 테스트
```

## 🚀 시작하기

```bash
cd web
cp .env.local.example .env.local   # Firebase · Maps 키 입력
npm install
npm run dev
```

자세한 설정(Firebase 프로젝트 생성, Maps API 키, 배포)은 [web/README.md](web/README.md)를 참고하세요.

## 📝 커밋 컨벤션

이모지 태그로 변경 종류를 표시합니다.

| 태그 | 의미 |
|---|---|
| ✨ Feat | 새 기능 |
| 🐛 Fix | 버그 수정 |
| 🔧 Chore | 설정 · 정리 |
| 📝 Docs | 문서 |
| 🔒 Security | 보안 |
| 🎨 Design | UI/UX |
| ✅ Test | 테스트 |
| 🔖 Release | 배포 버전 |
