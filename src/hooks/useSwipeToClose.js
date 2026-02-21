import { useState, useRef } from 'react';

/**
 * Custom hook to handle swipe-to-close logic for bottom sheets/modals.
 * @param {Function} onClose - Function to call when swipe threshold is reached.
 * @param {number} threshold - Distance in pixels to trigger onClose (default 100).
 * @returns {Object} - { dragY, handlers: { onTouchStart, onTouchMove, onTouchEnd }, resetDrag }
 */
export function useSwipeToClose(onClose, threshold = 100) {
    const [dragY, setDragY] = useState(0);
    const startY = useRef(0);
    const isDragging = useRef(false);

    const onTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
        isDragging.current = true;
    };

    const onTouchMove = (e) => {
        if (!isDragging.current) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        // Only allow dragging down (positive diff)
        if (diff > 0) {
            setDragY(diff);
        } else {
            setDragY(0);
        }
    };

    const onTouchEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;

        if (dragY > threshold) {
            onClose();
        }

        setDragY(0);
    };

    const resetDrag = () => setDragY(0);

    return {
        dragY,
        handlers: { onTouchStart, onTouchMove, onTouchEnd },
        resetDrag
    };
}
