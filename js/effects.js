/* ============================================
   VISUAL EFFECTS — Matrix Rain, Flicker, Glitch
   ============================================ */

(function () {

  /* --- Matrix Rain --- */
  const canvas = document.getElementById('matrix-rain');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let columns, drops;
    let matrixRunning = true;
    let matrixRAF = null;
    let lastDraw = 0;
    const fontSize = 14;
    const drawInterval = 66; // ~15fps
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

    function draw(timestamp) {
      if (!matrixRunning) return;
      matrixRAF = requestAnimationFrame(draw);
      if (timestamp - lastDraw < drawInterval) return;
      lastDraw = timestamp;

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
    matrixRAF = requestAnimationFrame(draw);

    // Pause when tab is hidden to save CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        matrixRunning = false;
        if (matrixRAF) cancelAnimationFrame(matrixRAF);
      } else {
        matrixRunning = true;
        lastDraw = 0;
        matrixRAF = requestAnimationFrame(draw);
      }
    });
  }

  /* --- Idle Flicker --- */
  let idleTimer = null;
  let flickerTimeout = null;

  function scheduleFlicker() {
    flickerTimeout = setTimeout(() => {
      const termEl = document.getElementById('terminal');
      if (termEl) {
        termEl.classList.add('flicker');
        setTimeout(() => termEl.classList.remove('flicker'), 150);
      }
      scheduleFlicker();
    }, 4000 + Math.random() * 3000);
  }

  function resetIdle() {
    clearTimeout(idleTimer);
    clearTimeout(flickerTimeout);

    idleTimer = setTimeout(() => {
      scheduleFlicker();
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

  /* --- Traffic Light Easter Eggs --- */
  const easterEggs = [
    { selector: '.btn-close',    fx: 'fx-blackout' },
    { selector: '.btn-minimize', fx: 'fx-shrink' },
    { selector: '.btn-maximize', fx: 'fx-zoom' },
  ];

  easterEggs.forEach(({ selector, fx }) => {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.addEventListener('click', () => {
        if (Math.random() < 0.15) {
          const termEl = document.getElementById('terminal');
          if (termEl) {
            termEl.classList.add(fx);
            setTimeout(() => termEl.classList.remove(fx), 300);
          }
        }
      });
    }
  });

})();
