import React, { useEffect, useState } from 'react';

const BlinkingCursor = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`${visible ? 'opacity-100' : 'opacity-0'} inline-block w-3 h-5 bg-[#00ff00] ml-1 align-bottom`}></span>
  );
};

export default BlinkingCursor;