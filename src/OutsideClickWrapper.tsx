// @flow
import React, { useEffect, useRef } from 'react';

interface IProps {
  onOutsideClick: (e: MouseEvent) => void;
  className?: string;
  children: JSX.Element;
}

const OutsideClickWrapper: React.FC<IProps> = ({
  onOutsideClick,
  className = '',
  children,
}) => {
  const wrapperContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        wrapperContainer.current &&
        !wrapperContainer.current.contains(e.target as Node)
      ) {
        onOutsideClick(e);
      }
    };

    window.addEventListener('click', handleOutsideClick, false);

    return () => {
      window.removeEventListener('click', handleOutsideClick, false);
    };
  }, [onOutsideClick]); // Ensures the effect updates if `onOutsideClick` changes.

  return (
    <div ref={wrapperContainer} className={className}>
      {children}
    </div>
  );
};

export default OutsideClickWrapper;
