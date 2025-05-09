import React, { useRef, useState, useEffect, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import './HorizontalScroller.css';

interface HorizontalScrollerProps {
  children: React.ReactNode;
  scrollAmount?: number;
  disableMouseDrag?: boolean;
}

const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  children,
  scrollAmount = 250,
  disableMouseDrag = false,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScrollability = useCallback(() => {
    const el = scrollerRef.current;
    if (el) {
      const Epsilon = 1;
      setCanScrollLeft(el.scrollLeft > Epsilon);
      setCanScrollRight(
        el.scrollLeft < el.scrollWidth - el.clientWidth - Epsilon
      );
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) {
      checkForScrollability();
      let resizeTimeout: number;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkForScrollability, 100);
      };

      el.addEventListener('scroll', checkForScrollability, { passive: true });
      window.addEventListener('resize', handleResize);

      const observer = new MutationObserver(checkForScrollability);
      observer.observe(el, { childList: true, subtree: true });

      return () => {
        el.removeEventListener('scroll', checkForScrollability);
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
        clearTimeout(resizeTimeout);
      };
    }
  }, [children, checkForScrollability]);

  const handleScrollButtonClick = (direction: 'left' | 'right') => {
    if (scrollerRef.current) {
      const currentScroll = scrollerRef.current.scrollLeft;
      const newScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
      scrollerRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableMouseDrag || !scrollerRef.current) return;
    if (e.target !== scrollerRef.current && (e.target as HTMLElement).closest('button, a, input')) {
      return;
    }
    setIsDragging(true);
    setStartX(e.pageX - scrollerRef.current.offsetLeft);
    setScrollLeftStart(scrollerRef.current.scrollLeft);
    scrollerRef.current.classList.add('dragging');
  };

  const onMouseLeaveOrUp = () => {
    if (disableMouseDrag) return;
    if (isDragging) {
      setIsDragging(false);
      scrollerRef.current?.classList.remove('dragging');
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableMouseDrag || !isDragging || !scrollerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (scrollerRef.current) {
       if (e.target !== scrollerRef.current && (e.target as HTMLElement).closest('button, a, input')) {
        return;
      }
      setIsDragging(true);
      setStartX(e.touches[0].pageX - scrollerRef.current.offsetLeft);
      setScrollLeftStart(scrollerRef.current.scrollLeft);
      scrollerRef.current.classList.add('dragging');
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollerRef.current) return;
    const x = e.touches[0].pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const onTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      scrollerRef.current?.classList.remove('dragging');
    }
  };

  return (
    <Box className="horizontal-scroller-container">
      {canScrollLeft && (
        <IconButton
          className="scroll-button left"
          onClick={() => handleScrollButtonClick('left')}
          aria-label="scroll left"
          size="small"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
      )}
      <div
        className="horizontal-scroller-content"
        ref={scrollerRef}
        onMouseDown={!disableMouseDrag ? onMouseDown : undefined}
        onMouseLeave={!disableMouseDrag ? onMouseLeaveOrUp : undefined}
        onMouseUp={!disableMouseDrag ? onMouseLeaveOrUp : undefined}
        onMouseMove={!disableMouseDrag ? onMouseMove : undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ cursor: disableMouseDrag ? 'default' : 'grab' }}
      >
        {children}
      </div>
      {canScrollRight && (
        <IconButton
          className="scroll-button right"
          onClick={() => handleScrollButtonClick('right')}
          aria-label="scroll right"
          size="small"
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default HorizontalScroller;