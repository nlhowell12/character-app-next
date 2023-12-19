import { useEffect } from 'react';

export const useOutsideAlerter = (
    ref: any,
    onClick: React.Dispatch<React.SetStateAction<any>>
) => {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClick(false);
            }
        }
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, onClick]);
};
