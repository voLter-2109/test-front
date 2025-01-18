import { memo } from 'react';

const LoadingPage = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center text-lg">
      <span>LoadingPage</span>
      <span className="animate-pulse">.</span>
      <span className="animate-pulse">.</span>
      <span className="animate-pulse">.</span>
    </div>
  );
};

export default memo(LoadingPage);
