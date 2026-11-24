import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
}

export default function ScrollReveal({ 
    children, 
    className = "", 
    delay = 0, 
    direction = 'up',
    duration = 0.6,
    ...props 
}: ScrollRevealProps) {
    
    const directionOffset = {
        up: { y: 30, x: 0 },
        down: { y: -30, x: 0 },
        left: { x: 30, y: 0 },
        right: { x: -30, y: 0 },
        none: { x: 0, y: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directionOffset[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                duration: duration,
                delay: delay > 10 ? delay / 1000 : delay, // support both ms and s for easy migration
                ease: [0.25, 0.1, 0.25, 1.0] // smooth easing
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
