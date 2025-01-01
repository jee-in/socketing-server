# 티켓 예매 대행 사이트: 소켓팅
> 긴박한 티켓팅 상황에서 사용자에게 불편함을 주는 '이미 선택된 좌석입니다.' 팝업창!  
> 소켓 통신을 통한 실시간 좌석 렌더링을 통해 편리한 티켓팅 경험을 제공합니다.

## 프로젝트 개요
- 개발 기간: 2024.11.10 ~ 2024.12.14. (약 한 달)
- 개발 인원: 5명
- 팀원별 상세 담당 업무: [팀 레포](https://github.com/everyone-falls-asleep#7--%EC%83%81%EC%84%B8-%EB%8B%B4%EB%8B%B9-%EC%97%85%EB%AC%B4)
<table style="width: 100%;">
  <thead>
    <tr>
      <th><a href="https://github.com/jee-in">jee-in</a></th>
      <th><a href="https://github.com/donghyun-chae">donghyun-chae</a></th>
      <th><a href="https://github.com/hyeda">hyeda</a></th>
      <th><a href="https://github.com/yeonupark">yeonupark</a></th>
      <th><a href="https://github.com/hjyoon">hjyoon</a></th>
    </tr>
  </thead>
  </tbody>
</table>

## 프로젝트에 참여한 부분
- 결제 제한 시간 내 결제하기 기능 구현
  - 유저, 주문 정보 등의 유효성을 검증하여 예외 처리
  - 트랜잭션 적용으로 DB에 저장되는 결제 데이터의 원자성 보장
  - Redis의 임시 주문 데이터에 TTL을 적용하여 결제 시간 제한
- 마이 페이지, 판매자 페이지 데이터 조회 API 구현
  - 예매 취소된 주문은 조회 데이터에서 제외되도록 처리
  - 판매자 페이지에 표시할 매출액을 쿼리로 집계
  - 프런트 개발자가 작업하기 편한 방식으로 응답 객체를 생성

## 사용 기술
<div style="display:flex">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white"/>
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=Fastify&logoColor=white"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=Redis&logoColor=white"/>
</div>
<div style="display:flex">
  <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"/>
  <img src="https://img.shields.io/badge/react query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=Tailwind CSS&logoColor=white"/>
  <img src="https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=Storybook&logoColor=white"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white"/>
</div>
