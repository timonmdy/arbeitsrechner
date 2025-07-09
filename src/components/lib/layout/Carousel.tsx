import React, { useRef, useState, useEffect, useCallback } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "./Carousel.css";
import { CarouselScrollButton } from "./CarouselScrollButton";

type CarouselProps = {
  children: React.ReactNode;
};

export const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollPosition = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft: sl, scrollWidth, clientWidth } = containerRef.current;
      setIsAtStart(sl < 10);
      setIsAtEnd(sl + clientWidth >= scrollWidth - 10);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkScrollPosition, { passive: true });
    checkScrollPosition();

    const resizeObserver = new ResizeObserver(() => checkScrollPosition());
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
      resizeObserver.disconnect();
    };
  }, [children, checkScrollPosition]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (container.scrollWidth > container.clientWidth) {
        e.preventDefault();
        container.scrollBy({ left: e.deltaY, behavior: "smooth" });
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheel);
    };
  }, [children]);

  const scrollBy = (offset: number) => {
    containerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Adjust drag speed here
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const endDrag = () => {
    isDragging.current = false;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative flex items-center group/carousel mx-8 select-none">
      <CarouselScrollButton
        onClick={() => scrollBy(-containerRef.current!.clientWidth)}
        disabled={isAtStart}
        icon={IoChevronBack}
        className="-left-7"
      />

      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth py-3 scrollbar-hide w-full cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onContextMenu={(e) => e.preventDefault()}
      >
        {React.Children.map(children, (child, i) => (
          <div
            key={i}
            className="flex-shrink-0 snap-start w-10/12 sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 box-border"
          >
            {child}
          </div>
        ))}
      </div>

      <CarouselScrollButton
        onClick={() => scrollBy(containerRef.current!.clientWidth)}
        disabled={isAtEnd}
        icon={IoChevronForward}
        className="-right-7"
      />
    </div>
  );
};
