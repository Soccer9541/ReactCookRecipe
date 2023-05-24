# ✔️ 집밥의 민족

## 프로젝트 소개 <br>
### 사람들이 각자의 집밥 레시피를 공유하는 커뮤니티 웹을 목표로 제작하였음

---
## ✔️ 사용한 기술 스택
- HTML/CSS/JavaScript
- React(CRA)
- FIREBASE

---
## ✔️ 사용한 UI 및 라이브러리
- TAILWIND CSS
- DAISY UI
- REACT JS PAGINATION(라이브러리)
- REACT RESPONSIVE CAROUSEL(라이브러리)
---

## ✔️ 주요 기능
1. 로그인, 소셜로그인(구글)
- 로그인 기능을 위해 FIREBASE의 AUTH기능을 활용하여 구현
- 로그인 유저의 정보를 FIRESTORE STORAGE의 USER컬렉션에 따로 저장.
- 로그인한 유저의 정보는 LOCAL STORAGE에 저장.

<br>

2. 회원가입

    1. 프로필 사진
    1. 이름
    1. 이메일
    1. 비밀번호
- 회원가입을 통해 유저가 입력한 정보를 FIREBASE에 보내서 유저 컬렉션에 저장.

<br>

3. 프로필 사진, 비밀번호 변경 , 회원 탈퇴
- FIREBASE의 REAUTHENTICATION을 통해 사용자 재인증을 진행하면 이용 가능.
- GOOGLE GMAIL의 경우 이를 이용할 수 없도록 REACT COMPONENT에서 안 보이도록 함.

<br>

4. 글 작성, 글 수정 및 삭제 기능
- 로그인이 되어 있는 상태라면 누구든 글 작성이 가능.
- LOCAL STORAGE에 저장된 유저 정보가 작성된 글의 작성자 UID와 일치한다면<br>
  작성된 글의 수정 및 삭제 기능을 이용 가능.

<br>

5. 댓글 기능
- 글 별로 하단에 댓글란을 통해 자유롭게 댓글 작성, 수정 , 삭제가 가능.
- 로그인한 유저가 쓴 글이어야만 글의 수정과 삭제가 가능함.

<br>

6. 유저의 현재 상태별로 컴포넌트 구별

<br>

\            | 비로그인 방문자 | 로그인 방문자 | 로그인 작성자(글 기준)
------------ | ------------ | ------------- | -------------
글 작성      | 불가능         | 가능         | 가능
글 수정/삭제      | 불가능         | 불가능        | 가능
댓글 작성 | 불가능            | 가능          | 가능

<br>

7. 내가 좋아요 누른 글 목록
- 글마다 좋아요 기능 이용 가능

<br>

8. 내가 쓴 글 목록
- 내가 쓴 글 목록이 표시됨.

<br>

9. 페이지네이션
    1. 내가 쓴 글 목록
    1. 카테고리별 글 목록
    1. 내가 좋아요 누른 글 목록
    1. 댓글 목록
    - 해당 컴포넌트에 모두 적용

<br>





