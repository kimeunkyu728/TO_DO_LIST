# 적응형 로드맵 퀘스트 — Vercel 배포용 (완전 무료 / Groq)

`api/quest.js`가 Anthropic 유료 API 대신 **Groq 무료 티어**를 호출해요.
API 키는 서버에서만 쓰이고 브라우저 코드에는 절대 노출되지 않아요.

## 배포 방법 (AICE 사이트 때와 동일)

1. https://console.groq.com/keys 에서 무료 계정 만들고 API 키 발급
2. 이 폴더에서 배포
   ```
   vercel
   ```
3. Vercel 대시보드 → 프로젝트 → **Settings → Environment Variables**
   - Key: `GROQ_API_KEY`
   - Value: 방금 발급받은 키
   추가 후 다시 배포
   ```
   vercel --prod
   ```
4. 배포된 URL을 아이폰 사파리로 열고 "홈 화면에 추가"하면 앱처럼 설치돼요.

## 참고

- 모델은 `llama-3.3-70b-versatile` (Groq 무료 티어에서 제공). 필요하면 `api/quest.js`에서 다른 Groq 모델로 바꿀 수 있어요.
- 무료 티어는 분당/일일 요청 수 제한이 있는데, 이 앱은 목표 하나당 하루 1번만 호출하는 구조라 일반적인 사용량에서는 문제 없어요.
- Claude(Anthropic)보다 JSON 형식을 가끔 덜 정확하게 지킬 수 있어요. 이미 앱 쪽 파싱 로직이 앞뒤에 불필요한 텍스트가 붙어도 `{...}` 부분만 추출하도록 되어 있어서 웬만한 경우는 커버돼요. 그래도 "AI 응답 형식이 올바르지 않아요" 오류가 자주 뜨면 알려주세요 — 프롬프트를 더 다듬거나 다른 모델로 바꿀 수 있어요.
- 로컬 테스트는 `vercel dev`로 실행해야 서버 함수가 동작해요. `index.html`을 그냥 더블클릭해서 열면 "Failed to fetch"가 떠요.
- 나중에 마음이 바뀌면 `api/quest.js`만 Anthropic API 호출로 바꿔서 유료 전환도 가능해요 (이전 버전 코드는 대화 기록에 남아있어요).
