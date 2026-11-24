import { useState, useEffect } from 'react';

export function useTypingAnimation(
    phrases: string[],
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseDuration = 2000
) {
    const [displayText, setDisplayText] = useState(phrases[0] || "");
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (phrases.length === 0) return;

        const currentPhrase = phrases[phraseIndex];
        let timeout: NodeJS.Timeout;

        if (!isDeleting && displayText === currentPhrase) {
            timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
        } else if (isDeleting && displayText === "") {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
        } else {
            const speed = isDeleting ? deletingSpeed : typingSpeed;
            timeout = setTimeout(() => {
                setDisplayText(
                    isDeleting
                        ? currentPhrase.substring(0, displayText.length - 1)
                        : currentPhrase.substring(0, displayText.length + 1)
                );
            }, speed);
        }
        return () => clearTimeout(timeout);
    }, [displayText, phraseIndex, isDeleting, phrases, typingSpeed, deletingSpeed, pauseDuration]);

    return displayText;
}
