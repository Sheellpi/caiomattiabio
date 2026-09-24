// CONFIGURATION
const CONFIG = {
  // Profile Information
  profile: {
    username: 'mattia',
    bio: 'together in death',
    avatar: 'https://avatars.fastly.steamstatic.com/089f048ba25d36869533d8b9fb8b0697d7976ad4_full.jpg'
  },

  // Background Music
  music: {
    enabled: true,
    url: 'https://audio.jukehost.co.uk/89J0RgVA0RMVykDzLnoBzhKloTEysCFJ',
    currentTrack: 'Background Music',
    volume: 0.5
  }
};

// DOM ELEMENTS
const elements = {
  enterOverlay: document.getElementById('enter-overlay'),
  enterBtn: document.getElementById('enterBtn'),
  profileAvatar: document.getElementById('profileAvatar'),
  username: document.getElementById('username'),
  bio: document.getElementById('bio'),
  musicPlayer: document.getElementById('musicPlayer'),
  playBtn: document.getElementById('playBtn'),
  progressFill: document.getElementById('progressFill')
};

// Audio element
let backgroundMusic = null;
let isPlaying = false;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initializeEnterOverlay();
  initializeProfile();
  initializeTabs();
  initializeMusicPlayer();
  initializeAnimations();
  initializeParticles();
  initializeRippleEffects();
  initializeDiscordTooltip();
  initializeCustomCursor();
});

// ENTER OVERLAY
function initializeEnterOverlay() {
  if (!elements.enterOverlay || !elements.enterBtn) return;

  elements.enterBtn.addEventListener('click', () => {
    elements.enterOverlay.classList.add('fade-out');

    // Auto-play music when entering
    if (backgroundMusic) {
      backgroundMusic.play().catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
      isPlaying = true;

      // Update play button to show pause icon
      if (elements.playBtn) {
        elements.playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
      }
    }

    setTimeout(() => {
      elements.enterOverlay.remove();
    }, 800);
  });
}

// PROFILE INITIALIZATION
function initializeProfile() {
  if (elements.username) elements.username.textContent = CONFIG.profile.username;
  if (elements.bio) elements.bio.textContent = CONFIG.profile.bio;
  if (elements.profileAvatar) elements.profileAvatar.src = CONFIG.profile.avatar;
}

// TAB NAVIGATION
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const tabIndicator = document.querySelector('.tab-indicator');
  const profileCard = document.querySelector('.profile-card');
  const tabNavigation = document.querySelector('.tab-navigation');

  if (!tabButtons.length || !tabPanels.length || !tabIndicator) return;

  // Function to switch tabs
  function switchTab(tabName) {
    // Remove active class from all buttons and panels
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));

    // Add active class to selected button and panel
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    const activePanel = document.querySelector(`[data-panel="${tabName}"]`);

    if (activeButton && activePanel) {
      activeButton.classList.add('active');
      activePanel.classList.add('active');

      // Move indicator
      const buttonIndex = Array.from(tabButtons).indexOf(activeButton);
      const buttonWidth = activeButton.offsetWidth;
      const buttonLeft = activeButton.offsetLeft;

      tabIndicator.style.transform = `translateX(${buttonLeft - 4}px)`;
      tabIndicator.style.width = `${buttonWidth}px`;
    }
  }

  // Add click event listeners to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      switchTab(tabName);
    });
  });

  // Add hover effect for 3D card transformation on entire navigation area
  if (tabNavigation && profileCard) {
    tabNavigation.addEventListener('mouseenter', () => {
      // Get the active tab to apply its specific effect
      const activeButton = document.querySelector('.tab-button.active');
      const tabName = activeButton ? activeButton.getAttribute('data-tab') : 'portfolio';

      // Remove all hover classes
      profileCard.classList.remove('tab-hover-profile', 'tab-hover-portfolio', 'tab-hover-about');

      // Add specific hover class based on active tab
      profileCard.classList.add(`tab-hover-${tabName}`);
    });

    tabNavigation.addEventListener('mouseleave', () => {
      // Remove all hover classes
      profileCard.classList.remove('tab-hover-profile', 'tab-hover-portfolio', 'tab-hover-about');
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const activeButton = document.querySelector('.tab-button.active');
      const currentIndex = Array.from(tabButtons).indexOf(activeButton);

      let newIndex;
      if (e.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
      } else {
        newIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
      }

      const newTab = tabButtons[newIndex].getAttribute('data-tab');
      switchTab(newTab);
    }
  });

  // Initialize first tab
  switchTab('profile');
}

