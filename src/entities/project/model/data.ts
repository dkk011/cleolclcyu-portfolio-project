import type { Project } from './types';

export const projects: Project[] = [
  {
    title: 'MOOD',
    period: '2024.09 ~ 2025.09',
    role: 'Backend / Team Leader',
    memberCount: 4,
    description:
      '주행 중 감정과 고개 움직임을 분석하여 음악을 추천하는 시스템',
    detail:
      'Jetson Nano에서 실시간 영상을 처리하고 AWS Rekognition을 활용해 사용자의 감정을 분석했습니다. Node.js 서버를 통해 모바일 앱과 데이터를 연결하고, 분석된 감정 데이터를 기반으로 음악을 추천하는 기능을 구현했습니다.',
    techStack: [
      'Node.js',
      'REST API',
      'AWS Rekognition',
      'MySQL',
      'Jetson Nano',
      'Flutter',
    ],
  },
  {
    title: '머니시흥',
    period: '2023.05 ~ 2023.06',
    role: 'Android / Team Member',
    memberCount: 5,
    description:
      '시흥시 외화 직거래를 위한 모바일 플랫폼',
    detail:
      '시흥시 지역 주민이 외화를 직접 거래할 수 있도록 위치 기반 기능과 사용자 인증 기능을 갖춘 Android 애플리케이션을 개발했습니다.',
    techStack: [
      'Kotlin',
      'Android SDK',
      'Kakao SDK',
      'Google Maps API',
      'Gson',
    ],
  },
];