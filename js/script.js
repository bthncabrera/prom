    (() => {
      const eventTime = Date.parse("2026-12-08T00:00:00Z");
      const countdownIds = ["days", "hours", "minutes", "seconds"];
      const countdownElements = countdownIds.map((id) => document.getElementById(id));
      const countdownNote = document.getElementById("countdown-note");
      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Asuncion",
        timeZoneName: "short"
      });
      const eventOffset = dateFormatter.formatToParts(new Date(eventTime))
        .find((part) => part.type === "timeZoneName")?.value;

      function updateCountdown() {
        const remaining = eventTime - Date.now();
        if (remaining <= 0) {
          countdownElements.forEach((element) => { element.textContent = "00"; });
          countdownNote.textContent = "La celebración ha comenzado";
          return;
        }
        const seconds = Math.floor(remaining / 1000);
        const values = [
          Math.floor(seconds / 86400),
          Math.floor((seconds % 86400) / 3600),
          Math.floor((seconds % 3600) / 60),
          seconds % 60
        ];
        countdownElements.forEach((element, index) => {
          element.textContent = String(values[index]).padStart(index === 0 ? 3 : 2, "0");
        });
        countdownNote.textContent = eventOffset ? "HORA DE PARAGUAY · UTC" + eventOffset.replace("GMT", "") : "HORA DE PARAGUAY";
      }

      updateCountdown();
      window.setInterval(updateCountdown, 1000);

      const music = document.getElementById("background-music");
      const musicPlayer = document.getElementById("music-player");
      const musicToggle = document.getElementById("music-toggle");
      const playIcon = document.getElementById("play-icon");
      const pauseIcon = document.getElementById("pause-icon");
      const musicStatus = document.getElementById("music-status");

      async function startMusic() {
        try {
          await music.play();
          musicPlayer.classList.add("is-playing");
          musicToggle.setAttribute("aria-label", "Pausar música");
          musicToggle.setAttribute("aria-pressed", "true");
          playIcon.hidden = true;
          pauseIcon.hidden = false;
          musicStatus.hidden = true;
        } catch (error) {
          musicPlayer.classList.remove("is-playing");
          musicToggle.setAttribute("aria-label", "Reproducir música");
          musicToggle.setAttribute("aria-pressed", "false");
          playIcon.hidden = false;
          pauseIcon.hidden = true;
          musicStatus.textContent = "No se pudo reproducir audio/music.mp3. Añade el archivo a la carpeta de audio y vuelve a intentarlo.";
          musicStatus.hidden = false;
          console.error("No se pudo iniciar la música de la invitación.", error);
        }
      }

      function stopMusic() {
        music.pause();
        musicPlayer.classList.remove("is-playing");
        musicToggle.setAttribute("aria-label", "Reproducir música");
        musicToggle.setAttribute("aria-pressed", "false");
        playIcon.hidden = false;
        pauseIcon.hidden = true;
      }

      musicToggle.addEventListener("click", () => {
        if (music.paused) startMusic();
        else stopMusic();
      });
      music.addEventListener("error", () => {
        musicStatus.textContent = "El archivo audio/music.mp3 no está disponible. Colócalo en la carpeta de audio para escuchar la música.";
        musicStatus.hidden = false;
      });
      document.getElementById("discover").addEventListener("click", () => {
        document.getElementById("celebration").scrollIntoView({ behavior: "smooth" });
        if (music.paused) startMusic();
      });

      const revealElements = document.querySelectorAll(".reveal");
      if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              currentObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.14 });
        revealElements.forEach((element) => observer.observe(element));
      } else {
        revealElements.forEach((element) => element.classList.add("is-visible"));
      }
    })();
