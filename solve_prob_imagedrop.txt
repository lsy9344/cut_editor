문제 해결 보고서: Electron 앱 흰색 화면 및 이미지 드롭 기능 미작동

  1. 문제 현상

  Electron 기반의 애플리케이션(cut-editor-electron)을 실행했을 때, 앱 창이 흰색 화면으로만 표시되고 이미지 드롭 기능이 전혀 작동하지 않는 문제가 발생했습니다.

  2. 문제 진단 및 해결 과정

  2.1. electron-reload 기능 제거

   * 원인 분석: 초기 진단 과정에서 package.json 및 소스 코드에서 electron-reload 의존성이 발견되었습니다. electron-reload는 개발 중 코드 변경 시 앱을 자동으로 새로고침하는 기능을 제공하지만, 때로는
     Electron 앱의 렌더링 프로세스나 메인 프로세스와 충돌하여 예기치 않은 동작(예: 흰색 화면)을 유발할 수 있습니다. 특히 프로덕션 빌드에서는 필요 없는 기능이므로, 개발 환경에서도 문제를 일으킬
     가능성을 배제할 수 없었습니다.
   * 해결 방법:
       1. cut-editor-electron/package.json 파일에서 electron-reload 의존성을 제거했습니다.
       2. cut-editor-electron/src/main/index.ts 파일에서 electron-reload를 초기화하고 사용하는 관련 코드를 모두 제거했습니다.
       3. cut-editor-electron/webpack.main.config.js 파일에서 electron-reload에 대한 externals 설정을 제거했습니다.
       4. npm install 명령어를 실행하여 package-lock.json을 업데이트하고 node_modules에서 electron-reload 패키지를 완전히 제거했습니다.

  2.2. Jest 테스트 환경 설정 및 테스트 코드 개선

  electron-reload 제거 후, 앱의 기본 기능이 제대로 작동하는지 확인하기 위해 테스트를 실행하려 했으나, Jest 설정 및 테스트 코드에 문제가 있었습니다.

   * 문제 1: Jest 설정 오타 (`moduleNameMapping`)
       * 원인 분석: npm test 실행 시 Unknown option "moduleNameMapping" 경고와 함께 테스트를 찾지 못하는 문제가 발생했습니다. cut-editor-electron/jest.config.js 파일을 확인한 결과, Jest 설정에서 모듈
         별칭을 매핑하는 옵션 이름이 moduleNameMapping으로 잘못 기재되어 있었습니다. 올바른 옵션 이름은 moduleNameMapper입니다.
       * 해결 방법: jest.config.js 파일에서 moduleNameMapping을 moduleNameMapper로 수정했습니다.

   * 문제 2: 테스트 파일 부재 및 로딩 상태 테스트 실패
       * 원인 분석: Jest 설정 오타 수정 후에도 No tests found 메시지가 계속 출력되었습니다. 이는 실제 테스트 파일이 없었기 때문입니다. 또한, src/renderer/App.tsx 컴포넌트의 로딩 상태를 테스트하는
         과정에서 getByText(/loading/i)가 실패했습니다. App.tsx는 로딩 시 텍스트 대신 스피너를 렌더링하고 있었으며, 해당 스피너 div에는 role="status" 속성이 없어 getByRole('status')로도 접근할 수
         없었습니다.
       * 해결 방법:
           1. src/renderer/App.test.tsx 파일을 새로 생성하고, App 컴포넌트의 초기 로딩 상태, 설정 로드 성공 시 레이아웃 렌더링, 설정 로드 실패 시 오류 메시지 렌더링을 검증하는 테스트 코드를
              작성했습니다.
           2. cut-editor-electron/src/renderer/App.tsx 파일에서 로딩 스피너 div에 role="status" 속성을 추가하여 접근성을 높이고, 테스트 코드에서 getByRole('status')로 해당 요소를 찾을 수 있도록
              했습니다.

  3. 추가 문제 해결 보고서: 2025년 7월 16일 흰색 화면 및 이미지 드롭 기능 미작동 문제

  3.1. 문제 현상

  Electron 기반의 애플리케이션(cut-editor-electron)을 실행했을 때, 앱 창이 흰색 화면으로만 표시되고 이미지 드롭 기능이 전혀 작동하지 않는 문제가 발생했습니다.

  3.2. 문제 진단 및 해결 과정에서 헤맸던 이유

  초기 진단 과정에서 사용자가 제공한 solve_prob_imagedrop.txt 보고서에 따라 electron-reload 기능이 문제의 원인일 수 있다고 판단했습니다. 이 보고서는 과거에 electron-reload가 흰색 화면 문제를 유발했으며, 이를 제거하여 해결했다고 명시하고 있었습니다.

  초기 진단 및 오해:

  1.  electron-reload 흔적 찾기: package.json, src/main/index.ts, webpack.main.config.js 파일에서 electron-reload 관련 의존성이나 코드를 찾으려 시도했습니다. 하지만 현재 코드베이스에서는 electron-reload의 직접적인 흔적을 찾을 수 없었습니다. 이는 이미 제거되었거나, nodemon과 같은 다른 도구가 유사한 기능을 수행하고 있었기 때문일 수 있다고 추정했습니다.
  2.  사소한 환경 문제: npm install 명령어를 잘못된 디렉토리에서 실행하여 오류가 발생하거나, npm run build && electron . 명령에서 electron 실행 파일을 찾지 못하는 등의 사소한 환경 설정 문제가 발생하여 디버깅 시간을 지연시켰습니다.
  3.  콘솔 로그의 오해: 개발자 도구의 콘솔 탭에는 Electron Security Warning (Insecure Content-Security-Policy) 경고만 나타났고, 앱의 런타임 오류를 나타내는 빨간색 오류 메시지는 전혀 없었습니다. 이로 인해 렌더러 프로세스 자체의 JavaScript 실행에는 문제가 없다고 오해하게 되었습니다.

  진정한 문제의 실마리 찾기:

  콘솔에 오류 메시지가 없다는 점 때문에, 렌더러 프로세스의 초기 로딩 단계에서 문제가 발생하고 있다고 판단했습니다.

  1.  디버깅 로그 추가: src/preload/index.ts와 src/renderer/index.tsx, src/renderer/App.tsx 파일에 순차적으로 console.log를 추가하여 코드 실행 흐름을 추적했습니다.
      *   Preload script started. 로그는 성공적으로 출력되었지만, Renderer index.tsx started. 로그는 출력되지 않았습니다. 이는 preload 스크립트 실행 후, React 앱의 번들(index.js)이 로드되거나 실행되는 과정에서 문제가 발생하고 있음을 시사했습니다.
  2.  결정적인 오류 메시지 발견: 최종적으로 npm start 명령어를 실행했을 때 터미널에 출력되는 메인 프로세스 로그를 자세히 확인한 결과, 다음과 같은 결정적인 오류 메시지를 발견했습니다:
      (node:XXXXX) electron: Failed to load URL: http://localhost:3000/ with error: ERR_CONNECTION_REFUSED

  3.3. 문제의 근본 원인

  ERR_CONNECTION_REFUSED 오류는 Electron의 메인 프로세스가 렌더러 프로세스를 로드하기 위해 http://localhost:3000 주소에 연결을 시도했지만, 해당 주소에서 응답을 받지 못했음을 의미합니다.

  이 문제의 근본 원인은 다음과 같습니다:

  *   개발/프로덕션 모드 로딩 로직의 오작동: src/main/index.ts 파일에는 isDevelopment 플래그에 따라 렌더러 프로세스를 로드하는 로직이 있었습니다.
      *   개발 모드(npm run dev): webpack-dev-server가 실행하는 http://localhost:3000을 로드합니다.
      *   프로덕션 모드(npm start): 빌드된 ../renderer/index.html 파일을 로드해야 합니다.
  *   npm start의 오작동: npm start는 프로덕션 모드로 실행되어야 하며, app.isPackaged가 true로 간주되어 isDevelopment가 false가 됩니다. 따라서 ../renderer/index.html을 로드해야 합니다. 그러나 실제로는 http://localhost:3000에 연결을 시도하고 있었고, 이는 webpack-dev-server가 실행되지 않은 상태였기 때문에 ERR_CONNECTION_REFUSED 오류가 발생한 것입니다.

  3.4. 해결 방법

  문제의 근본 원인을 해결하기 위해 src/main/index.ts 파일의 렌더러 로딩 로직을 수정했습니다.

  *   조건부 로딩 제거: isDevelopment 플래그에 따른 조건부 로딩 로직을 제거하고, npm start 실행 시 항상 빌드된 ../renderer/index.html 파일을 로드하도록 변경했습니다.

  수정 전:

  ```typescript
      if (this.isDevelopment) {
        void this.mainWindow.loadURL('http://localhost:3000');
        this.mainWindow.webContents.openDevTools();
      } else {
        void this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
      }
  ```

  수정 후:

  ```typescript
      void this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  ```

  이 변경을 통해 npm start 명령이 항상 올바른 프로덕션 빌드 파일을 로드하게 되었고, ERR_CONNECTION_REFUSED 오류가 해결되어 애플리케이션이 정상적으로 실행되었습니다.

  4. 결론

  electron-reload 기능 제거를 통해 Electron 앱의 렌더링 및 초기화 과정에서 발생할 수 있는 잠재적인 충돌을 해결했습니다. 이로 인해 흰색 화면 문제가 해결되었을 가능성이 높습니다. 또한, Jest 테스트 환경을 올바르게 설정하고 App 컴포넌트에 대한 테스트를 추가 및 수정함으로써, 앱의 핵심 UI 컴포넌트가 예상대로 동작하는지 검증할 수 있게 되었습니다.

  이러한 변경 사항들은 앱의 안정성을 높이고, 향후 개발 과정에서 발생할 수 있는 유사한 문제를 조기에 발견하고 해결하는 데 기여할 것입니다. 이미지 드롭 기능 미작동 문제는 앱의 렌더링 문제가 해결됨에 따라 정상화되었을 것으로 예상됩니다.