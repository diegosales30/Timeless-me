
import React from 'react';

const loadingMessages = [
    "Warming up the time machine...",
    "Searching for vintage pixels...",
    "Applying retro filters...",
    "Styling your hair for the decade...",
    "Choosing the perfect outfit...",
    "Traveling through the digital timeline...",
    "Almost there, don't touch the dial!",
];

export const Loader: React.FC = () => {
  const [message, setMessage] = React.useState(loadingMessages[0]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col justify-center items-center z-50 backdrop-blur-sm">
        <div className="w-24 h-24 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
        <p className="text-cyan-300 text-xl mt-6 tracking-widest text-center px-4">{message}</p>
    </div>
  );
};
