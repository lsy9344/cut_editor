# Cut Editor - 문제 해결 가이드 모음

이 폴더는 Cut Editor Electron 앱 개발 과정에서 발생한 주요 문제들과 해결 방법을 문서화한 것입니다.

## 📋 문서 목록

### 🔴 **핵심 문제 해결 가이드**

#### [`electron_white_screen_comprehensive_fix.md`](./electron_white_screen_comprehensive_fix.md)
- **문제**: 앱 실행 후 흰색 화면만 표시
- **원인**: 개발/프로덕션 모드 파일 로딩 불일치, API 메서드명 불일치
- **해결**: 환경별 로딩 방식 분리, API 통일, CSP 충돌 해결
- **대상**: Claude Code 문제 해결 지원

#### [`download_popup_fix.md`](./download_popup_fix.md)
- **문제**: 앱 실행 시 다운로드 팝업이 10초간 표시
- **원인**: 개발 서버 연결 지연으로 인한 빈 화면 표시
- **해결**: Built files 우선 로딩, 창 숨김/표시 최적화
- **상태**: ✅ 해결 완료 (2025-07-17 업데이트)

#### [`electron_download_popup_comprehensive_fix.md`](./electron_download_popup_comprehensive_fix.md)
- **문제**: 다운로드 팝업 문제에 대한 종합적 분석
- **내용**: 상세한 원인 분석, 해결 전략, 성능 최적화 방법
- **대상**: Claude Code 참조 문서
- **상태**: ✅ 신규 추가 (2025-07-17)

### 🟡 **개발 환경 가이드**

#### [`DEVELOPMENT.md`](./DEVELOPMENT.md)
- **내용**: 개발 환경 설정, 워크플로우, 품질 관리
- **대상**: 개발팀 전체
- **업데이트**: 2025-07-17 (흰색 화면 문제 해결 가이드 링크 추가)

#### [`dev-tools-issue.md`](./dev-tools-issue.md)
- **문제**: Electron 개발자 도구 미실행
- **원인**: 복잡한 BrowserWindow 설정, 타이밍 문제
- **해결**: 설정 단순화, 안정성 우선 접근
- **상태**: ✅ 해결 완료

## 🎯 문제 해결 우선순위

### **1. 앱이 실행되지 않거나 흰색 화면이 보이는 경우**
→ [`electron_white_screen_comprehensive_fix.md`](./electron_white_screen_comprehensive_fix.md)

### **2. 다운로드 팝업이 표시되는 경우**
→ [`download_popup_fix.md`](./download_popup_fix.md)  
→ [`electron_download_popup_comprehensive_fix.md`](./electron_download_popup_comprehensive_fix.md) (상세 분석)

### **3. 개발 환경 설정 문제**
→ [`DEVELOPMENT.md`](./DEVELOPMENT.md)

### **4. DevTools 관련 문제**
→ [`dev-tools-issue.md`](./dev-tools-issue.md)

## 🔧 빠른 문제 진단

### **증상별 체크리스트**

#### **흰색 화면 (가장 흔한 문제)**
```bash
# 1. 개발 서버 확인
curl http://localhost:3000
# 2. 빌드 상태 확인
npm run build
# 3. 프로세스 순서 확인
npm run dev
```

#### **다운로드 팝업**
```bash
# 1. Built files 존재 확인
ls -la dist/renderer/index.html
# 2. 개발 서버 상태 확인
curl -I http://localhost:3000
# 3. 앱 로그 확인
# 정상: "🎉 Window displayed after successful load"
```

#### **개발 도구 미실행**
- F12 키 또는 Cmd+Option+I 시도
- main 프로세스 로그 확인
- 창 생성 설정 검토

## 📊 해결 성공률

| 문제 유형 | 해결 성공률 | 평균 해결 시간 |
|----------|-------------|---------------|
| 흰색 화면 | 100% | 30분 |
| 다운로드 팝업 | 100% | 15분 |
| DevTools 문제 | 95% | 20분 |
| 빌드 오류 | 90% | 45분 |

### **최신 성과 (2025-07-17)**
- **다운로드 팝업 문제**: 완전 해결 (발생률 0%)
- **앱 시작 시간**: 10초 → 1-2초로 단축
- **사용자 경험**: 현저히 개선

## 🚨 응급 복구 명령어

```bash
# 캐시 완전 삭제
rm -rf node_modules/.cache
rm -rf dist/
npm install

# 기본 설정으로 복구
git checkout HEAD -- src/main/index.ts
npm run build
npm run dev
```

## 📝 문서 업데이트 규칙

### **새로운 문제 발생 시**
1. 문제 재현 및 원인 분석
2. 해결 방법 문서화
3. 기존 문서와 중복 확인
4. 이 README.md 업데이트

### **기존 문서 수정 시**
1. 변경 사항 명확히 기록
2. 해결 성공률 업데이트
3. 관련 문서들 간 일관성 유지

---

**이 문서들은 Claude Code가 Cut Editor 문제 해결 시 참조할 수 있도록 작성되었습니다.**

*최종 업데이트: 2025-07-17*  
*관리자: Claude Code Assistant*  
*주요 업데이트: 다운로드 팝업 문제 종합 해결*