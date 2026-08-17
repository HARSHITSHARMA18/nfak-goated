"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SourceType = "file" | "youtube";

type YouTubePlayer = {
  playVideo?: () => void;
  pauseVideo?: () => void;
  loadVideoById?: (videoId: string) => void;
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume?: (volume: number) => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
  destroy?: () => void;
};

type YouTubeWindow = Window & {
  YT?: {
    Player: new (
      element: HTMLElement,
      options: {
        videoId: string;
        playerVars: Record<string, number>;
        events: {
          onReady: (event: { target: YouTubePlayer }) => void;
          onStateChange: (event: { data: number }) => void;
        };
      },
    ) => YouTubePlayer;
    PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
  };
  onYouTubeIframeAPIReady?: () => void;
};

type Track = {
  id: string;
  title: string;
  artist: string;
  recording: string;
  duration: number;
  artwork?: string;
  sourceType: SourceType;
  sourceId?: string;
  sourceUrl?: string;
};

const TRACKS: Track[] = [
  {
    id: "akhiyan-udeekdiyan",
    title: "Akhiyan Udeekdiyan",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 979,
    sourceType: "youtube",
    sourceId: "fFjbAyFIZ6Q",
  },
  {
    id: "dulhe-ka-sehra-male-version",
    title: "Dulhe Ka Sehra - Male Version",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 513,
    sourceType: "youtube",
    sourceId: "8uUhxTs3UUQ",
  },
  {
    id: "tumhen-dillagi-bhool-jani-paregee",
    title: "Tumhen Dillagi Bhool Jani Paregee",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 983,
    sourceType: "youtube",
    sourceId: "eefxQnekKdg",
  },
  {
    id: "sanson-ki-mala-peh-simroon",
    title: "Sanson Ki Mala Peh Simroon",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 1806,
    sourceType: "youtube",
    sourceId: "c6J13QO-1fE",
  },
  {
    id: "halka-halka-saroor",
    title: "Halka Halka Saroor",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 435,
    sourceType: "youtube",
    sourceId: "G8wCaZ2Kok8",
  },
  {
    id: "mera-piya-ghar-aaya",
    title: "Mera Piya Ghar Aaya",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 533,
    sourceType: "youtube",
    sourceId: "1Z1dnqARqCs",
  },
  {
    id: "ankh-uthi-mohabbat-ne",
    title: "Ankh Uthi Mohabbat Ne",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 1164,
    sourceType: "youtube",
    sourceId: "d6Cl0mY8EoQ",
  },
  {
    id: "dil-pe-zakham-khate-hain",
    title: "Dil Pe Zakham Khate Hain",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 285,
    sourceType: "youtube",
    sourceId: "jLO0liDHfKY",
  },
  {
    id: "un-ka-andaz-e-karam",
    title: "Un Ka Andaz-E-Karam - Complete Original Version",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 1057,
    sourceType: "youtube",
    sourceId: "onqo9TNFkiY",
  },
  {
    id: "nit-khair-mangan",
    title: "Nit Khair Mangan - Complete Original Recording",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 713,
    sourceType: "youtube",
    sourceId: "AfIBjGPsv2U",
  },
  {
    id: "sochta-hoon-keh-woh-kitne-masoom-teh",
    title: "Sochta Hoon Keh Woh Kitne Masoom Teh - Complete Original Recording",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 1372,
    sourceType: "youtube",
    sourceId: "0bxfIRONPc4",
  },
  {
    id: "barsoon-kay-intizar-ka",
    title: "Barsoon Kay Intizar Ka",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 697,
    sourceType: "youtube",
    sourceId: "PFxomXeIq4w",
  },
  {
    id: "sadgi-to-hamari",
    title: "Sadgi To Hamari",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 901,
    sourceType: "youtube",
    sourceId: "39EZL1niYa8",
  },
  {
    id: "main-rowan-tainon-yaad-kar-ke",
    title: "Main Rowan Tainon Yaad Kar Ke",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 774,
    sourceType: "youtube",
    sourceId: "ukpvd4SxRgo",
  },
  {
    id: "mere-rashke-qamar",
    title: 'Mere Rashke Qamar (From "Baadshaho")',
    artist: "Nusrat Fateh Ali Khan, Rahat Fateh Ali Khan & Manoj Muntashir",
    recording: "Nusrat Fateh Ali Khan & Rahat Fateh Ali Khan",
    duration: 221,
    sourceType: "youtube",
    sourceId: "iyxByIhwrC0",
  },
  {
    id: "man-atkeia-beparwah-de-naal",
    title: "Man Atkeia Beparwah De Naal",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 873,
    sourceType: "youtube",
    sourceId: "tICkQ-_84lE",
  },
  {
    id: "je-toon-rabb-noon-manaunan",
    title: "Je Toon Rabb Noon Manaunan",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 1055,
    sourceType: "youtube",
    sourceId: "puyvWA_YoHk",
  },
  {
    id: "mainu-chad-ke-kalli-nu-tur-chaliya",
    title: "Mainu Chad Ke Kalli Nu Tur Chaliya",
    artist: "Nusrat Fateh Ali Khan",
    recording: "Nusrat Fateh Ali Khan",
    duration: 887,
    sourceType: "youtube",
    sourceId: "mFzx15X38IU",
  },
];

const SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/4eqZZ9ra38ienQ0fVmSnYK?si=k1woIOjYTwCntgpXs57frA&utm_source=copy-link&pi=PDNcbZo1QDePe";
const YOUTUBE_MUSIC_PLAYLIST_URL =
  "https://music.youtube.com/playlist?list=PLQ5twUhCwzDg&si=Cdp6gm37JgUmTJfc";

type AudioContextValue = {
  tracks: Track[];
  currentIndex: number;
  currentTrack: Track;
  currentTime: number;
  currentDuration: number;
  isPlaying: boolean;
  isReady: boolean;
  volume: number;
  setTrack: (index: number) => void;
  toggle: () => void;
  previous: () => void;
  next: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
};

const PlayerAudioContext = createContext<AudioContextValue | null>(null);

function useAudioPlayer() {
  const value = useContext(PlayerAudioContext);
  if (!value) throw new Error("useAudioPlayer must be used inside AudioProvider");
  return value;
}

function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(TRACKS[0].duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolumeState] = useState(78);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const currentTrack = TRACKS[currentIndex];

  const setTrack = useCallback((index: number) => {
    const nextIndex = (index + TRACKS.length) % TRACKS.length;
    setCurrentIndex(nextIndex);
    setCurrentTime(0);
    setCurrentDuration(TRACKS[nextIndex].duration);
    if (TRACKS[nextIndex].sourceId) playerRef.current?.loadVideoById?.(TRACKS[nextIndex].sourceId);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((index) => {
      const nextIndex = (index + 1) % TRACKS.length;
      setCurrentDuration(TRACKS[nextIndex].duration);
      if (TRACKS[nextIndex].sourceId) playerRef.current?.loadVideoById?.(TRACKS[nextIndex].sourceId);
      return nextIndex;
    });
    setCurrentTime(0);
  }, []);

  const previous = useCallback(() => {
    setCurrentIndex((index) => {
      const nextIndex = (index - 1 + TRACKS.length) % TRACKS.length;
      setCurrentDuration(TRACKS[nextIndex].duration);
      if (TRACKS[nextIndex].sourceId) playerRef.current?.loadVideoById?.(TRACKS[nextIndex].sourceId);
      return nextIndex;
    });
    setCurrentTime(0);
  }, []);

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(seconds, currentDuration));
      setCurrentTime(clamped);
      playerRef.current?.seekTo?.(clamped, true);
    },
    [currentDuration],
  );

  const toggle = useCallback(() => {
    if (!isReady) return;
    if (isPlaying) playerRef.current?.pauseVideo?.();
    else playerRef.current?.playVideo?.();
  }, [isPlaying, isReady]);

  const setVolume = useCallback((nextVolume: number) => {
    const clamped = Math.max(0, Math.min(100, nextVolume));
    setVolumeState(clamped);
    playerRef.current?.setVolume?.(clamped);
  }, []);

  useEffect(() => {
    const youtubeWindow = window as YouTubeWindow;
    let cancelled = false;

    const createPlayer = () => {
      if (cancelled || !youtubeWindow.YT?.Player || !playerContainerRef.current || playerRef.current) return;
      playerRef.current = new youtubeWindow.YT.Player(playerContainerRef.current, {
        videoId: TRACKS[0].sourceId ?? "",
        playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            event.target.setVolume?.(78);
            setIsReady(true);
          },
          onStateChange: (event) => {
            const state = youtubeWindow.YT?.PlayerState;
            if (!state) return;
            if (event.data === state.PLAYING) setIsPlaying(true);
            if (event.data === state.PAUSED) setIsPlaying(false);
            if (event.data === state.ENDED) next();
          },
        },
      });
    };

    if (youtubeWindow.YT?.Player) createPlayer();
    else {
      const previousReady = youtubeWindow.onYouTubeIframeAPIReady;
      youtubeWindow.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        createPlayer();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
    }

    if (window.location.hash) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [next]);

  useEffect(() => {
    if (!isReady) return;
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      const duration = typeof player.getDuration === "function" ? player.getDuration() || currentTrack.duration : currentTrack.duration;
      const elapsed = typeof player.getCurrentTime === "function" ? player.getCurrentTime() || 0 : 0;
      setCurrentTime(elapsed);
      setCurrentDuration(duration);
    }, 500);
    return () => window.clearInterval(timer);
  }, [currentTrack.duration, isReady]);

  const value = useMemo(
    () => ({
      tracks: TRACKS,
      currentIndex,
      currentTrack,
      currentTime,
      currentDuration,
      isPlaying,
      isReady,
      volume,
      setTrack,
      toggle,
      previous,
      next,
      seek,
      setVolume,
    }),
    [
      currentIndex,
      currentTrack,
      currentTime,
      currentDuration,
      isPlaying,
      isReady,
      volume,
      setTrack,
      toggle,
      previous,
      next,
      seek,
      setVolume,
    ],
  );

  return (
    <PlayerAudioContext.Provider value={value}>
      {children}
      <div className="youtube-player" aria-hidden="true"><div ref={playerContainerRef} /></div>
    </PlayerAudioContext.Provider>
  );
}

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0;
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

