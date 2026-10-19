/* ==========================================================
       CONFIGURABLE SETTINGS
       ========================================================== */
    // Default relationship start date (Easily configured in code)
    // Default: February 14, 2024 at 00:00:00
    let RELATIONSHIP_START_DATE = new Date("2024-02-14T00:00:00");

    // Load custom date if saved in browser
    try {
      const savedDate = localStorage.getItem("romantic_anniversary_date");
      if (savedDate) {
        RELATIONSHIP_START_DATE = new Date(savedDate);
      }
    } catch (e) {
      console.warn("Storage access restricted:", e);
    }

    // Letters content matching reference video exactly
    const LETTERS = [
      {
        body: "Hey Jaan...<br><br>Pata hai... Main ye sab normally bol nahi pata...<br><br>Lekin aaj dil ne kaha... Risk le le...<br><br>Kyuki kuch log baar baar nahi milte."
      },
      {
        body: "Jab bhi tum online aati ho...<br><br>Mera mood automatically better ho jata hai."
      },
      {
        body: "Tumhare messages...<br><br>Mere din ka favourite notification hote hain."
      },
      {
        body: "Honestly...<br><br>Tum meri life ki sabse pyari coincidence ho."
      }
    ];

    // Questions progression matching video
    const DATE_QUESTIONS = [
      { title: "Coffee Date?", btn1: "YES", btn2: "OF COURSE" },
      { title: "Long Walk?", btn1: "YES", btn2: "DEFINITELY" },
      { title: "Late Night Talks?", btn1: "YES", btn2: "ALWAYS" }
    ];

    /* ==========================================================
       SCREEN NAVIGATION CONTROLLER
       ========================================================== */
    let currentScreenIndex = 1;

    function showScreen(screenNum) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const nextScreen = document.getElementById(`screen-${screenNum}`);
      if (nextScreen) {
        nextScreen.classList.add('active');
        currentScreenIndex = screenNum;
      }
    }

    /* ==========================================================
       SCREEN 1: WELCOME & PROGRESS LOADING
       ========================================================== */
    const statusText = document.getElementById('status-text');
    const progressFill = document.getElementById('progress-fill');
    const counterText = document.getElementById('counter-text');

    const loadingStages = [
      { pct: 0, text: "Initializing Love.exe..." },
      { pct: 30, text: "Scanning memory for your smile..." },
      { pct: 60, text: "Searching for the prettiest smile..." },
      { pct: 90, text: "Connecting heartbeats..." },
      { pct: 100, text: "Found 1 Result ❤️" }
    ];

    function startLoadingSequence() {
      let progress = 0;
      progressFill.style.width = '0%';
      counterText.textContent = '0%';
      statusText.textContent = "Initializing Love.exe...";

      const duration = 3200; // Total ms
      const intervalMs = 30;
      const step = 100 / (duration / intervalMs);

      const timer = setInterval(() => {
        progress += step;
        if (progress >= 100) {
          progress = 100;
          clearInterval(timer);
          progressFill.style.width = '100%';
          counterText.textContent = '100%';

          // Smoothly advance to Screen 2
          setTimeout(() => {
            showScreen(2);
          }, 600);
        } else {
          progressFill.style.width = `${Math.floor(progress)}%`;
          counterText.textContent = `${Math.floor(progress)}%`;

          // Update romantic status text based on progress
          for (let i = loadingStages.length - 1; i >= 0; i--) {
            if (progress >= loadingStages[i].pct) {
              statusText.textContent = loadingStages[i].text;
              break;
            }
          }
        }
      }, intervalMs);
    }

    /* ==========================================================
       SCREEN 2: RESULT FOUND
       ========================================================== */
    document.getElementById('btn-open-result').addEventListener('click', () => {
      showScreen(3);
    });

    /* ==========================================================
       SCREEN 3: ENVELOPE & LETTERS
       ========================================================== */
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelopeStage = document.getElementById('envelope-stage');
    const letterCardContainer = document.getElementById('letter-card-container');
    const letterText = document.getElementById('letter-text');
    const btnLetterNext = document.getElementById('btn-letter-next');
    let currentLetterIdx = 0;

    function renderLetter(idx) {
      letterText.style.opacity = '0';
      setTimeout(() => {
        letterText.innerHTML = LETTERS[idx].body;
        letterText.style.opacity = '1';
        
        // Update nav dots
        const dots = document.querySelectorAll('#letter-nav-dots .nav-dot');
        dots.forEach((d, i) => {
          d.classList.toggle('active', i === idx);
        });

        // If last letter, change button text
        if (idx === LETTERS.length - 1) {
          btnLetterNext.textContent = "Continue ❤️";
        } else {
          btnLetterNext.textContent = "Next";
        }
      }, 200);
    }

    envelopeWrapper.addEventListener('click', () => {
      if (envelopeWrapper.classList.contains('open')) return;

      // Animate envelope open
      envelopeWrapper.classList.add('open');
      createHeartExplosion(window.innerWidth / 2, window.innerHeight * 0.45);
      if (isAudioActive) playRomanticTone(523.25);

      // Slide letter out of envelope
      setTimeout(() => {
        envelopeStage.style.display = 'none';
        letterCardContainer.classList.add('visible');
        currentLetterIdx = 0;
        renderLetter(currentLetterIdx);
      }, 800);
    });

    btnLetterNext.addEventListener('click', () => {
      if (currentLetterIdx < LETTERS.length - 1) {
        currentLetterIdx++;
        renderLetter(currentLetterIdx);
        if (isAudioActive) playRomanticTone(587.33 + currentLetterIdx * 40);
      } else {
        // Transition to Screen 4 (Questions)
        showScreen(4);
        initQuestionsFlow();
      }
    });

    /* ==========================================================
       SCREEN 4: ROMANTIC QUESTIONS CONTROLLER
       ========================================================== */
    const cardDateQuestion = document.getElementById('card-date-question');
    const cardMusicStory = document.getElementById('card-music-story');
    const cardProposalQuestion = document.getElementById('card-proposal-question');

    const dateQTitle = document.getElementById('date-q-title');
    const btnQYes = document.getElementById('btn-q-yes');
    const btnQSecond = document.getElementById('btn-q-second');
    let dateQIdx = 0;

    function initQuestionsFlow() {
      dateQIdx = 0;
      cardDateQuestion.style.display = 'block';
      cardMusicStory.style.display = 'none';
      cardProposalQuestion.style.display = 'none';
      renderDateQuestion(0);
    }

    function renderDateQuestion(idx) {
      const q = DATE_QUESTIONS[idx];
      dateQTitle.textContent = q.title;
      btnQYes.textContent = q.btn1;
      btnQSecond.textContent = q.btn2;

      const dots = document.querySelectorAll('#question-nav-dots .nav-dot');
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }

    function handleDateQuestionAnswer() {
      createHeartExplosion(window.innerWidth / 2, window.innerHeight * 0.45);
      if (isAudioActive) playRomanticTone(659.25);

      if (dateQIdx < DATE_QUESTIONS.length - 1) {
        dateQIdx++;
        renderDateQuestion(dateQIdx);
      } else {
        // Transition to Music/Story Card (Step 4B)
        cardDateQuestion.style.display = 'none';
        cardMusicStory.style.display = 'block';
      }
    }

    btnQYes.addEventListener('click', handleDateQuestionAnswer);
    btnQSecond.addEventListener('click', handleDateQuestionAnswer);

    // Music Player "So... Ek Question Puchu?" button
    document.getElementById('btn-playing-pill').addEventListener('click', () => {
      createHeartExplosion(window.innerWidth / 2, window.innerHeight * 0.45);
      if (!isAudioActive) {
        document.getElementById('btn-audio-toggle').click();
      } else {
        playRomanticTone(784);
      }
    });

    document.getElementById('btn-story-continue').addEventListener('click', () => {
      cardMusicStory.style.display = 'none';
      cardProposalQuestion.style.display = 'block';
      resetProposalButtons();
    });

    /* Proposal Question & Interactive Playful Dodge */
    const btnProposalYes = document.getElementById('btn-proposal-yes');
    const btnProposalNo = document.getElementById('btn-proposal-no');
    let dodgeCount = 0;

    const dodgeTeases = [
      "🙈 SHAYAD NAHI",
      "Are you sure? 🥺",
      "Think again! 😉",
      "Wrong button! 💖",
      "You have to say YES! ❤️"
    ];

    function resetProposalButtons() {
      dodgeCount = 0;
      btnProposalYes.style.transform = 'scale(1)';
      btnProposalNo.style.transform = 'translate(0, 0) scale(1)';
      btnProposalNo.querySelector('span').textContent = dodgeTeases[0];
    }

    function playfulDodge() {
      dodgeCount++;
      const scaleYes = 1 + Math.min(dodgeCount * 0.14, 0.6);
      btnProposalYes.style.transform = `scale(${scaleYes})`;

      // Teleport NO button to random nearby offset
      const randX = (Math.random() - 0.5) * 160;
      const randY = (Math.random() - 0.5) * 70;
      btnProposalNo.style.transform = `translate(${randX}px, ${randY}px) scale(0.92)`;

      const tease = dodgeTeases[Math.min(dodgeCount, dodgeTeases.length - 1)];
      btnProposalNo.querySelector('span').textContent = tease;
    }

    btnProposalNo.addEventListener('mouseenter', playfulDodge);
    btnProposalNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      playfulDodge();
    });
    btnProposalNo.addEventListener('click', playfulDodge);

    // Clicking YES on Proposal
    btnProposalYes.addEventListener('click', () => {
      createCelebrationShower();
      if (isAudioActive) playRomanticTone(880);
      showScreen(5);
    });

    /* ==========================================================
       SCREEN 5: PROPOSAL CELEBRATION
       ========================================================== */
    document.getElementById('btn-goto-countdown').addEventListener('click', () => {
      showScreen(6);
    });

    /* ==========================================================
       SCREEN 6: COUNTDOWN / RELATIONSHIP ANNIVERSARY TIMER
       ========================================================== */
    const daysEl = document.getElementById('time-days');
    const hoursEl = document.getElementById('time-hours');
    const minutesEl = document.getElementById('time-minutes');
    const secondsEl = document.getElementById('time-seconds');

    function updateLiveTimer() {
      const now = new Date();
      // Calculate elapsed time since start date
      let diffMs = now.getTime() - RELATIONSHIP_START_DATE.getTime();

      // If future date, calculate remaining time; otherwise elapsed time
      if (diffMs < 0) {
        diffMs = Math.abs(diffMs);
      }

      const totalSecs = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSecs / (3600 * 24));
      const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;

      daysEl.textContent = days;
      hoursEl.textContent = hours;
      minutesEl.textContent = minutes;
      secondsEl.textContent = seconds;
    }

    setInterval(updateLiveTimer, 1000);
    updateLiveTimer();

    // Replay Full Experience
    document.getElementById('btn-replay-experience').addEventListener('click', () => {
      // Reset envelope
      envelopeWrapper.classList.remove('open');
      envelopeStage.style.display = 'block';
      letterCardContainer.classList.remove('visible');

      // Go back to Screen 1
      showScreen(1);
      startLoadingSequence();
    });

    /* ==========================================================
       DATE SETTINGS MODAL
       ========================================================== */
    const dateModal = document.getElementById('date-modal');
    const inputDate = document.getElementById('input-anniversary-date');

    document.getElementById('btn-config-date').addEventListener('click', () => {
      // Pre-fill input
      const isoStr = new Date(RELATIONSHIP_START_DATE.getTime() - RELATIONSHIP_START_DATE.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      inputDate.value = isoStr;
      dateModal.classList.add('open');
    });

    document.getElementById('btn-modal-cancel').addEventListener('click', () => {
      dateModal.classList.remove('open');
    });

    document.getElementById('btn-modal-save').addEventListener('click', () => {
      if (inputDate.value) {
        RELATIONSHIP_START_DATE = new Date(inputDate.value);
        try {
          localStorage.setItem("romantic_anniversary_date", inputDate.value);
        } catch (e) {}
        updateLiveTimer();
      }
      dateModal.classList.remove('open');
    });

    /* ==========================================================
       ROMANTIC AMBIENT HEARTS & SPARKLES CANVAS
       ========================================================== */
    const heartsCanvas = document.getElementById('hearts-canvas');
    const hCtx = heartsCanvas.getContext('2d');
    let floatingHearts = [];

    function resizeHeartsCanvas() {
      heartsCanvas.width = window.innerWidth;
      heartsCanvas.height = window.innerHeight;
    }

    function initFloatingHearts() {
      floatingHearts = [];
      const count = Math.floor(window.innerWidth / 35) + 15;
      for (let i = 0; i < count; i++) {
        floatingHearts.push(createHeartObj(true));
      }
    }

    function createHeartObj(initialRandomY = false) {
      return {
        x: Math.random() * heartsCanvas.width,
        y: initialRandomY ? Math.random() * heartsCanvas.height : heartsCanvas.height + 20,
        size: Math.random() * 16 + 8,
        speedY: Math.random() * 0.8 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.6 + 0.25,
        rot: (Math.random() - 0.5) * 0.6,
        color: Math.random() > 0.4 ? '#ff4d6d' : (Math.random() > 0.5 ? '#ff758c' : '#c752bb')
      };
    }

    function drawHeart(ctx, x, y, size, color, alpha, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2, 0, size);
      // bottom right curve
      ctx.bezierCurveTo(0, (size + topCurveHeight) / 2, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function animateHearts() {
      hCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

      floatingHearts.forEach((h, index) => {
        h.y -= h.speedY;
        h.x += h.speedX;
        drawHeart(hCtx, h.x, h.y, h.size, h.color, h.opacity, h.rot);

        // Reset if floated above top
        if (h.y < -30) {
          floatingHearts[index] = createHeartObj(false);
        }
      });

      requestAnimationFrame(animateHearts);
    }

    // Dynamic celebration heart shower
    function createCelebrationShower() {
      for (let i = 0; i < 35; i++) {
        setTimeout(() => {
          const h = createHeartObj(false);
          h.size = Math.random() * 24 + 12;
          h.speedY = Math.random() * 2.5 + 1.5;
          floatingHearts.push(h);
        }, i * 60);
      }
    }

    function createHeartExplosion(x, y) {
      for (let i = 0; i < 16; i++) {
        const h = createHeartObj(false);
        h.x = x;
        h.y = y;
        const angle = (i / 16) * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        h.speedX = Math.cos(angle) * speed;
        h.speedY = Math.sin(angle) * speed;
        floatingHearts.push(h);
      }
    }

    /* ==========================================================
       ROMANTIC AUDIO SYNTHESIZER (Web Audio API)
       100% self contained pure vanilla JavaScript
       ========================================================== */
    let audioCtx = null;
    let isAudioActive = false;
    let romanticMusicTimer = null;

    function initAudioEngine() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function playRomanticTone(freq = 523.25) {
      if (!audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2.1);
      } catch (e) {}
    }

    const soundOffIcon = document.getElementById('sound-off-icon');
    const soundOnIcon = document.getElementById('sound-on-icon');

    document.getElementById('btn-audio-toggle').addEventListener('click', () => {
      initAudioEngine();
      isAudioActive = !isAudioActive;

      if (isAudioActive) {
        soundOffIcon.style.display = 'none';
        soundOnIcon.style.display = 'block';

        // Soft music box romantic arpeggio (C - G - Am - F)
        const melody = [
          523.25, 659.25, 783.99, 1046.50, // C chord
          392.00, 493.88, 587.33, 783.99,  // G chord
          440.00, 523.25, 659.25, 880.00,  // Am chord
          349.23, 440.00, 523.25, 698.46   // F chord
        ];
        let noteIdx = 0;
        playRomanticTone(523.25);

        romanticMusicTimer = setInterval(() => {
          if (!isAudioActive) return;
          playRomanticTone(melody[noteIdx % melody.length]);
          noteIdx++;
        }, 700);
      } else {
        soundOffIcon.style.display = 'block';
        soundOnIcon.style.display = 'none';
        if (romanticMusicTimer) clearInterval(romanticMusicTimer);
      }
    });

    /* ==========================================================
       STARTUP
       ========================================================== */
    window.addEventListener('resize', resizeHeartsCanvas);
    resizeHeartsCanvas();
    initFloatingHearts();
    animateHearts();

    // Launch progress sequence on start
    startLoadingSequence();
