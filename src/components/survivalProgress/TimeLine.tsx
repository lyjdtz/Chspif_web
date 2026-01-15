import React, { useEffect, useState, useRef } from 'react';
import { Timeline } from 'antd';
import styled, { keyframes } from 'styled-components';
import { throttle } from 'lodash';
import { ArrowDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import TimelineItemContent from '#/survivalProgress/TimeLineContent.tsx';

import { IImageContent } from '@/types/IImageContent';
import useScroll from '@/hooks/useScroll.ts';
import { STATIC_DATA_API } from '@/constants';

const PageBackgroundLayer = styled.div<{
  $bgImage: string;
  $isActive: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$bgImage});
  background-size: cover;
  background-position: center;
  transition: opacity 0.5s ease-in-out;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  z-index: -2;
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const PageBackgroundBase = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-hero);
  background-size: 200% 200%;
  animation: ${gradientShift} 15s ease infinite;
  z-index: -3;
`;

const PageBackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
  pointer-events: none;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 60px;
  position: relative;

  @media (max-width: 768px) {
    padding: 50px 20px;
  }
`;

const StyledTimeline = styled(Timeline)`
  width: 100%;

  /* Force light-colored timeline line for visibility against dark background */
  .ant-timeline-item-tail {
    border-left-color: rgba(255, 255, 255, 0.4) !important;
  }
`;

const ScrollToBottomButton = styled.button<{ $show: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 80px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);

  /* Appear animation like ScrollToTopButton */
  opacity: ${(props) => (props.$show ? 1 : 0)};
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
  transform: translateY(${(props) => (props.$show ? '0' : '20px')});

  &:hover {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
    transform: ${(props) =>
      props.$show ? 'translateY(-4px)' : 'translateY(20px)'};
    box-shadow: var(--glow-primary);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    bottom: 24px;
    /* Position: scroll-to-top is at right:24px with width:48px, so we need right:24+48+8=80px */
    right: 80px;
    /* Match scroll-to-top button height */
    height: 48px;
    padding: 0 14px;
    font-size: 12px;
    gap: 4px;

    svg {
      font-size: 16px;
    }
  }
`;



interface TimelineProps {
  items: IImageContent[];
  activeIndex?: number;
}

const TimelineComponent: React.FC<TimelineProps> = ({ items, activeIndex }) => {
  const { t, i18n } = useTranslation();
  const { y } = useScroll();
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [bgImage1, setBgImage1] = useState<string>(items[0]?.imageUrl || '');
  const [bgImage2, setBgImage2] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<1 | 2>(1);

  // Show button after scrolling (like ScrollToTopButton)
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    setShowButton(y > 400);
  }, [y]);

  // Scroll to bottom of page
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const checkVisibility = throttle(() => {
      const windowBottom = y + window.innerHeight;
      for (let index = itemRefs.current.length - 1; index >= 0; index--) {
        const ref = itemRefs.current[index];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const bottom = rect.bottom + window.scrollY;

          if (bottom < windowBottom) {
            const newImage = items[index].imageUrl;
            // Only update if the image is different
            if (
              (activeLayer === 1 && newImage !== bgImage1) ||
              (activeLayer === 2 && newImage !== bgImage2)
            ) {
              // Switch to the other layer with the new image
              if (activeLayer === 1) {
                setBgImage2(newImage);
                setActiveLayer(2);
              } else {
                setBgImage1(newImage);
                setActiveLayer(1);
              }
            }
            break;
          }
        }
      }
    }, 100);

    checkVisibility();

    window.addEventListener('resize', checkVisibility);
    return () => {
      window.removeEventListener('resize', checkVisibility);
      checkVisibility.cancel();
    };
  }, [y, items, bgImage1, bgImage2, activeLayer]);

  useEffect(() => {
    if (typeof activeIndex === 'number' && itemRefs.current[activeIndex]) {
      setTimeout(() => {
        itemRefs.current[activeIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 500);
    }
  }, [activeIndex]);

  const timelineMode = window.innerWidth < 768 ? 'left' : 'alternate';

  return (
    <>
      <PageBackgroundBase />
      <PageBackgroundLayer
        $bgImage={`${STATIC_DATA_API}/images/${bgImage1}`}
        $isActive={activeLayer === 1}
      />
      <PageBackgroundLayer
        $bgImage={`${STATIC_DATA_API}/images/${bgImage2}`}
        $isActive={activeLayer === 2}
      />
      <PageBackgroundOverlay />

      {/* Scroll to bottom button */}
      <ScrollToBottomButton
        $show={showButton}
        onClick={scrollToBottom}
        aria-label='Scroll to bottom'
      >
        <ArrowDownOutlined />
        {t('survivalProgress.scrollToBottom', 'Scroll to Bottom')}
      </ScrollToBottomButton>

      <Container>
        <StyledTimeline
          mode={timelineMode}
          items={items.map((item, index) => ({
            key: index,
            children: (
              <div ref={(el) => (itemRefs.current[index] = el)}>
                <TimelineItemContent {...item} />
              </div>
            ),
          }))}
        />
      </Container>
    </>
  );
};

export default TimelineComponent;
