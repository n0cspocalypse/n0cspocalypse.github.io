/* ============================================
   PORTFOLIO DATA — Edit this file to update content
   ============================================ */

const DATA = {
  user: 'n0cs',
  hostname: 'portfolio',
  fullName: 'N0CSPOCALYPSE',
  title: 'Social Engineering Consultant | Cybersecurity Engineer',

  bio: {
    short: 'Social engineering consultant and cybersecurity engineer specializing in corporate and nonprofit security assessments. I test the full attack surface — people, process, and technology.',
    focus: [
      'Social Engineering — Corporate & Nonprofit',
      'Business Process & Approval Pipeline Testing',
      'Organizational Trust & Hierarchy Analysis',
      'Security Awareness Program Design',
      'Offensive Security & Red Teaming',
      'Network Defense & Detection Engineering',
      'Security Automation & AI Agent Systems',
      'Collaborative Engagements — Network, Cloud & Beyond',
    ],
    about: [
      'I specialize in social engineering assessments for corporate and nonprofit organizations. My work targets the human layer — the people, processes, and policies that technical controls alone can\'t protect.',
      '',
      'I bring deep knowledge of corporate and nonprofit business infrastructure: full accounting cycles (AP/AR, GL, financial reporting, audit trails), approval and authorization workflows, procurement processes, board governance structures, and organizational hierarchies. This lets me build engagement scenarios grounded in how these organizations actually operate — not theoretical attacks, but realistic pretexts that mirror the day-to-day business context of the target.',
      '',
      'Engagements include pretexting and vishing campaigns, phishing simulations, physical security walkthroughs, business email compromise scenarios, invoice and payment process testing, and post-assessment awareness training. I assess where trust breaks down across departments, identify weak points in delegation of authority, and deliver actionable remediation roadmaps.',
      '',
      'I don\'t work in a silo. I collaborate with trusted specialists across network security, cloud infrastructure, penetration testing, compliance, and digital forensics. If an engagement requires expertise beyond my core focus — whether it\'s a cloud architecture review, a full-scope red team, or a compliance audit — I bring in the right people. Every assessment is scoped to your organization, and deeper research into your business operations, industry vertical, and threat landscape is always part of the process.',
    ],
  },

  neofetch: {
    ascii: [
      '            .-/+oossssoo+/-.',
      '        `:+ssssssssssssssssss+:`',
      '      -+ssssssssssssssssssyyssss+-',
      '    .ossssssssssssssssssdMMMNysssso.',
      '   /ssssssssssshdmmNNmmyNMMMMhssssss/',
      '  +ssssssssshmydMMMMMMMNddddyssssssss+',
      ' /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/',
      '.ssssssssdMMMNhsssssssssshNMMMdssssssss.',
      '+sssshhhyNMMNyssssssssssssyNMMMysssssss+',
      'ossyNMMMNyMMhsssssssssssssshmmmhssssssso',
      'ossyNMMMNyMMhsssssssssssssshmmmhssssssso',
      '+sssshhhyNMMNyssssssssssssyNMMMysssssss+',
      '.ssssssssdMMMNhsssssssssshNMMMdssssssss.',
      ' /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/',
      '  +sssssssssdmydMMMMMMMMddddyssssssss+',
      '   /ssssssssssshdmNNNNmyNMMMMhssssss/',
      '    .ossssssssssssssssssdMMMNysssso.',
      '      -+sssssssssssssssssyyyssss+-',
      '        `:+ssssssssssssssssss+:`',
      '            .-/+oossssoo+/-.',
    ],
    info: {
      'OS':       'n0csOS 2026',
      'Host':     'Defense Grid',
      'Kernel':   'paranoia-7.7.7-hardened',
      'Uptime':   '24/7/365',
      'Packages': 'nftables, suricata, redis, fastapi',
      'Shell':    'zsh + claude-code',
      'Terminal': 'cyberpunk-portfolio v1.0',
      'Stack':    'Python, Go, Bash, JS',
      'Focus':    'Build. Break. Manipulate. Defend.',
      'Status':   'Always shipping',
    },
  },

  projects: [
    {
      id: 'netwatch',
      name: 'NetWatch',
      tagline: 'Autonomous network defense & monitoring platform',
      description: 'Real-time network monitoring platform with wireless threat detection, BLE device tracking, and automated countermeasures. Multi-sensor architecture with forensic logging, alert pipelines, and a Textual TUI dashboard for live visibility.',
      tech: ['Python', 'SQLite', 'Redis', 'Textual TUI', 'systemd'],
      status: 'ACTIVE',
    },
    {
      id: 'hive',
      name: 'HIVE Cluster',
      tagline: 'Distributed AI agent compute mesh',
      description: 'Distributed task orchestration system for AI agent workloads. FastAPI hub with atomic Redis Lua script task claiming, heartbeat monitoring, automatic failover, and multi-node compute offloading. Designed for parallel security analysis at scale.',
      tech: ['FastAPI', 'Redis', 'Python', 'Lua', 'systemd'],
      status: 'ACTIVE',
    },
    {
      id: 'war-machine',
      name: 'War Machine',
      tagline: 'Full-stack cyber range for adversary simulation',
      description: 'Isolated cyber range environment with segmented network zones, firewall routing, attack boxes, vulnerable targets, web app exploitation labs, SIEM monitoring, and honeypot deployment. Built for continuous red team / blue team exercises and security validation.',
      tech: ['Proxmox', 'OPNsense', 'Kali', 'Wazuh', 'Docker', 'VLANs'],
      status: 'ACTIVE',
    },
    {
      id: 'kimi',
      name: 'Kimi Agent',
      tagline: 'Autonomous AI operations agent',
      description: 'AI-powered operations agent with 30+ skills for security automation. Handles threat analysis, OSINT lookups, system health checks, and scheduled monitoring tasks. Integrates with distributed compute clusters for heavy workloads and pushes alerts through Discord.',
      tech: ['Python', 'Claude API', 'Discord.py', 'Redis', 'systemd'],
      status: 'ACTIVE',
    },
    {
      id: 'sentinel',
      name: 'Sentinel',
      tagline: 'IDS pipeline with forensic event routing',
      description: 'Intrusion detection pipeline built on Suricata with MITRE ATT&CK mapping, severity-based event routing, rate limiting, deduplication, and multi-destination alert delivery. Events flow through a pub/sub bridge into forensic storage and automated triage.',
      tech: ['Suricata', 'Python', 'Redis', 'Prometheus', 'Grafana'],
      status: 'ACTIVE',
    },
    {
      id: 'osint-toolkit',
      name: 'OSINT Toolkit',
      tagline: 'Unified launcher for recon & intelligence tools',
      description: 'Curated collection of OSINT and reconnaissance tools behind a unified CLI launcher. Integrates Shodan, Sherlock, Recon-ng, Amass, Subfinder, Nuclei, and custom scripts with centralized API key management and deployment automation.',
      tech: ['Python', 'Go', 'Bash', 'Docker', 'Shodan API'],
      status: 'ACTIVE',
    },
  ],

  timeline: [
    { date: '2026-02', title: 'HIVE Cluster goes live', desc: 'Distributed AI compute mesh operational with atomic task claiming and multi-node coordination.', type: 'deploy' },
    { date: '2026-02', title: 'Sentinel IDS pipeline deployed', desc: 'End-to-end Suricata event pipeline with MITRE mapping, severity routing, and automated triage.', type: 'deploy' },
    { date: '2026-02', title: 'Cyber range Phase 1 complete', desc: 'Full adversary simulation environment with isolated network segments, SIEM, and honeypot.', type: 'milestone' },
    { date: '2026-02', title: 'Wireless threat detection live', desc: 'Multi-band monitoring with BLE correlation and automated countermeasures.', type: 'security' },
    { date: '2026-02', title: 'Infrastructure hardening sweep', desc: 'SSH lockdown, firewall policy review, DNS filtering, and access control enforcement.', type: 'security' },
    { date: '2026-01', title: 'NetWatch collector operational', desc: '24/7 network monitoring with forensic logging and Discord alert pipeline.', type: 'deploy' },
    { date: '2026-01', title: 'Kimi Agent reaches 30+ skills', desc: 'Autonomous AI agent with cron automation, OSINT, and threat analysis capabilities.', type: 'milestone' },
    { date: '2025', title: 'Lab foundation built', desc: 'Core infrastructure stood up — compute nodes, monitoring, and network security baseline.', type: 'milestone' },
  ],

  skills: [
    {
      category: 'Social Engineering',
      items: [
        { name: 'Pretexting / Vishing', level: 5 },
        { name: 'Phishing Simulations', level: 5 },
        { name: 'BEC / Invoice Fraud', level: 5 },
        { name: 'Physical Security', level: 4 },
        { name: 'Awareness Training', level: 5 },
      ],
    },
    {
      category: 'Business Infrastructure',
      items: [
        { name: 'Accounting Cycles', level: 5 },
        { name: 'Approval Workflows', level: 5 },
        { name: 'Org Hierarchy Analysis', level: 5 },
        { name: 'Procurement / AP/AR', level: 5 },
        { name: 'Nonprofit Governance', level: 5 },
      ],
    },
    {
      category: 'Network Security',
      items: [
        { name: 'Firewalls/nftables', level: 5 },
        { name: 'IDS/IPS', level: 4 },
        { name: 'VPN Engineering', level: 4 },
        { name: 'WiFi Security', level: 5 },
        { name: 'Packet Analysis', level: 4 },
      ],
    },
    {
      category: 'Offensive Security',
      items: [
        { name: 'Penetration Testing', level: 4 },
        { name: 'OSINT / Recon', level: 4 },
        { name: 'Wireless Attacks', level: 5 },
        { name: 'Web App Security', level: 3 },
        { name: 'Exploit Dev', level: 3 },
      ],
    },
    {
      category: 'Infrastructure',
      items: [
        { name: 'Linux Admin', level: 5 },
        { name: 'Virtualization', level: 4 },
        { name: 'Docker', level: 4 },
        { name: 'systemd', level: 5 },
        { name: 'Networking', level: 5 },
      ],
    },
    {
      category: 'Development',
      items: [
        { name: 'Python', level: 5 },
        { name: 'Bash / Shell', level: 5 },
        { name: 'FastAPI / Redis', level: 4 },
        { name: 'JavaScript', level: 3 },
        { name: 'C / C++', level: 3 },
      ],
    },
    {
      category: 'AI & Automation',
      items: [
        { name: 'LLM APIs', level: 5 },
        { name: 'Agent Systems', level: 4 },
        { name: 'Local LLM Ops', level: 3 },
        { name: 'Task Automation', level: 5 },
        { name: 'Bot Development', level: 4 },
      ],
    },
    {
      category: 'Monitoring & IR',
      items: [
        { name: 'SIEM', level: 4 },
        { name: 'Prometheus', level: 3 },
        { name: 'Grafana', level: 3 },
        { name: 'Log Analysis', level: 4 },
        { name: 'Incident Response', level: 4 },
      ],
    },
  ],

  contact: [
    { label: 'GitHub', url: 'https://github.com/n0cspocalypse', icon: '[gh]', note: 'github.com/n0cspocalypse' },
    { label: 'X', url: 'https://x.com/rarely_n0cs', icon: '[x]', note: '@rarely_n0cs' },
    { label: 'Email', url: 'mailto:n0ckywoky@proton.me', icon: '[em]', note: 'n0ckywoky@proton.me' },
  ],
};
