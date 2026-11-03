# To Do it! — 미니프로젝트 #1

## 프로젝트 개요

**1단계 — 할 일 앱 화면 만들기**

React Native + Expo Router로 할 일 목록과 추가 입력 UI를 구현했습니다. 할 일 항목은 React의 `useState`로 관리하며 저장 기능은 구현하지 않습니다. 앱을 재시작하면 목록이 초기화됩니다.

## 개발 환경

- JavaScript / JSX
- React Native + Expo + Expo Router
- 상태 관리: React `useState`
- 외부 저장소, Firebase, OCR, 인증: **사용하지 않음**

## 구현 기능

1. 할 일 목록과 완료 상태 표시
2. 입력창에서 새 할 일 추가 (공백 입력 무시)
3. 체크박스로 완료 / 미완료 토글 및 즉시 UI 갱신
4. 목록이 비어 있으면 빈 상태 안내 표시
5. 전체·완료·남은 할 일 개수 및 달성률 UI 표시

수정, 삭제, 필터, 저장, 동기화, OCR은 MP1 범위에서 제외했습니다.

## 설치 및 실행

### 사전 준비

- Git, Node.js 및 npm 설치
- 휴대폰에 **Expo Go** 앱 설치 (iOS/Android)

### Windows (PowerShell)

```powershell
git clone <GitHub 저장소 주소>
cd ToDoIt
npm.cmd ci
npx.cmd expo start --go
```

### macOS (Terminal)

```bash
git clone <GitHub 저장소 주소>
cd ToDoIt
npm ci
npx expo start --go
```

프로젝트 담당자가 `package-lock.json`을 최신 상태로 커밋해야 `npm ci`가 정상 작동합니다. `src/app`은 Expo Router의 라우트 디렉터리이며 `package.json`의 진입점은 `expo-router/entry`입니다.

### 실행 방식

1. 휴대폰과 개발 PC를 같은 네트워크에 연결합니다.
2. `expo start --go` 실행 후 QR 코드를 확인합니다.
3. Android에서는 Expo Go, iOS에서는 카메라로 QR을 열어 앱을 실행합니다.
4. iPhone에서 Expo Go 계정 오류가 발생하면 Expo CLI와 Expo Go에 동일 계정으로 로그인합니다.

## 화면 구성

| 화면/상태 | 설명 |
|---|---|
| 대시보드/목록 | 앱 이름·날짜·달성률·할 일 개수·할 일 목록 표시 |
| 추가 입력 | 텍스트 입력 및 `+` 버튼으로 목록에 항목 추가 |
| 완료 상태 | 체크 시 완료 표시·취소선·달성률 즉시 갱신 |
| 빈 상태 | 할 일이 없을 때 안내 문구 표시 |

## 폴더 구조

```text
src/
├── app/
│   ├── _layout.jsx
│   └── index.jsx
├── components/
│   ├── TodoRow.jsx
│   ├── EmptyState.jsx
│   └── home/
│       ├── TodoScreen.jsx
│       ├── HomeOverview.jsx
│       ├── TodoListSection.jsx
│       └── TodoInputSection.jsx
├── hooks/
│   └── useHomeTodos.js
└── constants/
    ├── app.js   # 기존 파일 유지
    └── theme.js # 기존 파일 유지
```

`src/constants`는 기존 내용 그대로 유지합니다.

## 제출물

- 소스 코드: `src/app`, `src/components`, `src/hooks`, `src/constants` 및 실행에 필요한 설정 파일
- `README.md`: 이 문서
- `prompts_log.md`: AI 요청 및 채택·수정 판단 기록
- `screenshots/`: 실제 앱 화면 캡처 **목록·추가·완료·빈 상태 각 1장 이상**

## 보안 및 민감정보

Firebase 및 외부 인증 설정을 사용하지 않습니다. `.env`, `google-services.json`, `GoogleService-Info.plist`, 인증 토큰, API 키, 계정 비밀번호 등 민감한 항목은 제출하지 않습니다. `.gitignore` 규칙을 확인합니다.

## 테스트 체크리스트

- [ ] 최초 실행 시 빈 목록 문구 표시
- [ ] 새 할 일 추가 시 목록 즉시 변경
- [ ] 완료 체크 및 해제 시 상태 즉시 변경
- [ ] 전체·완료·남은 개수 및 달성률 업데이트
- [ ] 실행 절차와 기능 목록 문서화
- [ ] 실제 화면 4종 캡처
