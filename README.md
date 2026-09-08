# 공덕규's Portfolio

> 👉🏻 [cleolclcyu-portfolio.vercel.app] (https://cleolclcyu-portfolio.vercel.app/)

React와 TypeScript를 기반으로 제작한 개인 포트폴리오 웹사이트입니다.

경력, 기술 스택, 프로젝트, 활동, 블로그 등의 정보를 한 페이지에서 확인할 수 있으며,  
**Word Cloud + AI Chatbot**을 통해 포트폴리오 내용을 기반으로 질문하고 답변을 받을 수 있도록 구현했습니다.

---

## 🔗 Project

- **Frontend**: React + TypeScript + Vite
- **Database**: Supabase
- **AI**: Groq API
- **Deployment**: Vercel

---

## ✨ Features

### Portfolio

포트폴리오 정보를 Section 단위로 구성했습니다.

- About Me
- Word Cloud + AI Chatbot
- Career
- Skill
- Project
- Activity
- Blog
- Contact

### Word Cloud

나를 나타내는 키워드를 Word Cloud 형태로 표현했습니다.

키워드를 선택하면 해당 키워드에 연결된 대표 질문을 확인할 수 있습니다.

### AI Chatbot

선택한 키워드와 포트폴리오 데이터를 기반으로 질문에 답변합니다.

```text
Keyword
   ↓
Question / Answer
   ↓
User Question
   ↓
Supabase Edge Function
   ↓
Groq API
   ↓
Answer
````

포트폴리오 데이터는 `keyword → question → answer` 형태로 관리합니다.

### Career Timeline

세로 스크롤에 따라 Career Timeline이 가로로 이동하도록 구현했습니다.

현재 스크롤 위치를 기준으로 Timeline의 진행률을 계산하고 `translateX()`를 이용해 이동시킵니다.

### Project Modal

프로젝트 카드를 클릭하면 상세 정보를 Modal로 확인할 수 있습니다.

* 프로젝트 설명
* 기술 스택
* 역할
* 참여 인원
* 프로젝트 기간
* 프로젝트 상세 내용
* 프로젝트 이미지
* GitHub 링크
* 프로젝트 링크

ESC 키, 닫기 버튼, Modal 외부 영역 클릭을 통해 Modal을 닫을 수 있습니다.

### Responsive Navigation

Desktop에서는 상단 Navigation을 사용하고,
Mobile에서는 햄버거 메뉴를 사용합니다.

현재 스크롤 위치에 따라 활성화된 Section을 표시합니다.

---

## 🛠 Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS Modules

### Backend / Database

* Supabase
* Supabase Database
* Supabase Edge Functions

### AI

* Groq API

### Libraries

* d3-cloud
* React Icons
* Lucide React
* React Router

### Deployment

* Vercel

---

## 📁 Project Structure

```text
cleolclcyu-portfolio/
├── public/
│   └── favicon.png
│
├── src/
│   ├── api/
│   │   ├── activity/
│   │   │   └── getActivities.ts
│   │   ├── blog/
│   │   │   └── getBlogs.ts
│   │   ├── career/
│   │   │   └── getCareers.ts
│   │   ├── keyword/
│   │   │   └── getKeywords.ts
│   │   ├── profile/
│   │   │   └── getProfile.ts
│   │   ├── project/
│   │   │   └── getProjects.ts
│   │   ├── skill/
│   │   │   └── getSkills.ts
│   │   └── supabase.ts
│   │
│   ├── components/
│   │   ├── about/
│   │   │   ├── about.module.css
│   │   │   └── About.tsx
│   │   │
│   │   ├── activity/
│   │   │   ├── activity.module.css
│   │   │   ├── Activity.tsx
│   │   │   ├── ActivityDetail.tsx
│   │   │   └── ActivityItem.tsx
│   │   │
│   │   ├── blog/
│   │   │   ├── blog.module.css
│   │   │   └── Blog.tsx
│   │   │
│   │   ├── career/
│   │   │   ├── career.module.css
│   │   │   └── Career.tsx
│   │   │
│   │   ├── closing/
│   │   │   ├── closing.module.css
│   │   │   └── Closing.tsx
│   │   │
│   │   ├── navBar/
│   │   │   ├── navbar.module.css
│   │   │   └── NavBar.tsx
│   │   │
│   │   ├── project/
│   │   │   ├── project.module.css
│   │   │   ├── Project.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectDetailModal.tsx
│   │   │
│   │   ├── skill/
│   │   │   ├── skill.module.css
│   │   │   └── Skill.tsx
│   │   │
│   │   └── wordCloud/
│   │       ├── Chatbot.tsx
│   │       ├── KeywordSelect.tsx
│   │       ├── wordcloud.module.css
│   │       └── WordCloud.tsx
│   │
│   │
│   ├── styles/
│   │   └── App.module.css
│   │
│   ├── types/
│   │   ├── activity.types.ts
│   │   ├── blog.types.ts
│   │   ├── career.types.ts
│   │   ├── keyword.types.ts
│   │   ├── profile.types.ts
│   │   ├── project.types.ts
│   │   └── skill.types.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── supabase/
│   ├── functions/
│   │   └── chat/
│   │       ├── .npmrc
│   │       ├── deno.json
│   │       └── index.ts
│   └── config.toml
│
├── .env
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🧩 Folder Description

### `src/api`

Supabase Database에서 각 Section에 필요한 데이터를 조회하는 API 함수를 관리합니다.

```text
api/
├── activity/
├── blog/
├── career/
├── keyword/
├── profile/
├── project/
├── skill/
└── supabase.ts
```

각 데이터별 조회 함수를 분리하여 사용합니다.

---

### `src/components`

페이지를 구성하는 React 컴포넌트를 관리합니다.

각 Section마다 `.tsx`와 `.module.css`를 함께 구성했습니다.

```text
components/
├── about/
├── activity/
├── blog/
├── career/
├── closing/
├── navBar/
├── project/
├── skill/
└── wordCloud/
```

---

### `src/types`

Supabase에서 가져오는 데이터의 TypeScript 타입을 관리합니다.

```text
types/
├── activity.types.ts
├── blog.types.ts
├── career.types.ts
├── keyword.types.ts
├── profile.types.ts
├── project.types.ts
└── skill.types.ts
```

---

### `supabase/functions/chat`

AI Chatbot 요청을 처리하는 Supabase Edge Function입니다.

React에서 직접 Groq API를 호출하지 않고 Edge Function을 중간에 두어 AI API 요청을 처리합니다.

```text
React
  ↓
Supabase Edge Function
  ↓
Groq API
  ↓
AI Response
  ↓
React
```

`GROQ_API_KEY`는 클라이언트 코드에 포함하지 않고 Edge Function 환경에서 사용합니다.

---

## 🤖 AI Chatbot

Chatbot은 선택된 Keyword의 데이터를 기반으로 AI에게 질문을 전달합니다.

```text
Keyword
├── keyword
├── question
└── answer
```

사용자가 직접 질문하거나 Keyword에 등록된 대표 질문을 선택할 수 있습니다.

AI에게 전달하는 프롬프트에는 포트폴리오 데이터를 포함하여
등록되지 않은 경험이나 사실을 임의로 생성하지 않도록 처리했습니다.

---

## 🎨 Styling

각 컴포넌트의 스타일은 CSS Modules를 사용합니다.

```text
About.tsx
about.module.css

Career.tsx
career.module.css

Project.tsx
project.module.css
```

전역 스타일은 `src/index.css`에서 관리하고,
컴포넌트별 스타일은 각각의 `.module.css`에서 관리합니다.

---

## 📱 Responsive

Desktop과 Mobile 환경에 맞게 반응형 UI를 구현했습니다.

* Desktop Navigation
* Mobile Hamburger Menu
* Responsive Project Card
* Mobile Project Modal
* Responsive Word Cloud
* Responsive Chatbot
* Mobile Career Timeline

---

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/dkk011/cleolclcyu-portfolio-project.git
cd cleolclcyu-portfolio-project
```

### 2. Install

```bash
npm install
```

### 3. Environment Variables

`.env` 파일에 Supabase 관련 환경변수를 설정합니다.

AI API Key는 Supabase Edge Functions Secrets에 작성합니다.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

> 실제 API Key와 Secret 값은 GitHub에 업로드하지 않습니다.

### 4. Run

```bash
npm run dev
```

Supabase Edge Function을 포함한 로컬 환경에서 테스트하는 경우 Supabase CLI 환경에 맞춰 실행합니다.

---

## 📦 Build

```bash
npm run build
```

빌드 결과물은 `dist/`에 생성됩니다.

---

## 🌐 Deployment

Vercel을 통해 배포합니다.

```text
GitHub Repository
       ↓
     Vercel
       ↓
   Portfolio
```

환경변수는 Vercel 프로젝트의 Environment Variables에 별도로 등록합니다.