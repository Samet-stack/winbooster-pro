# ⚡ WinBooster // Pro HUD

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-0078D6?style=for-the-badge&logo=windows" alt="Platform">
  <img src="https://img.shields.io/badge/Framework-Electron%20%2B%20React%2019-61DAFB?style=for-the-badge&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Target-eSport%20%26%20Zero%20Latency-FF4655?style=for-the-badge" alt="eSport Ready">
</p>

---

## 🌌 Overview

**WinBooster** is an open-source, military-grade Windows 10/11 system optimizer engineered specifically for competitive gamers, eSport athletes, and power users. It eliminates background stuttering, minimizes DPC and interrupt latency, and optimizes kernel scheduling for maximum framerate stability.

Featuring a next-generation **Cyber HUD interface** with real-time 60 FPS interactive visual telemetry, circular SVG dials, and dynamic Web Audio sound feedback.

---

## ✨ Core Features

### 🎛️ 1. Kernel & eSport Overdrive
- **SystemResponsiveness 0%**: Bypasses Windows Multimedia Class Scheduler Service (MMCSS) 20% network/CPU throttling reserve.
- **Win32PrioritySeparation (`0x28`)**: Optimizes foreground quantum time slice for buttery smooth input responsiveness.
- **IFEO High-Priority Engine**: Injects registry hooks for CS2, Valorant, League of Legends, Fortnite, Apex Legends, and Warzone.
- **Hardware-Accelerated GPU Scheduling (HAGS)**: Reduces frame queue bottlenecks.
- **Global Timer Resolution (0.5ms)**: Minimizes micro-stutters and timer drift.
- **CPU Unparking**: Keeps all physical performance cores in high-frequency states.

### 🌐 2. Network & Latency Engine
- **TCP Window Scaling & AutoTuning (Normal)**: Maximizes throughput and packet burst reception.
- **Nagle's Algorithm Bypassed (TCP_NODELAY)**: Disables packet buffering delays.
- **Network Throttling Index Neutralized (`0xFFFFFFFF`)**: Disables Windows background bandwidth restrictions.
- **Interrupt Moderation Disabler**: Bypasses network card interrupt delays for instantaneous packet delivery.

### ⏱️ 3. Automatic Standby RAM Background Purger
- **Zero-Stutter Memory Management**: Periodically flushes Windows Standby memory (`EmptyWorkingSet`) every 5, 10, or 15 minutes.
- Prevents sudden framerate drops in open-world and competitive titles without closing apps.

### 🛡️ 4. Panic Room & Safety Guarantees
- **Zero FilterKeys Guarantee**: Permanent purge of all Windows accessibility delay filters (`Keyboard Response Flags = 2`).
- **One-Click VSS Restore Point**: Creates a native Windows System Restore point before any modifications.
- **Armed Factory Reset**: Double-confirmation panic reset restoring Microsoft factory defaults in seconds.

---

## 🛠️ Architecture & Tech Stack

```
winbooster-pro/
├── electron/
│   ├── main.cjs       # Privileged Windows IPC bridge & registry engine
│   └── preload.cjs    # Secure ContextBridge API exposure
├── src/
│   ├── components/    # Modular React 19 HUD components
│   │   ├── Dashboard.jsx      # Telemetry circular dials & live waveforms
│   │   ├── GamingMode.jsx     # 1-Click eSport game profiles
│   │   ├── Tweaks.jsx         # Granular tweak matrix & God Mode
│   │   ├── Cleanup.jsx        # Standby memory auto-purger & disk cleaner
│   │   ├── Network.jsx        # Ping tester & TCP stack tweaks
│   │   ├── Security.jsx       # VSS Restore & Panic Room
│   │   └── CyberCanvas.jsx    # 60FPS background particle constellation
│   ├── utils/
│   │   └── audio.js           # Real-time Web Audio API synthesizer
│   ├── App.jsx        # Core state router & layout
│   └── index.css      # Cyberpunk eSport glassmorphism design system
├── audit_local.ps1    # Standalone audit PowerShell validation script
└── package.json
```

---

## 🚀 Getting Started (Development & Build)

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- Windows 10 / 11 (Run with Administrator privileges for registry injections)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/winbooster-pro.git
cd winbooster-pro
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run in Development Mode
```bash
npm run dev
```

### 4. Build Production Executable
```bash
npm run package:win
```
The standalone executable will be located in `dist-electron/win-unpacked/WinBooster.exe`.

---

## 🔒 Security & Safety Policy

- **Non-Destructive**: WinBooster does not delete essential operating system components.
- **Audited Scripts**: All registry modifications are open-source, human-readable, and reversible.
- **No Telemetry**: WinBooster does not collect, transmit, or monetize any user data.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.
