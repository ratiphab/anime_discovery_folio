"use client";
export default function Error({ reset }: { reset: () => void }) { return <main className="detail-page"><div className="archive-state"><p className="k-label">Archive unavailable</p><h3>This story could not be opened right now.</h3><button className="ink-button" onClick={reset}>Try again</button></div></main>; }
