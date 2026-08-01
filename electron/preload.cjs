const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // System info
  getSysInfo: () => ipcRenderer.invoke('get-sys-info'),
  getProcesses: () => ipcRenderer.invoke('get-processes'),
  killProcess: (pid) => ipcRenderer.invoke('kill-process', pid),
  getPlatformInfo: () => ipcRenderer.invoke('get-platform-info'),

  // Window controls
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),

  // History & Auto-Launch
  getHistory: () => ipcRenderer.invoke('get-history'),
  saveHistory: (data) => ipcRenderer.invoke('save-history', data),
  getAutoLaunch: () => ipcRenderer.invoke('get-auto-launch'),
  setAutoLaunch: (enable) => ipcRenderer.invoke('set-auto-launch', enable),

  // Cleanup
  cleanApt: () => ipcRenderer.invoke('clean-apt'),
  cleanJournals: () => ipcRenderer.invoke('clean-journals'),
  cleanThumbnails: () => ipcRenderer.invoke('clean-thumbnails'),
  cleanFlatpak: () => ipcRenderer.invoke('clean-flatpak'),
  cleanSnap: () => ipcRenderer.invoke('clean-snap'),
  cleanTemp: () => ipcRenderer.invoke('clean-temp'),
  cleanRam: () => ipcRenderer.invoke('clean-ram'),
  cleanAll: () => ipcRenderer.invoke('clean-all'),

  // Gaming mode
  gamingModeOn: () => ipcRenderer.invoke('gaming-mode-on'),
  gamingModeOff: () => ipcRenderer.invoke('gaming-mode-off'),

  // Individual optimizations
  testPing: () => ipcRenderer.invoke('test-ping'),
  setGovernor: (gov) => ipcRenderer.invoke('set-governor', gov),
  enableBbr: () => ipcRenderer.invoke('enable-bbr'),
  setIoScheduler: (sched) => ipcRenderer.invoke('set-io-scheduler', sched),
  getIoSchedulers: () => ipcRenderer.invoke('get-io-schedulers'),
  setSwappiness: (val) => ipcRenderer.invoke('set-swappiness', val),
  disableUsbAutosuspend: () => ipcRenderer.invoke('disable-usb-autosuspend'),
  toggleCompositor: (disable) => ipcRenderer.invoke('toggle-compositor', disable),

  // Advanced eSport
  enableHags: () => ipcRenderer.invoke('enable-hags'),
  enableTimerResolution: () => ipcRenderer.invoke('enable-timer-resolution'),
  unparkCpu: () => ipcRenderer.invoke('unpark-cpu'),
  killDvr: () => ipcRenderer.invoke('kill-dvr'),
  disableInterruptModeration: () => ipcRenderer.invoke('disable-interrupt-moderation'),
  enableMsi: () => ipcRenderer.invoke('enable-msi'),
  
  enableSystemResponsiveness: () => ipcRenderer.invoke('enable-system-responsiveness'),
  enableInputBuffers: () => ipcRenderer.invoke('enable-input-buffers'),
  disableNdu: () => ipcRenderer.invoke('disable-ndu'),
  disableTimers: () => ipcRenderer.invoke('disable-timers'),
  disableTcpChimney: () => ipcRenderer.invoke('disable-tcp-chimney'),
  disableTelemetry: () => ipcRenderer.invoke('disable-telemetry'),
  
  enableIfeo: () => ipcRenderer.invoke('enable-ifeo'),
  enableTcpProfile: () => ipcRenderer.invoke('enable-tcp-profile'),
  enablePrioritySep: () => ipcRenderer.invoke('enable-priority-sep'),
  disableSpectre: () => ipcRenderer.invoke('disable-spectre'),
  disableVbs: () => ipcRenderer.invoke('disable-vbs'),
  enableFse: () => ipcRenderer.invoke('enable-fse'),
  enableGpuTdr: () => ipcRenderer.invoke('enable-gpu-tdr'),
  enableActiveCooling: () => ipcRenderer.invoke('enable-active-cooling'),
  disableQosP2p: () => ipcRenderer.invoke('disable-qos-p2p'),
  
  createRestorePoint: () => ipcRenderer.invoke('create-restore-point'),
  factoryReset: () => ipcRenderer.invoke('factory-reset'),
  disableFilterKeys: () => ipcRenderer.invoke('disable-filterkeys'),
  
  // Auto-Boost & Auto-Purge
  startAutoBoost: () => ipcRenderer.invoke('start-auto-boost'),
  stopAutoBoost: () => ipcRenderer.invoke('stop-auto-boost'),
  startAutoRamPurge: (interval) => ipcRenderer.invoke('start-auto-ram-purge', interval),
  stopAutoRamPurge: () => ipcRenderer.invoke('stop-auto-ram-purge'),
  getAutoRamPurgeStatus: () => ipcRenderer.invoke('get-auto-ram-purge-status'),

  // Debloat
  debloatOnedrive: () => ipcRenderer.invoke('debloat-onedrive'),
  debloatCortana: () => ipcRenderer.invoke('debloat-cortana'),
  debloatUwp: () => ipcRenderer.invoke('debloat-uwp'),

  // Services
  getServices: () => ipcRenderer.invoke('get-services'),
  toggleService: (data) => ipcRenderer.invoke('toggle-service', data),
  getBootTime: () => ipcRenderer.invoke('get-boot-time'),

  // Disk
  getDiskUsage: () => ipcRenderer.invoke('get-disk-usage'),
});