function trackArtwork(track: Track) {
  if (track.artwork) return track.artwork;
  if (track.sourceId) return `https://i.ytimg.com/vi/${track.sourceId}/mqdefault.jpg`;
  return "/favicon.png";
}

function BackgroundWall({ paused }: { paused: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      layerRef.current?.style.setProperty("--parallax-x", `${currentX}px`);
      layerRef.current?.style.setProperty("--parallax-y", `${currentY}px`);
      frame = window.requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      if (reduceMotion.matches || !precisePointer.matches) return;
      targetX = ((event.clientX / window.innerWidth) * 2 - 1) * -5;
      targetY = ((event.clientY / window.innerHeight) * 2 - 1) * -4;
    };

    if (!reduceMotion.matches && precisePointer.matches) {
      window.addEventListener("pointermove", onMove, { passive: true });
      frame = window.requestAnimationFrame(render);
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layerRef} className={`background-wall ${paused ? "is-paused" : ""}`} aria-hidden="true">
      <picture>
        <source media="(max-width: 700px)" srcSet="/nusrat-wall-mobile.webp" type="image/webp" />
        <source srcSet="/nusrat-wall.webp" type="image/webp" />
        <img src="/nusrat-wall-original.png" alt="" fetchPriority="high" decoding="async" />
      </picture>
    </div>
  );
}

