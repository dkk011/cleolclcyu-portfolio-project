import { useEffect, useRef, useState } from 'react';
import { getCareers } from '../../api/career/getCareers';
import type { Career as CareerType } from '../../types/career.types';
import styles from './career.module.css';

const WHEEL_SPEED = 1;

export default function Career() {
  const [careers, setCareers] = useState<CareerType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const horizontalScrollRef = useRef(0);
  const maxScrollRef = useRef(0);
  const isLockedRef = useRef(false);

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

    return () => {
      isMounted = false;
    };
  }, []);

  const updateLayout = () => {
    const track = trackRef.current;
    const viewport = viewportRef.current;

    if (!track || !viewport) {
      return;
    }

    const maxScroll = Math.max(
      track.scrollWidth - viewport.clientWidth,
      0,
    );

    maxScrollRef.current = maxScroll;

    horizontalScrollRef.current = Math.min(
      horizontalScrollRef.current,
      maxScroll,
    );

    track.style.transform = `translate3d(${
      -horizontalScrollRef.current
    }px, 0, 0)`;
  };

  const updateActiveIndex = () => {
    if (careers.length <= 1) {
      setCurrentIndex(0);
      return;
    }

    const maxScroll = maxScrollRef.current;

    if (maxScroll <= 0) {
      setCurrentIndex(0);
      return;
    }

    const progress =
      horizontalScrollRef.current / maxScroll;

    const index = Math.min(
      Math.round(progress * (careers.length - 1)),
      careers.length - 1,
    );

    setCurrentIndex(index);
  };

  const moveHorizontal = (delta: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const maxScroll = maxScrollRef.current;

    if (maxScroll <= 0) {
      return;
    }

    const nextScroll = Math.max(
      0,
      Math.min(
        horizontalScrollRef.current +
          delta * WHEEL_SPEED,
        maxScroll,
      ),
    );

    horizontalScrollRef.current = nextScroll;

    track.style.transform = `translate3d(${
      -nextScroll
    }px, 0, 0)`;

    updateActiveIndex();
  };

  const isCareerInViewport = () => {
    const section = sectionRef.current;

    if (!section) {
      return false;
    }

    const rect = section.getBoundingClientRect();

    const viewportCenter = window.innerHeight / 2;

    return (
      rect.top <= viewportCenter &&
      rect.bottom >= viewportCenter
    );
  };

  useEffect(() => {
    updateLayout();

    const handleResize = () => {
      updateLayout();
      updateActiveIndex();
    };

    const resizeObserver = new ResizeObserver(() => {
      updateLayout();
      updateActiveIndex();
    });

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener(
        'resize',
        handleResize,
      );

      resizeObserver.disconnect();
    };
  }, [careers]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      if (window.innerWidth <= 768) {
        return;
      }

      if (!isCareerInViewport()) {
        return;
      }

      const maxScroll = maxScrollRef.current;

      if (maxScroll <= 0) {
        return;
      }

      const delta = event.deltaY;

      if (delta === 0) {
        return;
      }

      const currentScroll =
        horizontalScrollRef.current;

      const isScrollingDown = delta > 0;
      const isScrollingUp = delta < 0;

      const isAtStart = currentScroll <= 0;
      const isAtEnd =
        currentScroll >= maxScroll - 1;

      const shouldConsumeScroll =
        (isScrollingDown && !isAtEnd) ||
        (isScrollingUp && !isAtStart);

      if (!shouldConsumeScroll) {
        isLockedRef.current = false;
        return;
      }

      event.preventDefault();

      if (!isLockedRef.current) {
        isLockedRef.current = true;
      }

      moveHorizontal(delta);
    };

    window.addEventListener('wheel', handleWheel, {
      passive: false,
    });

    return () => {
      window.removeEventListener(
        'wheel',
        handleWheel,
      );
    };
  }, [careers.length]);

  return (
    <section
      ref={sectionRef}
      id="career"
      className={styles.career}
    >
      <div className={styles.sticky}>
        <div className={styles.container}>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>
              CAREER
            </p>

            <h2 className={styles.title}>
              지금까지의 여정
            </h2>
          </header>

          <div
            ref={viewportRef}
            className={styles.viewport}
          >
            <div
              ref={trackRef}
              className={styles.track}
            >
              <div className={styles.timeline}>
                <div
                  className={styles.timelineLine}
                  aria-hidden="true"
                />

                {careers.map((career, index) => {
                  const isActive =
                    index === currentIndex;

                  const formattedDate =
                    career.start_date
                      .slice(0, 7)
                      .replace('-', '.');

                  return (
                    <article
                      key={career.id}
                      className={`${styles.item} ${
                        isActive
                          ? styles.itemActive
                          : ''
                      }`}
                    >
                      <time
                        className={styles.date}
                        dateTime={
                          career.start_date
                        }
                      >
                        {formattedDate}
                      </time>

                      <div
                        className={styles.dot}
                        aria-hidden="true"
                      />

                      <div
                        className={styles.content}
                      >
                        <h3
                          className={
                            styles.itemTitle
                          }
                        >
                          {career.title}
                        </h3>

                        <p
                          className={
                            styles.description
                          }
                        >
                          {career.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className={styles.guide}
            aria-hidden="true"
          >
            <span
              className={styles.guideText}
            >
              SCROLL TO EXPLORE
            </span>

            <span
              className={styles.guideArrow}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}