import { useEffect, useRef, useState } from 'react';

export default function Editor() {
  const [html, setHtml] = useState(() => localStorage.getItem('editableHtml') || '');
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'save' && event.data.html) {
        localStorage.setItem('editableHtml', event.data.html);
        setHtml(event.data.html);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      title="Editor visual"
      className="w-full h-screen border-none"
      sandbox="allow-scripts allow-same-origin"
      style={{ background: '#fff' }}
    />
  );
}
