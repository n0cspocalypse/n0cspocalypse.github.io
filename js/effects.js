/* ============================================
   VISUAL EFFECTS — Matrix Rain, Flicker, Glitch
   ============================================ */

(function () {

  /* --- Matrix Rain --- */
  const canvas = document.getElementById('matrix-rain');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let columns, drops;
    const fontSize = 14;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/\\|{}[]!@#$%^&*';

    function resize() {
      // Use documentElement dimensions to cover full page on iOS
      const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0, screen.height);
      canvas.width = w;
      canvas.height = h;
      columns = Math.floor(w / fontSize);
      drops = new Array(columns).fill(1);
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff41';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 200));
    setInterval(draw, 66); // ~15fps
  }

  /* --- Idle Flicker --- */
  let idleTimer = null;
  let flickerInterval = null;

  function resetIdle() {
    clearTimeout(idleTimer);
    clearInterval(flickerInterval);

    idleTimer = setTimeout(() => {
      flickerInterval = setInterval(() => {
        const termEl = document.getElementById('terminal');
        if (termEl) {
          termEl.classList.add('flicker');
          setTimeout(() => termEl.classList.remove('flicker'), 150);
        }
      }, 4000 + Math.random() * 3000);
    }, 30000); // 30s idle
  }

  document.addEventListener('keydown', resetIdle);
  document.addEventListener('mousemove', resetIdle);
  document.addEventListener('touchstart', resetIdle);
  resetIdle();

  /* --- Glitch on Command --- */
  const origExec = term.exec.bind(term);
  term.exec = function (raw) {
    if (raw && Math.random() < 0.15) {
      const termEl = document.getElementById('terminal');
      if (termEl) {
        termEl.classList.add('glitch');
        setTimeout(() => termEl.classList.remove('glitch'), 300);
      }
    }
    origExec(raw);
  };

})();
