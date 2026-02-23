/* ============================================
   COMMAND REGISTRY
   ============================================ */

(function () {
  let guiMode = false;
  let guiPopulated = false;

  /* --- help --- */
  term.register('help', (_args, t) => {
    const cmds = Object.entries(t.commands)
      .filter(([, v]) => !v.alias && !v.hidden)
      .map(([name, v]) => ({ name, desc: v.description }));

    const lines = [
      { text: 'Available commands:', style: 'heading', delay: 0 },
      { text: '', style: '', delay: 0 },
    ];
    cmds.forEach(c => {
      const pad = ' '.repeat(Math.max(1, 20 - c.name.length));
      lines.push({ text: `  <span style="color:var(--green);font-weight:500">${c.name}</span>${pad}<span style="color:var(--gray-light)">${c.desc}</span>`, style: 'white', delay: 40 });
    });
    lines.push({ text: '', style: '', delay: 0 });
    lines.push({ text: 'Arrow keys for history, Tab for autocomplete.', style: 'dim', delay: 0 });
    t.typeLines(lines);
  }, 'List all commands');

  /* --- whoami --- */
  term.register('whoami', (_args, t) => {
    const lines = [
      { text: `<span style="color:var(--cyan);font-weight:700">${DATA.fullName}</span>`, style: '', delay: 0 },
      { text: DATA.title, style: 'amber', delay: 30 },
      { text: '', style: '', delay: 0 },
      { text: DATA.bio.short, style: 'white', delay: 30 },
      { text: '', style: '', delay: 0 },
      { text: 'Focus Areas:', style: 'sub-heading', delay: 0 },
    ];
    DATA.bio.focus.forEach(f => {
      lines.push({ text: `  > ${f}`, style: 'green', delay: 40 });
    });
    t.typeLines(lines);
  }, 'Display bio + focus areas');

  /* --- cat about.txt --- */
  term.register('cat', (args, t) => {
    const target = args.join(' ').toLowerCase().replace(/\.txt$/, '');

    if (target === 'about') {
      const lines = [
        { text: '--- about.txt ---', style: 'separator', delay: 0 },
      ];
      DATA.bio.about.forEach(line => {
        lines.push({ text: line || '', style: line ? 'white' : '', delay: line ? 40 : 0 });
      });
      lines.push({ text: '--- EOF ---', style: 'separator', delay: 0 });
      t.typeLines(lines);
      return;
    }

    // Try to match a project ID
    const project = DATA.projects.find(p => p.id === target);
    if (project) {
      const lines = [
        { text: `--- ${project.id}.md ---`, style: 'separator', delay: 0 },
        { text: `# ${project.name}`, style: 'heading', delay: 0 },
        { text: project.tagline, style: 'amber', delay: 30 },
        { text: '', style: '', delay: 0 },
        { text: project.description, style: 'white', delay: 40 },
        { text: '', style: '', delay: 0 },
        { text: `Status: <span style="color:var(--green);font-weight:700">${project.status}</span>`, style: 'white', delay: 30 },
        { text: `Stack:  ${project.tech.map(x => `<span style="color:var(--cyan)">${x}</span>`).join(' | ')}`, style: 'white', delay: 30 },
        { text: '--- EOF ---', style: 'separator', delay: 0 },
      ];
      t.typeLines(lines);
      return;
    }

    t.writeLine(`cat: ${args.join(' ')}: No such file or directory`, 'error');
    t.writeLine('Try: cat about.txt, or cat &lt;project-id&gt;', 'dim');
  }, 'Read a file (about.txt, <project-id>)');

  /* --- ls projects --- */
  term.register('ls', (args, t) => {
    const target = (args[0] || '').toLowerCase();

    if (target === 'projects' || target === '') {
      const lines = [
        { text: 'drwxr-xr-x  projects/', style: 'cyan', delay: 0 },
        { text: '', style: '', delay: 0 },
      ];
      DATA.projects.forEach(p => {
        const status = p.status === 'ACTIVE'
          ? `<span style="color:var(--green)">[${p.status}]</span>`
          : `<span style="color:var(--amber)">[${p.status}]</span>`;
        lines.push({ text: `  ${status} <span style="color:var(--green);font-weight:700">${p.id}</span>  <span style="color:var(--gray-light)">— ${p.tagline}</span>`, style: 'white', delay: 50 });
      });
      lines.push({ text: '', style: '', delay: 0 });
      lines.push({ text: 'Use <span style="color:var(--green)">cat &lt;project-id&gt;</span> for details.', style: 'dim', delay: 0 });
      t.typeLines(lines);
      return;
    }

    t.writeLine(`ls: cannot access '${target}': Not a directory`, 'error');
  }, 'List projects');

  /* --- history --- */
  term.register('history', (_args, t) => {
    const typeColors = {
      milestone: 'var(--cyan)',
      deploy:    'var(--green)',
      security:  'var(--red)',
      learning:  'var(--amber)',
    };

    const lines = [
      { text: 'Timeline', style: 'heading', delay: 0 },
      { text: '', style: '', delay: 0 },
    ];

    DATA.timeline.forEach(entry => {
      const color = typeColors[entry.type] || 'var(--green)';
      const tag = entry.type.toUpperCase();
      lines.push({ text: `  <span style="color:var(--gray-light)">${entry.date}</span>  <span style="color:${color};font-weight:500">[${tag}]</span> <span style="color:var(--white);font-weight:500">${entry.title}</span>`, style: '', delay: 50 });
      lines.push({ text: `           <span style="color:var(--gray-light)">${entry.desc}</span>`, style: '', delay: 30 });
      lines.push({ text: '', style: '', delay: 0 });
    });
    t.typeLines(lines);
  }, 'Show journey timeline');

  /* --- skills (desktop only) --- */
  term.register('skills', (_args, t) => {
    if (window.innerWidth < 768) {
      t.writeLine('skills: not available on this device.', 'dim');
      return;
    }
    const lines = [
      { text: 'Skills', style: 'heading', delay: 0 },
      { text: '', style: '', delay: 0 },
    ];

    DATA.skills.forEach(cat => {
      lines.push({ text: `  ${cat.category}`, style: 'sub-heading', delay: 30 });
      cat.items.forEach(skill => {
        const filled = '\u2588'.repeat(skill.level);
        const empty  = '\u2591'.repeat(5 - skill.level);
        const pad = ' '.repeat(Math.max(1, 20 - skill.name.length));
        lines.push({ text: `    ${skill.name}${pad}<span style="color:var(--green)">${filled}</span><span style="color:#333">${empty}</span> ${skill.level}/5`, style: 'white', delay: 40 });
      });
      lines.push({ text: '', style: '', delay: 0 });
    });
    t.typeLines(lines);
  }, 'Display skill categories');

  /* --- contact --- */
  term.register('contact', (_args, t) => {
    const lines = [
      { text: 'Contact', style: 'heading', delay: 0 },
      { text: '', style: '', delay: 0 },
    ];
    DATA.contact.forEach(c => {
      const linkText = c.url.startsWith('#')
        ? `${c.icon} ${c.label}: ${c.note || c.label}`
        : `${c.icon} <a href="${c.url}" target="_blank" rel="noopener">${c.label}</a>${c.note ? ' — ' + c.note : ''}`;
      lines.push({ text: `  ${linkText}`, style: 'link', delay: 50 });
    });
    lines.push({ text: '', style: '', delay: 0 });
    t.typeLines(lines);
  }, 'Show contact links');

  /* --- neofetch (hidden — not shown in help, find it in the source) --- */
  term.register('neofetch', (_args, t) => {
    const ascii = DATA.neofetch.ascii;
    const info = DATA.neofetch.info;
    const keys = Object.keys(info);
    const maxAsciiLen = Math.max(...ascii.map(l => l.length));

    const lines = [];
    for (let i = 0; i < Math.max(ascii.length, keys.length + 2); i++) {
      const artLine = (ascii[i] || '').padEnd(maxAsciiLen + 4);
      let infoLine = '';

      if (i === 0) {
        infoLine = `<span style="color:var(--cyan);font-weight:700">${DATA.user}@${DATA.hostname}</span>`;
      } else if (i === 1) {
        infoLine = '<span style="color:var(--gray)">─'.repeat(25) + '</span>';
      } else if (i - 2 < keys.length) {
        const k = keys[i - 2];
        infoLine = `<span style="color:var(--cyan);font-weight:500">${k}:</span> <span style="color:var(--white)">${info[k]}</span>`;
      }

      lines.push({ text: `<span style="color:var(--cyan)">${t._escapeHtml(artLine)}</span>${infoLine}`, style: '', delay: 35 });
    }
    t.typeLines(lines);
  }, 'System info with ASCII art', null, true);

  /* --- clear --- */
  term.register('clear', (_args, t) => {
    t.clear();
  }, 'Clear terminal');

  /* --- gui --- */
  term.register('gui', (_args, t) => {
    const termEl = document.getElementById('terminal');
    const guiEl = document.getElementById('gui-sections');

    guiMode = !guiMode;

    if (guiMode) {
      termEl.classList.add('gui-mode');
      guiEl.classList.remove('hidden');
      if (!guiPopulated) {
        populateGUI();
        guiPopulated = true;
      }
      t.writeLine('GUI mode <span style="color:var(--green);font-weight:700">ON</span> — scroll down to explore.', 'cyan');
      t.writeLine('Type <span style="color:var(--green)">gui</span> again to toggle off.', 'dim');
    } else {
      termEl.classList.remove('gui-mode');
      guiEl.classList.add('hidden');
      t.writeLine('GUI mode <span style="color:var(--red);font-weight:700">OFF</span> — terminal only.', 'cyan');
    }
  }, 'Toggle GUI mode');

  /* --- date --- */
  term.register('date', (_args, t) => {
    t.writeLine(new Date().toString(), 'white');
  }, 'Show current date');

  /* --- Hidden easter egg commands --- */
  const startTime = Date.now();
  term.register('uptime', (_args, t) => {
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    t.writeLine(`up ${mins}m ${secs}s, 1 user, load average: 0.42, 0.31, 0.27`, 'white');
  }, 'Show session uptime', null, true);

  term.register('echo', (args, t) => {
    t.writeLine(args.join(' '), 'white');
  }, 'Print text', null, true);

  term.register('pwd', (_args, t) => {
    t.writeLine('/home/n0cs/portfolio', 'white');
  }, 'Print working directory', null, true);

  term.register('hostname', (_args, t) => {
    t.writeLine('portfolio.n0cs.local', 'white');
  }, 'Show hostname', null, true);

  term.register('sudo', (args, t) => {
    if (args.length === 0) {
      t.writeLine('usage: sudo <command>', 'error');
      return;
    }
    t.typeLines([
      { text: '[sudo] password for n0cs: ********', style: 'white', delay: 40 },
      { text: 'Nice try. This incident will be reported.', style: 'red', delay: 0 },
    ]);
  }, 'Attempt privilege escalation', null, true);

  term.register('rm', (args, t) => {
    const target = args.join(' ');
    if (target.includes('-rf') || target.includes('-r')) {
      t.typeLines([
        { text: `rm: refusing to destroy ${target}`, style: 'error', delay: 40 },
        { text: 'The defense grid does not approve of this action.', style: 'red', delay: 0 },
      ]);
    } else {
      t.writeLine(`rm: cannot remove '${target}': Operation not permitted`, 'error');
    }
  }, 'Remove files (blocked)', null, true);

  term.register('exit', (_args, t) => {
    t.writeLine('logout', 'white');
    t.writeLine('Connection to portfolio.n0cs.local closed.', 'dim');
    setTimeout(() => {
      t.writeLine('...just kidding. You can\'t leave.', 'amber');
    }, 1500);
  }, 'Attempt to exit');

  /* =============================================
     GUI MODE POPULATION
     ============================================= */
  function populateGUI() {
    // About
    const aboutEl = document.getElementById('gui-about-content');
    let aboutHtml = '<div class="gui-about-text">';
    DATA.bio.about.forEach(line => {
      aboutHtml += line ? `<p style="margin-bottom:0.75rem">${line}</p>` : '';
    });
    aboutHtml += '<p style="margin-top:1rem"><strong style="color:var(--amber)">Focus Areas:</strong></p><ul style="list-style:none;padding:0;margin-top:0.5rem">';
    DATA.bio.focus.forEach(f => {
      aboutHtml += `<li class="focus-area" style="margin-bottom:0.3rem">> ${f}</li>`;
    });
    aboutHtml += '</ul></div>';
    aboutEl.innerHTML = aboutHtml;

    // Contact
    const contactEl = document.getElementById('gui-contact-content');
    contactEl.innerHTML = '<div class="contact-links">' + DATA.contact.map(c => {
      if (c.url.startsWith('#')) {
        return `<span class="contact-link">${c.icon} ${c.label}: ${c.note || ''}</span>`;
      }
      return `<a href="${c.url}" target="_blank" rel="noopener" class="contact-link">${c.icon} ${c.note || c.label}</a>`;
    }).join('') + '</div>';
  }

  /* =============================================
     BOOT
     ============================================= */
  document.addEventListener('DOMContentLoaded', () => {
    term.boot();
  });

})();