// MUSIC PLAYER
function initializeMusicPlayer() {
  if (!CONFIG.music.enabled || !elements.musicPlayer) return;

  // Show music player
  elements.musicPlayer.classList.remove('hidden');

  // Create audio element
  backgroundMusic = new Audio(CONFIG.music.url);
  backgroundMusic.loop = true;
  backgroundMusic.volume = CONFIG.music.volume;

  // Play/Pause button
  if (elements.playBtn) {
    elements.playBtn.addEventListener('click', () => {
      if (isPlaying) {
        backgroundMusic.pause();
        elements.playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      } else {
        backgroundMusic.play().catch(err => {
          console.log('Audio playback prevented:', err);
        });
        elements.playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
      }
      isPlaying = !isPlaying;
    });
  }

  // Update progress bar
  backgroundMusic.addEventListener('timeupdate', () => {
    if (elements.progressFill && backgroundMusic.duration) {
      const progress = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
      elements.progressFill.style.width = progress + '%';
    }
  });
}

// RIPPLE EFFECT
function initializeRippleEffects() {
  document.querySelectorAll('button:not(#enterBtn), .social-icon').forEach(element => {
    element.addEventListener('click', createRipple);
  });
}

function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');

  // Add ripple styles if not already in CSS
  if (!document.querySelector('style[data-ripple]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ripple', 'true');
    style.textContent = `
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }

  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

// SCROLL ANIMATIONS
function initializeAnimations() {
  // Intersection Observer for fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
}

// ============================================
// CONSTELLATION BACKGROUND
// ============================================
function initializeParticles() {
  const background = document.querySelector('.background');
  if (!background) return;

  // Create canvas for constellation
  const canvas = document.createElement('canvas');
  canvas.className = 'constellation-canvas';
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  `;
  background.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animationId;

  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  // Star class
  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.speedY = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.5 + 0.5;
      this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      this.twinkleDirection = 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around screen
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // Twinkling effect
      this.opacity += this.twinkleSpeed * this.twinkleDirection;
      if (this.opacity >= 1 || this.opacity <= 0.3) {
        this.twinkleDirection *= -1;
      }
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect for larger stars
      if (this.size > 1.5) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  // Initialize stars
  function initStars() {
    stars = [];
    const numStars = Math.floor((canvas.width * canvas.height) / 8000);
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star());
    }
  }

  // Draw connections between nearby stars
  function drawConnections() {
    const maxDistance = 150;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;

    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw stars
    stars.forEach(star => {
      star.update();
      star.draw();
    });

    // Draw constellation connections
    drawConnections();

    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  resizeCanvas();
  animate();

  // Handle resize
  window.addEventListener('resize', resizeCanvas);

  // Cleanup
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resizeCanvas);
  };
}

function createParticle(container) {
  // This function is no longer needed but kept for compatibility
}

