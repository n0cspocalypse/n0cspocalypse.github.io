/* ============================================
   TERMINAL ENGINE
   ============================================ */

class Terminal {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.body = document.getElementById('terminal-body');
    this.inputLine = document.getElementById('input-line');
    this.commands = {};
    this.history = [];
    this.historyIndex = -1;
    this.isTyping = false;
    this.commandQueue = [];
    this.skipBoot = false;

    this._bindEvents();
  }

  /* --- Event Binding --- */
  _bindEvents() {
    // Click anywhere in terminal to focus input
    this.body.addEventListener('click', () => this.input.focus());

    // Keyboard input
    this.input.addEventListener('keydown', (e) => this._onKeyDown(e));

    // Sync input width to content so block cursor follows text
    this._sizer = document.createElement('span');
    this._sizer.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit';
    this.inputLine.appendChild(this._sizer);
    this.input.addEventListener('input', () => this._syncWidth());

    // Mobile command palette
    document.querySelectorAll('.command-palette button').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.dataset.cmd;
        if (cmd) this.exec(cmd);
      });
    });
  }

  _syncWidth() {
    this._sizer.textContent = this.input.value || '';
    this.input.style.width = (this._sizer.offsetWidth + 1) + 'px';
  }

  _onKeyDown(e) {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        const cmd = this.input.value.trim();
        this.input.value = '';
        this.historyIndex = -1;
        if (cmd) {
          this.history.unshift(cmd);
          if (this.history.length > 50) this.history.pop();
        }
        this.exec(cmd);
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = -1;
          this.input.value = '';
        }
        break;

      case 'Tab':
        e.preventDefault();
        this._tabComplete();
        break;

      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          this.clear();
        }
        break;

      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          this.input.value = '';
          this._echoCommand('^C');
        }
        break;
    }
    requestAnimationFrame(() => this._syncWidth());
  }

  _tabComplete() {
    const partial = this.input.value.trim().toLowerCase();
    if (!partial) return;

    // Match single-word commands and multi-word commands (e.g. "ls p" -> "ls projects")
    const matches = Object.keys(this.commands).filter(c =>
      c.startsWith(partial) || (c.includes(' ') && c.startsWith(partial))
    );
    // Also check if input looks like "cmd arg" and complete against known multi-word commands
    const parts = partial.split(/\s+/);
    if (parts.length > 1) {
      const multiMatches = Object.keys(this.commands).filter(c =>
        c.includes(' ') && c.startsWith(partial)
      );
      if (multiMatches.length === 1) {
        this.input.value = multiMatches[0];
        this._syncWidth();
        return;
      } else if (multiMatches.length > 1) {
        this._echoCommand(partial);
        this.writeLine(multiMatches.join('  '), 'white');
        return;
      }
    }

    if (matches.length === 1) {
      this.input.value = matches[0];
      this._syncWidth();
    } else if (matches.length > 1) {
      this._echoCommand(partial);
      this.writeLine(matches.join('  '), 'white');
    }
  }

  /* --- Command Registry --- */
  register(name, handler, description, aliases, hidden) {
    this.commands[name] = { handler, description, hidden: !!hidden };
    if (aliases) {
      aliases.forEach(a => {
        this.commands[a] = { handler, description, alias: true };
      });
    }
  }

  /* --- Execute --- */
  exec(raw) {
    if (this.isTyping) {
      this.commandQueue.push(raw);
      return;
    }

    this._echoCommand(raw);

    if (!raw) {
      this._scrollToBottom();
      return;
    }

    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check for exact command match
    if (this.commands[cmd]) {
      this.commands[cmd].handler(args, this);
      return;
    }

    // Check for multi-word commands like "cat about.txt" or "ls projects"
    const fullCmd = raw.toLowerCase();
    if (this.commands[fullCmd]) {
      this.commands[fullCmd].handler([], this);
      return;
    }

    // Check "cat <project-id>"
    if (cmd === 'cat' && args.length > 0) {
      const catHandler = this.commands['cat'];
      if (catHandler) {
        catHandler.handler(args, this);
        return;
      }
    }

    // Check "ls <arg>"
    if (cmd === 'ls' && args.length > 0) {
      const lsHandler = this.commands['ls'];
      if (lsHandler) {
        lsHandler.handler(args, this);
        return;
      }
    }

    this.writeLine(`command not found: ${raw}`, 'error');
    this.writeLine('Type "help" for available commands.', 'dim');
  }

  /* --- Output Methods --- */
  _echoCommand(text) {
    const echo = document.createElement('span');
    echo.className = 'cmd-echo';
    echo.innerHTML =
      `<span class="prompt-user">${DATA.user}</span>` +
      `<span class="prompt-at">@</span>` +
      `<span class="prompt-host">${DATA.hostname}</span>` +
      `<span class="prompt-sep">:</span>` +
      `<span class="prompt-dir">~</span>` +
      `<span class="prompt-dollar">$</span> ` +
      `<span class="cmd-text">${this._escapeHtml(text)}</span>`;
    this.output.appendChild(echo);
    this._scrollToBottom();
  }

  writeLine(text, style) {
    const line = document.createElement('span');
    line.className = 'line' + (style ? ' ' + style : '');
    line.innerHTML = text;
    this.output.appendChild(line);
    this._scrollToBottom();
  }

  writeLines(lines) {
    lines.forEach(l => {
      if (typeof l === 'string') {
        this.writeLine(l);
      } else {
        this.writeLine(l.text, l.style);
      }
    });
  }

  async typeLines(lines, delay) {
    delay = delay || 30;
    this.isTyping = true;
    this.inputLine.style.display = 'none';

    for (const l of lines) {
      const text = typeof l === 'string' ? l : l.text;
      const style = typeof l === 'string' ? '' : (l.style || '');
      const lineDelay = typeof l === 'object' && l.delay !== undefined ? l.delay : delay;

      const line = document.createElement('span');
      line.className = 'line' + (style ? ' ' + style : '');
      this.output.appendChild(line);

      if (lineDelay === 0) {
        line.innerHTML = text;
      } else if (style.includes('ascii') || style.includes('eerie-glow')) {
        // ASCII art / banner — render whole line, pause between rows
        line.innerHTML = text;
        await this._sleep(lineDelay);
      } else {
        const raw = text.replace(/<[^>]*>/g, '');
        if (raw.length > 200) {
          // Batch render in chunks of 4 chars at 8ms for long text
          const chunkSize = 4;
          const chunkDelay = 8;
          for (let i = 0; i < raw.length; i += chunkSize) {
            line.textContent = raw.substring(0, Math.min(i + chunkSize, raw.length));
            this._scrollToBottom();
            await this._sleep(chunkDelay);
          }
        } else {
          // Character-by-character at 11ms for short text
          const charDelay = 11;
          for (let i = 0; i < raw.length; i++) {
            line.textContent = raw.substring(0, i + 1);
            this._scrollToBottom();
            await this._sleep(charDelay);
          }
        }
        // Swap in the full HTML version with styling
        line.innerHTML = text;
      }
      this._scrollToBottom();
    }

    this.isTyping = false;
    this.inputLine.style.display = 'flex';
    this.input.focus();
    this._scrollToBottom();

    // Process queued commands
    if (this.commandQueue.length > 0) {
      const next = this.commandQueue.shift();
      this.exec(next);
    }
  }

  clear() {
    this.output.innerHTML = '';
  }

  /* --- Helpers --- */
  _scrollToBottom() {
    this.body.scrollTop = this.body.scrollHeight;
  }

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  _sleep(ms) {
    if (this.skipBoot) return Promise.resolve();
    return new Promise(r => setTimeout(r, ms));
  }

  /* --- Boot Sequence --- */
  async boot() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.inputLine.style.display = 'none';

    // Phase 1 — system line
    this.writeLine('N0CSPOCALYPSE SYSTEMS v2.0.26 — SECURE BOOT', 'dim');

    if (reduceMotion) {
      // Skip animations — render everything instantly
      this.writeLine('Follow the white rabbit.', 'green bold');
      this.writeLine('', '');
      this.writeLine('', '');

      const banner = window.innerWidth < 768
        ? [
            '  ███╗   ██╗ ██████╗  ██████╗███████╗',
            '  ████╗  ██║██╔═══██╗██╔════╝██╔════╝',
            '  ██╔██╗ ██║██║   ██║██║     ███████╗',
            '  ██║╚██╗██║██║   ██║██║     ╚════██║',
            '  ██║ ╚████║╚██████╔╝╚██████╗███████║',
            '  ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝╚══════╝',
          ]
        : [
            '  ███╗   ██╗ ██████╗  ██████╗███████╗██████╗  ██████╗  ██████╗ █████╗ ██╗  ██╗   ██╗██████╗ ███████╗███████╗',
            '  ████╗  ██║██╔═══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗██╔════╝██╔══██╗██║  ╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝',
            '  ██╔██╗ ██║██║   ██║██║     ███████╗██████╔╝██║   ██║██║     ███████║██║   ╚████╔╝ ██████╔╝███████╗█████╗  ',
            '  ██║╚██╗██║██║   ██║██║     ╚════██║██╔═══╝ ██║   ██║██║     ██╔══██║██║    ╚██╔╝  ██╔═══╝ ╚════██║██╔══╝  ',
            '  ██║ ╚████║╚██████╔╝╚██████╗███████║██║     ╚██████╔╝╚██████╗██║  ██║███████╗██║   ██║     ███████║███████╗',
            '  ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝╚══════╝╚═╝      ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝     ╚══════╝╚══════╝',
          ];
      banner.forEach(row => this.writeLine(row, 'eerie-glow'));

      this.writeLine('', '');
      this.writeLine(DATA.title, 'cyan bold centered');
      this.writeLine(DATA.bio.short, 'dim centered');
      this.writeLine('', '');
      this.writeLine('Type <span style="color:var(--green);font-weight:700">help</span> to see available commands.', 'white centered');
      this.writeLine('', '');

      this.inputLine.style.display = 'flex';
      this.input.focus();
      this._scrollToBottom();
      return;
    }

    const skipHandler = () => {
      this.skipBoot = true;
    };
    document.addEventListener('keydown', skipHandler, { once: true });
    document.addEventListener('click', skipHandler, { once: true });

    const skipHint = document.createElement('span');
    skipHint.className = 'line dim';
    skipHint.textContent = 'Press any key to skip...';
    this.output.appendChild(skipHint);

    await this._sleep(1200);

    // Phase 2 — the white rabbit, typed slow
    const rabbit = 'Follow the white rabbit';
    const rabbitLine = document.createElement('span');
    rabbitLine.className = 'line green bold';
    this.output.appendChild(rabbitLine);
    for (let i = 0; i < rabbit.length; i++) {
      rabbitLine.textContent = rabbit.substring(0, i + 1);
      this._scrollToBottom();
      await this._sleep(90);
      if (this.skipBoot) {
        rabbitLine.textContent = rabbit + '.';
        break;
      }
    }

    await this._sleep(600);

    // Phase 2.5 — dots cycling on the same line
    const dotStart = Date.now();
    while (Date.now() - dotStart < 3750 && !this.skipBoot) {
      for (let d = 1; d <= 3; d++) {
        rabbitLine.textContent = rabbit + '.'.repeat(d);
        this._scrollToBottom();
        await this._sleep(90);
      }
      await this._sleep(400);
      rabbitLine.textContent = rabbit;
      await this._sleep(300);
    }
    rabbitLine.textContent = rabbit + '.';

    await this._sleep(400);

    this.writeLine('', '');
    this.writeLine('', '');

    // Phase 3 — banner
    if (window.innerWidth < 768) {
      const banner = [
        '  ███╗   ██╗ ██████╗  ██████╗███████╗',
        '  ████╗  ██║██╔═══██╗██╔════╝██╔════╝',
        '  ██╔██╗ ██║██║   ██║██║     ███████╗',
        '  ██║╚██╗██║██║   ██║██║     ╚════██║',
        '  ██║ ╚████║╚██████╔╝╚██████╗███████║',
        '  ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝╚══════╝',
      ];
      for (const row of banner) {
        this.writeLine(row, 'eerie-glow');
        await this._sleep(150);
      }
    } else {
      const banner = [
        '  ███╗   ██╗ ██████╗  ██████╗███████╗██████╗  ██████╗  ██████╗ █████╗ ██╗  ██╗   ██╗██████╗ ███████╗███████╗',
        '  ████╗  ██║██╔═══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗██╔════╝██╔══██╗██║  ╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝',
        '  ██╔██╗ ██║██║   ██║██║     ███████╗██████╔╝██║   ██║██║     ███████║██║   ╚████╔╝ ██████╔╝███████╗█████╗  ',
        '  ██║╚██╗██║██║   ██║██║     ╚════██║██╔═══╝ ██║   ██║██║     ██╔══██║██║    ╚██╔╝  ██╔═══╝ ╚════██║██╔══╝  ',
        '  ██║ ╚████║╚██████╔╝╚██████╗███████║██║     ╚██████╔╝╚██████╗██║  ██║███████╗██║   ██║     ███████║███████╗',
        '  ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝╚══════╝╚═╝      ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝     ╚══════╝╚══════╝',
      ];
      for (const row of banner) {
        this.writeLine(row, 'eerie-glow');
        await this._sleep(150);
      }
    }

    await this._sleep(800);

    // Phase 4 — tagline
    this.writeLine('', '');
    this.writeLine(DATA.title, 'cyan bold centered');
    await this._sleep(400);
    this.writeLine(DATA.bio.short, 'dim centered');
    await this._sleep(600);
    this.writeLine('', '');
    this.writeLine('Type <span style="color:var(--green);font-weight:700">help</span> to see available commands.', 'white centered');
    this.writeLine('', '');

    document.removeEventListener('keydown', skipHandler);
    document.removeEventListener('click', skipHandler);
    if (skipHint.parentNode) skipHint.remove();
    this.skipBoot = false;

    this.inputLine.style.display = 'flex';
    this.input.focus();
    this._scrollToBottom();
  }
}

// Global instance
const term = new Terminal();
