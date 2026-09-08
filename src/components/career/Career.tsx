import { useCallback, useEffect, useRef, useState } from 'react';
import { getCareers } from '../../api/career/getCareers';
import type { Career as CareerType } from '../../types/career.types';
import styles from './career.module.css';

export default function Career() {
  // Supabase에서 가져온 Career 데이터 저장
  const [careers, setCareers] = useState<CareerType[]>([]);

  // 현재 화면에 활성화된 Career index
  const [currentIndex, setCurrentIndex] = useState(0);

  // 가로 스크롤 계산에 사용할 DOM 요소 참조
  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    getCareers()
      .then((data) => {
        if (isMounted) {
          setCareers(data);
        }
      })
      .catch((error) => {
        console.error('Career 불러오기 실패:', error);
      });

    // 컴포넌트가 사라지고 나면 state를 변경하지 않도록 한다
    return () => {
      isMounted = false;
    };
  }, []);

  // 가로로 이동할 거리만큼 Career 섹션 세로 높이 설정
  // 세로 스크롤 공간이 충분해야 아래로 스크롤하면서 가로 이동 가능
  const updateSectionHeight = useCallback(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!section || !viewport || !track) {
      return;
    }

    // 전체 Career 콘텐츠에서 화면에 보이는 영역을 뺀 값
    const maxScrollDistance = track.scrollWidth - viewport.clientWidth;
    section.style.height = `${window.innerHeight + Math.max(0, maxScrollDistance)}px`;
  }, []);

  // 현재 페이지의 세로 스크롤 위치를 가로 이동 위치로 바꾸기
  const syncScroll = useCallback(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!section || !viewport || !track || careers.length === 0) {
      return;
    }

    // 현재 Career 영역이 화면에서 어느 위치에 있는지 확인
    const rect = section.getBoundingClientRect();

    // Career 콘텐츠가 이동할 수 있는 최대 가로 거리
    const maxHorizontalScroll = track.scrollWidth - viewport.clientWidth;

    if (maxHorizontalScroll <= 0) {
      setCurrentIndex(0);
      return;
    }

    // 섹션의 top 위치를 이용해서 세로 스크롤 진행률 계산
    const scrolledY = -rect.top;    // 얼마나 내려왔는지
    const progress = Math.min(Math.max(scrolledY / maxHorizontalScroll, 0), 1);   // 전체 가로 이동 거리 중 얼마나 진행했는지 (범위는 0부터 1)

    // 세로 스크롤 진행률을 가로 이동 거리로 바꾸기
    // progress가 0.5면 maxHorizontalScroll의 절반만큼 왼쪽으로 이동
    track.style.transform = `translateX(-${progress * maxHorizontalScroll}px)`;

    // 전체 진행률을 Career의 index로 바꾸기 -> 나중에 Career 강조할 떄 사용
    const activeIndex = Math.min(
      Math.round(progress * (careers.length - 1)),
      careers.length - 1,
    );

    setCurrentIndex(activeIndex);
  }, [careers.length]);

  useEffect(() => {
    // 처음 렌더링될 때 현재 크기와 스크롤 위치 맞추기
    updateSectionHeight();
    syncScroll();

    const handleScroll = () => {
      // 페이지 스크롤할 때마다 가로 위치 다시 계산
      syncScroll();
    };

    const handleResize = () => {
      // 화면 크기 바뀌면 이동 거리 다시 계산
      updateSectionHeight();
      syncScroll();
    };

    // 세로 스크롤 감지해서 가로 이동 처리
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Career 콘텐츠 자체 크기가 변경되는 경우 감지
    const resizeObserver = new ResizeObserver(() => {
      updateSectionHeight();
      syncScroll();
    });

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [updateSectionHeight, syncScroll]);

  return (
    <section ref={sectionRef} id="career" className={styles.career}>
      <div className={styles.sticky}>
        <div className={styles.container}>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>CAREER</p>
            <h2 className={styles.title}>지금까지의 여정</h2>
          </header>

          // track이 실제 화면에 보이는 viewport 영역보다 넓으므로 track을 좌우로 이동하면서 나머지 내용을 보여준다
          <div ref={viewportRef} className={styles.viewport}>
            // track은 실제로 움직이는 부분
            <div ref={trackRef} className={styles.track}>
              <div className={styles.timeline}>
                <div className={styles.timelineLine} aria-hidden="true" />

                {careers.map((career, index) => {
                  const isActive = index === currentIndex;
                  const formattedDate = career.start_date
                    .slice(0, 7)
                    .replace('-', '.');

                  return (
                    <article
                      key={career.id}
                      className={`${styles.item} ${
                        // 현재 활성화된 Career면 itmeActive 클래스 추가
                        isActive ? styles.itemActive : ''
                      }`}
                    >
                      <time
                        className={styles.date}
                        dateTime={career.start_date}
                      >
                        {formattedDate}
                      </time>

                      <div className={styles.dot} aria-hidden="true" />

                      <div className={styles.content}>
                        <h3 className={styles.itemTitle}>{career.title}</h3>
                        <p className={styles.description}>
                          {career.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.guide} aria-hidden="true">
            <span className={styles.guideText}>SCROLL TO EXPLORE</span>
            <span className={styles.guideArrow}>→</span>
          </div>
        </div>
      </div>
    </section>
  );
}