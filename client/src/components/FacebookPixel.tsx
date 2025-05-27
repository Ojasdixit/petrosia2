import { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
  }
}

export default function FacebookPixel() {
  useEffect(() => {
    // Initialize Facebook Pixel
    const initFbPixel = () => {
      const f = window;
      const b = document;
      const e = 'script';
      const v = 'https://connect.facebook.net/en_US/fbevents.js';
      
      if (f.fbq) return;
      
      const n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      
      const t = b.createElement(e);
      t.async = true;
      t.src = v;
      
      const s = b.getElementsByTagName(e)[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      }
    };
    
    initFbPixel();
    
    window.fbq('init', '650355407611044');
    window.fbq('track', 'PageView');
    
    // Add noscript element for users with JavaScript disabled
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = 'https://www.facebook.com/tr?id=650355407611044&ev=PageView&noscript=1';
    noscript.appendChild(img);
    document.body.appendChild(noscript);
    
    // Clean up when component unmounts
    return () => {
      if (noscript.parentNode) {
        noscript.parentNode.removeChild(noscript);
      }
    };
  }, []);
  
  return null;
}