// DISCORD TOOLTIP
function initializeDiscordTooltip() {
  const discordBadge = document.getElementById('discordBadge');
  if (!discordBadge) return;

  const discordUsername = discordBadge.getAttribute('data-discord');
  let tooltip = null;

  // Create tooltip element
  function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.className = 'discord-tooltip';
    tooltip.innerHTML = `
      <div class="discord-tooltip-content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
        <span class="discord-username">${discordUsername}</span>
      </div>
    `;
    document.body.appendChild(tooltip);

    // Add tooltip styles
    if (!document.querySelector('style[data-discord-tooltip]')) {
      const style = document.createElement('style');
      style.setAttribute('data-discord-tooltip', 'true');
      style.textContent = `
        .discord-tooltip {
          position: fixed;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          pointer-events: none;
          z-index: 10001;
          opacity: 0;
          transform: translateY(-5px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
        }
        .discord-tooltip.show {
          opacity: 1;
          transform: translateY(0);
        }
        .discord-tooltip-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .discord-username {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.5px;
        }
        .discord-badge {
          cursor: pointer;
          position: relative;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Show tooltip
  function showTooltip(e) {
    if (!tooltip) createTooltip();

    const rect = discordBadge.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

    setTimeout(() => tooltip.classList.add('show'), 10);
  }

  // Hide tooltip
  function hideTooltip() {
    if (tooltip) {
      tooltip.classList.remove('show');
    }
  }

  // Copy to clipboard on click
  function copyDiscord() {
    if (!tooltip) return;

    const originalText = tooltip.querySelector('.discord-username').textContent;

    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(discordUsername).then(() => {
        tooltip.querySelector('.discord-username').textContent = 'Copiado! ✓';
        setTimeout(() => {
          if (tooltip) {
            tooltip.querySelector('.discord-username').textContent = originalText;
          }
        }, 1500);
      }).catch(() => {
        // Fallback for older browsers
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  }

  // Fallback copy method for older mobile browsers
  function fallbackCopy() {
    const textArea = document.createElement('textarea');
    textArea.value = discordUsername;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      if (tooltip) {
        tooltip.querySelector('.discord-username').textContent = 'Copiado! ✓';
        setTimeout(() => {
          if (tooltip) {
            tooltip.querySelector('.discord-username').textContent = discordUsername;
          }
        }, 1500);
      }
    } catch (err) {
      console.log('Erro ao copiar:', err);
      if (tooltip) {
        tooltip.querySelector('.discord-username').textContent = discordUsername;
      }
    }

    document.body.removeChild(textArea);
  }

  // Event listeners
  discordBadge.addEventListener('mouseenter', showTooltip);
  discordBadge.addEventListener('mouseleave', hideTooltip);
  discordBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    copyDiscord();
  });

  // Enhanced touch support for mobile
  let touchTimeout;
  discordBadge.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Show tooltip immediately
    showTooltip(e);

    // Clear any existing timeout
    if (touchTimeout) clearTimeout(touchTimeout);

    // Set timeout to hide tooltip and copy
    touchTimeout = setTimeout(() => {
      copyDiscord();
      setTimeout(hideTooltip, 1500);
    }, 100);
  });

  // Prevent default touch behavior
  discordBadge.addEventListener('touchend', (e) => {
    e.preventDefault();
  });

  // Hide tooltip when touching elsewhere
  document.addEventListener('touchstart', (e) => {
    if (!discordBadge.contains(e.target) && tooltip) {
      hideTooltip();
    }
  });
}

// ============================================
// CUSTOM CURSOR WITH TRAIL
// ============================================
function initializeCustomCursor() {
  // Check if device supports hover (not touch device)
  if (window.matchMedia('(hover: none)').matches) {
    return;
  }

  // Create cursor element
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  // Object Pool for trail particles
  const trailParticles = [];
  const maxTrailLength = 15;
  let activeParticles = 0;
  
  // Initialize the pool with elements
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < maxTrailLength; i++) {
    const particle = document.createElement('div');
    particle.className = 'cursor-trail';
    // Hide initially
    particle.style.opacity = '0';
    particle.style.transform = 'translate(-50%, -50%) scale(0)';
    fragment.appendChild(particle);
    
    trailParticles.push({
      element: particle,
      life: 0,
      x: 0,
      y: 0,
      active: false
    });
  }
  document.body.appendChild(fragment);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let lastTrailX = 0;
  let lastTrailY = 0;
  let frameCount = 0;

  // Mouse move event
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Mouse down/up events for click effect
  document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
  });

  // Activate a particle from the pool
  function spawnTrailParticle(x, y) {
    // Find first inactive particle
    let p = trailParticles.find(p => !p.active);
    
    // If all are active, reuse the oldest one
    if (!p) {
        // Find particle with lowest life (oldest)
        p = trailParticles[0];
        let lowestLife = p.life;
        for(let i = 1; i < trailParticles.length; i++) {
            if(trailParticles[i].life < lowestLife) {
                p = trailParticles[i];
                lowestLife = p.life;
            }
        }
    }

    p.active = true;
    p.life = 1;
    p.x = x;
    p.y = y;
    
    // Set initial position immediately to avoid lag 
    p.element.style.left = x + 'px';
    p.element.style.top = y + 'px';
    p.element.style.opacity = '0.6';
    p.element.style.transform = 'translate(-50%, -50%) scale(1)';
  }

  // Animation loop
  function animate() {
    // Less smooth cursor movement (more responsive)
    const speed = 0.35;
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Spawn trail particles behind the cursor (every 2 frames)
    frameCount++;
    if (frameCount % 2 === 0) {
      const distance = Math.sqrt(
        Math.pow(cursorX - lastTrailX, 2) + Math.pow(cursorY - lastTrailY, 2)
      );

      // Only create trail if cursor moved enough
      if (distance > 5) {
        spawnTrailParticle(cursorX, cursorY);
        lastTrailX = cursorX;
        lastTrailY = cursorY;
      }
    }

    // Update trail particles
    for (let i = 0; i < maxTrailLength; i++) {
      const particle = trailParticles[i];
      if (particle.active) {
        particle.life -= 0.05;

        if (particle.life <= 0) {
          particle.active = false;
          particle.element.style.opacity = '0';
        } else {
          // Hardware acceleration friendly transformation
          particle.element.style.opacity = (particle.life * 0.6).toFixed(2);
          particle.element.style.transform = `translate(-50%, -50%) scale(${particle.life.toFixed(2)})`;
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
}

// Console welcome message
console.log('%cMattia', 'font-size: 20px; font-weight: bold; color: #ffffff;');
console.log('%cMusic player enabled - Click play to start', 'font-size: 12px; color: #a3a3a3;');
