## 0. 준비
- Git 설치
  - 과정 생략
- Node.js 설치 [최신 버전 링크](https://nodejs.org/en/download?utm_source=chatgpt.com)
  1. 터미널에 `node -v` 했을 때 버전이 26.13.0 LTS가 아닌 경우 아래 진행
  2. 링크 접속
  3. 버전 26.13.0 LTS 지정
  4. 하단에서 운영체제 선택
  5. 바로 아래의 .msi 또는 .pkg 파일 설치
  6. 받은 파일 열어서 설치 진행하면 됨
- Expo 계정 생성
  1. Expo 접속
  2. Google 계정으로 가입(권장)
    - 다른 방법으로 가입했는데 나중에 로그인 실패하는 경우 본인이 직접 해결해야 함
- Expo 팀 가입 신청
  1. 카톡으로 본인 이메일 전송
  2. 초대
  3. 각자 초대 수락
- 앱 설치(Android 전용)
  1. [설치하기](https://expo.dev/accounts/junsuhadas-team/projects/todo-it/builds/f49f047d-c16f-40be-bb10-fd39ce432d6c)
  2. 링크 들어가서 Install 클릭
  3. QR 찍으면 설치 됨


## 1. 프로젝트 Clone
#### Windows (PowerShell)
```shell
git clone <GitHub 저장소 URL>
cd ToDoIt
```


#### macOS (Terminal)
```shell
git clone <GitHub 저장소 URL>
cd ToDoIt
```

GitHub에서 프로젝트를 다운로드하고 프로젝트 디렉터리로 이동한다.


## 2. 패키지 설치
#### Windows
```shell
npm.cmd ci
```

#### macOS
```shell
npm ci
```

package-lock.json에 기록된 버전으로 프로젝트 의존성을 설치한다.

package-lock.json이 없는 경우에는 npm install을 사용한다.


## 3. 환경 설정
구글 드라이브의 Secure 폴더의 파일 2개를 전부 다운 받아서 루트에 위치

- GoogleService-Info.plist
- google-services.json


## 4. Expo
### 4-1. 최초 로그인
#### Windows
```shell
npx.cmd eas-cli@latest login --browser
```

#### macOS
```shell
npx eas-cli@latest login --browser
```

- 로그인하는 브라우저가 열리면 가입했던 방식으로 로그인


### 4-2. 로그인 확인
#### Windows:
```shell
npx.cmd expo whoami
```

#### macOS:
```shell
npx expo whoami
```

### 4-3. 로그아웃
#### Windows:
```shell
npx.cmd expo logout
```

#### macOS:
```shell
npx expo logout
```

### 4-4. 세션 만료 후 재로그인
#### Windows:
```shell
npx.cmd expo login
```

#### macOS:
```shell
npx expo login
```

## 5. 개발 서버 실행
프로젝트 루트에서 실행
#### Windows
```shell
npx.cmd expo start --dev-client --tunnel
```

#### macOS
```shell
npx expo start --dev-client --tunnel
```
- --dev-client: Expo Go가 아닌 프로젝트 전용 Development Build 사용
- --tunnel: 인터넷을 통해 개발 PC와 휴대폰 연결
- --lan: 동일한 Wi-Fi 환경에서 개발 PC와 휴대폰 연결
- --clear: Metro 캐시 초기화(수정 반영이 안 되면 사용)


## 6. 개발 중 실시간 화면 확인
##### Windows & Android
1. 0번 준비 단계에서 제공한 APK 설치 링크 접속
1. Install 클릭 후 QR 코드로 APK 다운로드
2. 다운로드한 APK 파일 실행
3. 필요한 경우 해당 브라우저 또는 파일 관리자의 '알 수 없는 앱 설치' 권한 허용
4. 설치 완료 후 To Do it! 실행
5. `5. 개발 서버 실행` 참고해서 서버 실행
6. 터미널에 출력된 QR 코드 스캔
7. 설치된 To Do it! 앱으로 연결

##### Mac & iOS
실제 iPhone 대신 Mac의 iOS 시뮬레이터에서 앱 실행
1. Mac App Store에서 Xcode 설치
2. Xcode에서 iOS Simulator 및 필요한 iOS 런타임 설치
3. 프로젝트 루트에 GoogleService-Info.plist가 있는지 확인
4. Xcode 및 CocoaPods 개발 환경 설정
5. 최초 실행
```shell
npx expo run:ios
```
5. iOS 네이티브 앱 빌드
5. iOS Simulator에 앱 설치 및 실행
6. 최초 실행 시 빌드 시간이 소요될 수 있음
7. 이후 실행은 아래 명령
```shell
npx expo start --dev-client
```
※ 시뮬레이터에서는 실제 카메라 촬영 기능을 테스트할 수 없으므로 OCR 촬영 기능은 실기기 테스트가 필요함.

##### iii) Windows & iOS
Windows에서는 Xcode를 실행할 수 없으므로 Web 환경을 통한 UI 개발을 권장함.
1. 웹 실행
```shell
npx.cmd expo start --web
```

##### iv) Mac & Android
생략


### 6-1. 새 APK를 직접 빌드해야 하는 경우(읽을 필요 없음)
#### Windows
```shell
npx.cmd eas-cli@latest build --platform android --profile development
```

#### macOS
```shell
npx eas-cli@latest build --platform android --profile development
```


## Development Build 재생성 (선택)

일반적인 개발 과정에서는 실행할 필요 없음.

다음 상황에서 새로운 Development Build가 필요할 수 있음.

네이티브 라이브러리를 추가하거나 변경한 경우

Android/iOS 네이티브 설정을 변경한 경우

기존 개발용 앱에 필요한 네이티브 모듈이 포함되지 않은 경우

> 다만 앞으로 변경될 이유가 없으므로 현재 필요 없음

#### Windows
```shell
npx.cmd eas-cli@latest build --platform android --profile development
```

#### macOS
```shell
npx eas-cli@latest build --platform android --profile development
```

코드를 변경했는데 실시간으로 앱에 반영되지 않으면 캐시 초기화

#### Windows
```shell
npx.cmd eas-cli@latest build --platform ios --profile development
```

#### macOS
```shell
npx eas-cli@latest build --platform ios --profile development
```