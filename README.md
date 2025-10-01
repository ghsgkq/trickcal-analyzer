# 🎮 트릭컬 리바이브 결제 내역 분석기 (Google & Apple)

이 프로젝트는 **Google Play**와 **Apple App Store**의 결제 내역 데이터를 분석하여, 특정 게임("트릭컬 리바이브")에 대한 지출 내역을 시각적으로 보여주는 클라이언트 사이드 웹 애플리케이션입니다.

두 개의 독립된 분석기 페이지를 통해 각 플랫폼의 데이터를 처리합니다.

  - **Google Play 분석기**: `Order History.json` 파일 사용
  - **Apple App Store 분석기**: `reportaproblem.apple.com`에서 저장한 HTML 파일 사용

## ✨ 주요 기능

  - **양대 스토어 지원**: Google Play(JSON)와 Apple App Store(HTML)의 결제 내역 파일을 모두 지원합니다.
  - **게임별 필터링**: '트릭컬 리바이브' 관련 결제 내역만 자동으로 필터링하여 분석합니다.
  - **다양한 요약 정보**:
      - 총 결제 금액
      - '데일리 3종' 총 결제액
      - '리바이브/트릭컬 패스' 총 결제액
      - '사복 패스' 총 결제액
  - **인터랙티브 월별 리포트**:
      - 월별 총 결제액을 아코디언 형태로 제공하며, 클릭 시 해당 월의 상세 결제 내역을 펼쳐볼 수 있습니다.
      - 월별 지출 추이를 시각적으로 보여주는 반응형 막대 차트가 함께 제공됩니다.
  - **강력한 필터링 및 검색**:
      - '전체 결제 내역' 테이블에서 특정 상품명(예: "데일리")을 실시간으로 검색할 수 있습니다.
      - 미리 정의된 카테고리(예: '사복 패스') 버튼을 클릭하여 빠르게 필터링할 수 있습니다.
  - **개인정보 보호**: 모든 파일 처리와 데이터 분석은 사용자의 웹 브라우저 안에서만 이루어지며, 어떠한 정보도 외부 서버로 전송되지 않습니다.

## 🚀 사용 방법

1.  이 프로젝트의 모든 파일을 다운로드하여 한 폴더에 저장합니다.
2.  로컬 테스트 서버를 실행합니다. (VS Code의 `Live Server` 확장 프로그램 사용을 권장)
3.  분석하고 싶은 플랫폼에 따라 아래의 파일을 엽니다.
      - **Google Play**: `index.html`
      - **Apple App Store**: `apple_index.html`
4.  각 페이지의 안내에 따라 준비된 데이터 파일을 업로드하면 즉시 분석 결과를 확인할 수 있습니다.

## 📥 데이터 파일 다운로드 방법

### Google Play (`Order History.json`)

1.  **[Google Takeout](https://takeout.google.com/)** 사이트에 접속하여 로그인합니다.
2.  **`모두 선택 해제`** 후, **`Google Play 스토어`** 항목만 체크합니다.
3.  `모든 Play 스토어 데이터 포함됨` 버튼을 눌러 \*\*`주문 내역`\*\*만 선택합니다.
4.  내보내기를 생성하고, 이메일로 전송된 링크를 통해 `.zip` 파일을 다운로드합니다.
5.  압축 해제 후 `Takeout/Google Play 스토어/` 폴더 안의 **`Order History.json`** 파일을 사용합니다.
6.  자세한 내용은 \*\*[Google 가이드 페이지(guide.html)](https://ghsgkq.github.io/trickcal-analyzer/guide.html)\*\*를 참고하세요.

### Apple App Store (HTML)

1.  \*\*[Apple 문제 신고 사이트](https://reportaproblem.apple.com/)\*\*에 접속하여 로그인합니다.
2.  페이지 맨 아래까지 **모든 과거 내역이 표시될 때까지 스크롤**을 반복합니다.
3.  브라우저의 '페이지 저장' 기능(단축키: `Ctrl+S` 또는 `Cmd+S`)을 실행합니다.
4.  파일 형식을 \*\*`웹페이지, 전체`\*\*로 선택하고 저장하여 생성된 **`.html` 파일**을 사용합니다.
5.  자세한 내용은 \*\*[Apple 가이드 페이지(apple\_guide.html)](https://ghsgkq.github.io/trickcal-analyzer/apple_guide.html)\*\*를 참고하세요.

## 🛠️ 사용된 기술

  - HTML
  - CSS
  - JavaScript (Vanilla JS)