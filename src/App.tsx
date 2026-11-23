import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { HeroHandoff } from "./components/HeroHandoff/HeroHandoff";
import { MusicToggle } from "./components/MusicToggle/MusicToggle";
import { OpeningScreen } from "./components/OpeningScreen/OpeningScreen";
import { Preloader } from "./components/Preloader/Preloader";
import { WelcomeLetter } from "./components/WelcomeLetter/WelcomeLetter";
import { wedding } from "./config/wedding";
import { createInvitationAudio } from "./lib/audio";
import { acquireScrollLock } from "./lib/scrollLock";
import { safeSessionStorage, storageKeys } from "./lib/storage";

const DevPanel = import.meta.env.DEV ? lazy(() => import("./components/DevPanel/DevPanel")) : null;
const TypeTest = import.meta.env.DEV ? lazy(() => import("./components/TypeTest/TypeTest")) : null;
const DateReveal = lazy(() =>
  import("./components/DateReveal/DateReveal").then((module) => ({ default: module.DateReveal })),
);
const LittleMoments = lazy(() =>
  import("./components/LittleMoments/LittleMoments").then((module) => ({
    default: module.LittleMoments,
  })),
);
const Ceremonies = lazy(() =>
  import("./components/Ceremonies/Ceremonies").then((module) => ({ default: module.Ceremonies })),
);
const Venue = lazy(() =>
  import("./components/Venue/Venue").then((module) => ({ default: module.Venue })),
);
const ClosingPortrait = lazy(() =>
  import("./components/ClosingPortrait/ClosingPortrait").then((module) => ({
    default: module.ClosingPortrait,
  })),
);

export function App() {
  const isTypeTest = import.meta.env.DEV && window.location.pathname === "/dev/type-test";
  const forceIntro = new URLSearchParams(window.location.search).get("intro") === "1";
  const skipIntro =
    !isTypeTest && !forceIntro && safeSessionStorage.get(storageKeys.introOpened) === "true";
  const [introReady, setIntroReady] = useState(skipIntro);
  const [heroReveal, setHeroReveal] = useState(skipIntro);
  const [opened, setOpened] = useState(skipIntro);
  const [musicOn, setMusicOn] = useState(false);
  const audio = useMemo(
    () =>
      createInvitationAudio(wedding.music.src, wedding.music.volume, {
        initialStartSeconds: wedding.music.initialStartSeconds,
        loopStartSeconds: wedding.music.loopStartSeconds,
      }),
    [],
  );
  const showDevPanel =
    import.meta.env.DEV && new URLSearchParams(window.location.search).get("dev") === "1";
  const finishPreloader = useCallback(() => setIntroReady(true), []);
  const revealHero = useCallback(() => setHeroReveal(true), []);
  const finishOpening = useCallback(() => {
    safeSessionStorage.set(storageKeys.introOpened, "true");
    setOpened(true);
    window.dispatchEvent(new CustomEvent("invitation:opened"));
  }, []);
  const toggleMusic = useCallback(() => {
    void audio.toggle().then(setMusicOn);
  }, [audio]);

  useEffect(() => {
    if (isTypeTest) return;
    if (opened) return;
    return acquireScrollLock();
  }, [isTypeTest, opened]);

  useEffect(() => {
    if (isTypeTest || !audio.available) return;
    let active = true;
    const retryEvents = ["pointerdown", "touchstart", "keydown", "wheel"] as const;

    const removeRetryListeners = () => {
      for (const eventName of retryEvents) {
        window.removeEventListener(eventName, attemptPlayback, true);
      }
    };
    const attemptPlayback = () => {
      void audio.play().then((playing) => {
        if (!active) return;
        setMusicOn(playing);
        if (playing) removeRetryListeners();
      });
    };

    for (const eventName of retryEvents) {
      window.addEventListener(eventName, attemptPlayback, { capture: true, passive: true });
    }
    attemptPlayback();

    return () => {
      active = false;
      removeRetryListeners();
    };
  }, [audio, isTypeTest]);

  useEffect(() => {
    const destroyAudio = () => audio.destroy();
    window.addEventListener("pagehide", destroyAudio, { once: true });
    return () => window.removeEventListener("pagehide", destroyAudio);
  }, [audio]);

  return (
    <div className="app-shell" data-testid="app-shell">
      <main>
        {isTypeTest && TypeTest ? (
          <TypeTest />
        ) : (
          <>
            <HeroHandoff
              active={introReady || skipIntro}
              reveal={heroReveal}
              skipEntrance={skipIntro}
            />
            <WelcomeLetter />
            <Suspense fallback={null}>
              <DateReveal />
              <LittleMoments />
              <Ceremonies />
              <Venue />
              <ClosingPortrait />
            </Suspense>
            {!opened ? (
              <OpeningScreen
                active={introReady}
                onHeroReveal={revealHero}
                onComplete={finishOpening}
              />
            ) : null}
            {!introReady && !skipIntro ? <Preloader onComplete={finishPreloader} /> : null}
            {audio.available && (opened || heroReveal) ? (
              <MusicToggle playing={musicOn} pulse={skipIntro} onToggle={toggleMusic} />
            ) : null}
          </>
        )}
      </main>
      {showDevPanel && DevPanel ? (
        <Suspense fallback={null}>
          <DevPanel />
        </Suspense>
      ) : null}
    </div>
  );
}
