export interface CountdownParts {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly complete: boolean;
}

export function getCountdown(targetISO: string, now = Date.now()): CountdownParts {
  const remaining = Math.max(0, Date.parse(targetISO) - now);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    complete: remaining === 0,
  };
}

export const padCountdown = (value: number) => String(value).padStart(2, "0");
