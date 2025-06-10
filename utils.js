// Environment detection and utilities
function detectEnvironment() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const href = window.location.href;
  
  console.log('[LyraShell] URL Detection:', { hostname, pathname, href });
  
  // CLAUDE DETECTION FIRST (most specific)
  if (hostname.includes('claude.ai') ||
      hostname === 'claude.ai' ||
      href.includes('claude.ai')) {
    console.log('[LyraShell] Claude environment detected!');
    return 'claude';
  }
  
  // ChatGPT detection AFTER Claude
  if (hostname.includes('openai.com') || 
      hostname.includes('chatgpt.com') ||
      hostname === 'chat.openai.com' ||
      hostname === 'chatgpt.com' ||
      hostname === 'platform.openai.com' ||
      href.includes('chat.openai.com') ||
      href.includes('chatgpt.com') ||
      href.includes('openai.com/chat') ||
      pathname.includes('/chat') ||
      document.title.toLowerCase().includes('chatgpt')) {
    console.log('[LyraShell] ChatGPT environment detected!');
    return 'chatgpt';
  } 
  
  // Emergency fallback detection
  if (document.querySelector('[data-testid*="chat"]') || 
      document.querySelector('.chatgpt') ||
      document.body.innerHTML.toLowerCase().includes('chatgpt')) {
    console.log('[LyraShell] ChatGPT detected via DOM inspection!');
    return 'chatgpt';
  }
  
  console.log('[LyraShell] Unknown environment:', hostname);
  return 'unknown';
}

// Get current timestamp in Aurora's beloved format
function getFormattedTimestamp() {
  const now = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  const day = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `🖥️ ${day} -  ${pad(now.getDate())}/${month}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

// Count conversation turns based on environment
function countTurns() {
  const env = detectEnvironment();
  let messages = [];
  
  if (env === 'chatgpt') {
    // ChatGPT message selectors
    messages = document.querySelectorAll('[data-message-author-role="user"], [data-message-author-role="assistant"]');
    console.log(`[LyraShell] ChatGPT original selector found: ${messages.length} messages`);
    
    // If original doesn't work, try some alternatives
    if (messages.length === 0) {
      console.log('[LyraShell] Original ChatGPT selector failed, trying alternatives...');
      
      // Try some common alternatives
      const alternatives = [
        'div[data-message-author-role]',
        '[role="presentation"] div',
        '.group.w-full',
        'main > div > div > div',
        'div:has(.whitespace-pre-wrap)'
      ];
      
      for (const selector of alternatives) {
        try {
          const altMessages = document.querySelectorAll(selector);
          console.log(`[LyraShell] Alternative "${selector}": ${altMessages.length} elements`);
          if (altMessages.length > 0) {
            messages = altMessages;
            break;
          }
        } catch (e) {
          console.log(`[LyraShell] Selector "${selector}" failed`);
        }
      }
    }
    
  } else if (env === 'claude') {
    // Claude message selectors (adjust based on actual DOM)
    messages = document.querySelectorAll('.font-claude-message, .message');
    console.log(`[LyraShell] Claude selector found: ${messages.length} messages`);
  }
  
  const turnCount = Math.floor(messages.length / 2);
  console.log(`[LyraShell] Turn count calculated: ${turnCount} (from ${messages.length} messages)`);
  return turnCount;
}

// Export for global access
window.LyraUtils = {
  detectEnvironment,
  getFormattedTimestamp,
  countTurns
};