# React Todo Weather App

인터넷 기초 React 기반 Todo 앱 기능 확장 프로젝트입니다.

## 사용 기술

- Node.js 20 LTS
- Vite 6
- React 19
- Tailwind CSS 4
- Zustand
- OpenWeatherMap API

## 구현 기능

- Todo 추가, 목록 표시, 완료 토글, 삭제
- Todo 인라인 편집: 항목 더블클릭 → input 전환 → Enter 또는 포커스 아웃 시 저장, Escape 취소
- 완료 항목 구분 표시: 완료 항목을 구분선 아래로 분리하고 `완료된 항목 N개` 표시
- 남은 할 일 카운트 배지
- 검색 및 전체 / 미완료 / 완료 필터
- 우선순위 높음 / 보통 / 낮음 설정 및 정렬
- 마감일 지정, 오늘 마감 / 마감 초과 강조
- OpenWeatherMap 날씨 API 연동
- 날씨 상태에 따른 배경 테마 변경
- localStorage 기반 Todo 상태 유지

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

## 날씨 API 키 설정

프로젝트 루트의 `.env` 파일에 OpenWeatherMap API 키를 입력합니다.

```env
VITE_OPENWEATHER_KEY=발급받은_API_KEY
```

`.env` 파일을 수정했다면 개발 서버를 종료한 뒤 다시 실행해야 합니다.

```bash
Ctrl + C
npm run dev
```

## 제출 시 주의

`node_modules`와 `dist` 폴더는 제외하고 압축합니다.

```bash
zip -r ../todo-react-app-submit.zip . -x "node_modules/*" "dist/*"
```