function AmbientLight({ paused }: { paused: boolean }) {
  return <div className={`ambient-light ${paused ? "is-paused" : ""}`} aria-hidden="true" />;
}

function PaperFragment({ src, className = "" }: { src?: string; className?: string }) {
  if (!src) return null;
  // Optional fragments are transparent overlay assets, not content imagery.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`paper-fragment ${className}`} src={src} alt="" loading="lazy" aria-hidden="true" />;
}

function TransportButton({
  label,
  onClick,
  children,
  className = "",
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button className={`transport-button ${className}`} type="button" onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
}

function ProgressControl() {
  const { currentTime, currentDuration, seek } = useAudioPlayer();
  const progress = (currentTime / currentDuration) * 100;

  return (
    <div className="progress-row">
      <input
        className="ink-range progress-control"
        type="range"
        min="0"
        max={currentDuration}
        step="1"
        value={Math.min(currentTime, currentDuration)}
        onChange={(event) => seek(Number(event.target.value))}
        aria-label="Track progress"
        style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
      />
      <div className="time-readout" aria-label={`${formatTime(currentTime)} elapsed of ${formatTime(currentDuration)}`}>
        <span>{formatTime(currentTime)}</span>
        <span aria-hidden="true">/</span>
        <span>{formatTime(currentDuration)}</span>
      </div>
    </div>
  );
}

function TrackPoster() {
  const { currentTrack, isPlaying, isReady, toggle, previous, next } = useAudioPlayer();

  return (
    <section className="track-poster" aria-label="Now playing" key={currentTrack.id}>
      <div
        className={`cover-thumb record-disc ${isPlaying ? "is-spinning" : ""}`}
        aria-hidden="true"
        style={{ backgroundImage: `url("${trackArtwork(currentTrack)}")` }}
      />
      <div className="track-copy">
        <h1>{currentTrack.title}</h1>
        <p className="recording">{currentTrack.recording}</p>
      </div>
      <span className={`playback-mark ${isPlaying ? "is-playing" : ""}`} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <ProgressControl />
      <div className="transport" role="group" aria-label="Playback controls">
        <TransportButton label="Previous track" onClick={previous}>
          <span className="skip-icon skip-previous" aria-hidden="true" />
        </TransportButton>
        <TransportButton label={isPlaying ? "Pause" : isReady ? "Play" : "Loading audio"} onClick={toggle} className="play-button">
          <span className={isPlaying ? "pause-icon" : "play-icon"} aria-hidden="true" />
        </TransportButton>
        <TransportButton label="Next track" onClick={next}>
          <span className="skip-icon skip-next" aria-hidden="true" />
        </TransportButton>
        <span className="source-note" aria-live="polite">
          {!isReady ? "Loading audio" : isPlaying ? "Playing" : "Paused"}
        </span>
      </div>
    </section>
  );
}

function PlaylistPanel({ open, onToggle, onClose }: { open: boolean; onToggle: () => void; onClose: () => void }) {
  const { tracks, currentIndex, setTrack } = useAudioPlayer();
  const nextTrack = tracks[(currentIndex + 1) % tracks.length];

  return (
    <section className={`playlist-panel ${open ? "is-open" : ""}`} aria-label="Nusrat playlist">
      <div className="playlist-drawer-content" id="playlistDrawer" aria-hidden={!open}>
        <header className="playlist-header">
          <div>
            <h2>Playlist</h2>
            <p>{tracks.length} songs</p>
          </div>
          <button className="playlist-close" type="button" onClick={onClose} aria-label="Close playlist" tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z" />
            </svg>
          </button>
        </header>

        <ol className="playlist-track-list">
          {tracks.map((track, index) => {
            const active = index === currentIndex;
            return (
              <li key={track.id}>
                <button
                  className={`playlist-track ${active ? "is-current" : ""}`}
                  type="button"
                  onClick={() => setTrack(index)}
                  aria-label={`Play ${track.title} by ${track.artist}`}
                  aria-current={active ? "true" : undefined}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="playlist-track-number">{String(index + 1).padStart(2, "0")}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="playlist-track-cover" src={trackArtwork(track)} alt="" loading="lazy" />
                  <span className="playlist-track-copy">
                    <strong>{track.title}</strong>
                    <small>{track.artist}</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="up-next-bar">
        <p><span>Up next:</span> <strong>{nextTrack.title}</strong></p>
        <button
          className="playlist-toggle"
          type="button"
          onClick={onToggle}
          aria-label={open ? "Close playlist" : "Open playlist"}
          aria-expanded={open}
          aria-controls="playlistDrawer"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h11v2H4zm0 5h11v2H4zm0 5h7v2H4zm13-4 5 3-5 3z" />
          </svg>
        </button>
      </div>
    </section>
  );
}

function PlatformIcon({ platform }: { platform: "spotify" | "youtube" }) {
  if (platform === "spotify") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
    </svg>
  );
}

function ExternalArrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`external-link-arrow ${className}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g transform="rotate(-45 12 12)">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </g>
    </svg>
  );
}

function PlatformLink({
  href,
  platform,
  children,
}: {
  href: string;
  platform: "spotify" | "youtube";
  children: React.ReactNode;
}) {
  const content = (
    <>
      <PlatformIcon platform={platform} />
      <span>{children}</span>
      <ExternalArrow />
    </>
  );

  if (!href) {
    return (
      <span className="platform-link is-pending" aria-label={`${children} playlist link pending`} title="Playlist link pending">
        {content}
      </span>
    );
  }

  return (
    <a className="platform-link" href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}

function PlatformLinks() {
  return (
    <nav className="platform-links" aria-label="Listen to the full playlist">
      <PlatformLink href={SPOTIFY_PLAYLIST_URL} platform="spotify">Spotify</PlatformLink>
      <PlatformLink href={YOUTUBE_MUSIC_PLAYLIST_URL} platform="youtube">YT Music</PlatformLink>
    </nav>
  );
}

function PlayerExperience() {
  const { toggle } = useAudioPlayer();
  const [pageVisible, setPageVisible] = useState(true);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPlaylistOpen(false);
      if (event.code !== "Space" || event.defaultPrevented) return;
      const target = event.target as HTMLElement;
      if (target.closest("button, input, textarea, select, a, [contenteditable='true']")) return;
      event.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return (
    <main className="experience">
      <BackgroundWall paused={!pageVisible} />
      <AmbientLight paused={!pageVisible} />
      <div className="legibility-gradient" aria-hidden="true" />
      <div className="paper-fragments" aria-hidden="true">
        <PaperFragment />
      </div>

      <a className="live-clock-shell maker-credit" href="https://x.com/harshitlog" target="_blank" rel="noreferrer">
        <span className="maker-prefix">Building</span>
        <span className="maker-handle">@harshitlog</span>
        <ExternalArrow className="maker-arrow" />
      </a>

      <PlatformLinks />

      <header className="site-identity">
        <span className="wordmark hindi-wordmark" lang="hi">
          <span>नुसरत की</span>
          <span>महफ़िल</span>
        </span>
      </header>

      <div className={`player-anchor ${playlistOpen ? "has-open-playlist" : ""}`}>
        <PlaylistPanel
          open={playlistOpen}
          onToggle={() => setPlaylistOpen((open) => !open)}
          onClose={() => setPlaylistOpen(false)}
        />
        <TrackPoster />
      </div>
    </main>
  );
}

export default function NusratPlayer() {
  return (
    <AudioProvider>
      <PlayerExperience />
    </AudioProvider>
  );
}
