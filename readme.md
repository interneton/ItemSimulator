
---

# 프로젝트 이름

이 프로젝트는 **Express.js**와 **Prisma**를 사용하여 캐릭터 생성, 아이템 관리, 그리고 사용자 인증을 제공하는 API 서버입니다.

## 주요 기능

- **회원가입 및 로그인**: JWT 기반 인증 시스템.
- **캐릭터 관리**: 캐릭터 생성, 조회, 삭제.
- **아이템 관리**: 아이템 생성, 구매, 판매, 장착 및 탈착.

## 기술 스택

- **Node.js**: 서버 사이드 자바스크립트 런타임.
- **Express.js**: 웹 애플리케이션 프레임워크.
- **Prisma**: ORM(객체 관계 매핑) 도구.
- **JWT**: 사용자 인증을 위한 JSON Web Token.
- **bcrypt**: 비밀번호 해싱 라이브러리.

## 설치 방법

1. **저장소 클론**
   ```bash
   git clone git@github.com:interneton/ItemSimulator.git
   ```
   
2. **프로젝트 디렉토리로 이동**
   ```bash
   cd project-name
   ```
   
3. **패키지 설치**
   ```bash
   yarn install
   ```

4. **환경 변수 설정**
   `.env` 파일을 생성하여 다음 변수들을 설정
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

5. **Prisma 마이그레이션 실행**
   ```bash
   npx prisma migrate dev
   ```

6. **서버 실행**
   ```bash
   yarn start
   ```

## API 문서

자세한 API 사용법과 엔드포인트 정보는 [DOCS.md](./DOCS.md) 파일을 참조하세요.

## 프로젝트 구조

```
/src
  /controllers    # 컨트롤러 로직
  /services       # 서비스 및 비즈니스 로직
  /routes         # API 라우트
  /middlewares    # 인증 및 기타 미들웨어
  /utils          # 유틸리티 함수 및 Prisma 설정
  app.js          # Express 애플리케이션 설정
  config.js       # 설정 파일
```

---

이 간단한 README 파일은 프로젝트의 설치 및 설정 방법을 설명하며, 자세한 API 정보는 `DOCS.md` 파일에 담겨 있습니다.