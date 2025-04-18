import React, { useEffect, useState } from 'react';

const DateTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateObj) => {
    const options = {
      weekday: 'long',
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    return dateObj.toLocaleString('en-US', options);
  };

  return (
    <div className="text-left p-4 text-sm font-semibold text-purple-700 sm:text-lg">
      {formatDateTime(currentTime)}
    </div>
  );
};

export default DateTime;
