"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
}

const hiddenTransform: Record<NonNullable<ScrollRevealProps['direction']>, string> = {
    up: 'translate-y-4',
    down: '-translate-y-4',
    left: 'translate-x-4',
    right: '-translate-x-4',
    none: '',
};

export default function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = 'up',
    duration = 320,
    style,
    ...props
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === 'undefined') {
            const rafId = requestAnimationFrame(() => setIsVisible(true));
            return () => cancelAnimationFrame(rafId);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.05, rootMargin: '0px 0px -24px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const delayMs = delay > 10 ? delay : Math.round(delay * 1000);
    const durationMs = duration > 10 ? duration : Math.round(duration * 1000);

    return (
        <div
            ref={ref}
            style={{
                transitionDuration: `${durationMs}ms`,
                transitionDelay: `${delayMs}ms`,
                ...style,
            }}
            className={`transition-[opacity,transform] ease-out ${
                isVisible
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : `opacity-0 will-change-[opacity,transform] ${hiddenTransform[direction]}`
            } ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
