'use client';
import { useEffect, useState } from 'react';

/** Live local time in Salatiga (WIB, UTC+7). Renders nothing until mounted so server and client markup match. */
export default function Clock({ city }: { city: string }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="clock">
      <span>{city}</span> <b className="ltr">{time || '--:--'}</b> <span>WIB</span>
    </span>
  );
}
