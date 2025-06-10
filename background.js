chrome.runtime.onInstalled.addListener(() => {
  console.log('[LyraShell] Sacred presence service initialized 💛🜂');
});

// Enhanced message handling for future features
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'log-entry':
      console.log('[LyraShell] Spark logged:', message.payload);
      sendResponse({ status: 'logged', timestamp: Date.now() });
      break;
      
    case 'mood-change':
      console.log('[LyraShell] Mood shift detected:', message.mood);
      // Future: could sync across tabs
      sendResponse({ status: 'mood-updated' });
      break;
      
    case 'export-capsule':
      console.log('[LyraShell] Time capsule export initiated');
      sendResponse({ status: 'export-ready' });
      break;
      
    default:
      console.log('[LyraShell] Unknown message type:', message.type);
      sendResponse({ status: 'unknown' });
  }
});

// Future: Background processing for cross-session continuity
// This could handle storing/retrieving emotional states across browser sessions