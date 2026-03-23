'use client';

import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

export type BookDemoCalendarProps = {
  value: string;
  onChange: (iso: string) => void;
  minIso: string;
  maxIso: string;
  locale: string;
  ariaLabelledBy?: string;
  prevMonthAria: string;
  nextMonthAria: string;
};

function parseIso(iso: string): { y: number; m: number; d: number } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { y: +m[1], m: +m[2] - 1, d: +m[3] };
}

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function cmpIso(a: string, b: string): number {
  return a.localeCompare(b);
}

function clampViewMonth(minIso: string, maxIso: string): { y: number; m: number } {
  const t = new Date();
  const iso = toIso(t.getFullYear(), t.getMonth(), t.getDate());
  if (cmpIso(iso, minIso) < 0) {
    const p = parseIso(minIso);
    if (p) return { y: p.y, m: p.m };
  }
  if (cmpIso(iso, maxIso) > 0) {
    const p = parseIso(maxIso);
    if (p) return { y: p.y, m: p.m };
  }
  return { y: t.getFullYear(), m: t.getMonth() };
}

function buildWeekdayLabels(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 1 + i)));
}

type Cell = { key: string; y: number; m: number; d: number; inMonth: boolean };

function buildGrid(viewY: number, viewM: number): Cell[] {
  const first = new Date(viewY, viewM, 1);
  const lead = (first.getDay() + 6) % 7;
  const dim = new Date(viewY, viewM + 1, 0).getDate();
  const out: Cell[] = [];

  for (let i = 0; i < lead; i++) {
    const dt = new Date(viewY, viewM, 1 - lead + i);
    out.push({
      key: `p-${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`,
      y: dt.getFullYear(),
      m: dt.getMonth(),
      d: dt.getDate(),
      inMonth: false,
    });
  }
  for (let d = 1; d <= dim; d++) {
    out.push({ key: `c-${viewY}-${viewM}-${d}`, y: viewY, m: viewM, d, inMonth: true });
  }
  let t = 0;
  while (out.length < 42) {
    t++;
    const dt = new Date(viewY, viewM, dim + t);
    out.push({
      key: `n-${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`,
      y: dt.getFullYear(),
      m: dt.getMonth(),
      d: dt.getDate(),
      inMonth: false,
    });
  }
  return out;
}

export function BookDemoCalendar({
  value,
  onChange,
  minIso,
  maxIso,
  locale,
  ariaLabelledBy,
  prevMonthAria,
  nextMonthAria,
}: BookDemoCalendarProps) {
  const [viewY, setViewY] = useState(() => clampViewMonth(minIso, maxIso).y);
  const [viewM, setViewM] = useState(() => clampViewMonth(minIso, maxIso).m);

  useEffect(() => {
    if (!value) return;
    const p = parseIso(value);
    if (p) {
      setViewY(p.y);
      setViewM(p.m);
    }
  }, [value]);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long' }),
    [locale]
  );
  const yearFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { year: 'numeric' }),
    [locale]
  );

  const weekdays = useMemo(() => buildWeekdayLabels(locale), [locale]);
  const grid = useMemo(() => buildGrid(viewY, viewM), [viewY, viewM]);

  const headerLabel = useMemo(() => {
    const d = new Date(viewY, viewM, 15);
    return `${monthFormatter.format(d)} ${yearFormatter.format(d)}`;
  }, [viewY, viewM, monthFormatter, yearFormatter]);

  const todayIso = useMemo(() => {
    const t = new Date();
    return toIso(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const canPrev = useMemo(() => {
    const lastOfPrev = new Date(viewY, viewM, 0);
    const lastIso = toIso(lastOfPrev.getFullYear(), lastOfPrev.getMonth(), lastOfPrev.getDate());
    return cmpIso(lastIso, minIso) >= 0;
  }, [viewY, viewM, minIso]);

  const canNext = useMemo(() => {
    const firstNext = new Date(viewY, viewM + 1, 1);
    const firstIso = toIso(firstNext.getFullYear(), firstNext.getMonth(), 1);
    return cmpIso(firstIso, maxIso) <= 0;
  }, [viewY, viewM, maxIso]);

  const goPrev = () => {
    if (!canPrev) return;
    if (viewM === 0) {
      setViewY((y) => y - 1);
      setViewM(11);
    } else {
      setViewM((m) => m - 1);
    }
  };

  const goNext = () => {
    if (!canNext) return;
    if (viewM === 11) {
      setViewY((y) => y + 1);
      setViewM(0);
    } else {
      setViewM((m) => m + 1);
    }
  };

  const cellIso = (c: Cell) => toIso(c.y, c.m, c.d);

  const cellDisabled = (c: Cell) => {
    if (!c.inMonth) return true;
    const iso = cellIso(c);
    return cmpIso(iso, minIso) < 0 || cmpIso(iso, maxIso) > 0;
  };

  const cellOutOfRange = (c: Cell) => {
    if (!c.inMonth) return false;
    const iso = cellIso(c);
    return cmpIso(iso, minIso) < 0 || cmpIso(iso, maxIso) > 0;
  };

  return (
    <div className="book-demo-cal" role="application" aria-labelledby={ariaLabelledBy}>
      <div className="book-demo-cal__toolbar">
        <button
          type="button"
          className="book-demo-cal__nav"
          aria-label={prevMonthAria}
          onClick={goPrev}
          disabled={!canPrev}
        >
          <span className="book-demo-cal__nav-icon" aria-hidden>
            ‹
          </span>
        </button>
        <div className="book-demo-cal__caption" aria-live="polite">
          {headerLabel}
        </div>
        <button
          type="button"
          className="book-demo-cal__nav"
          aria-label={nextMonthAria}
          onClick={goNext}
          disabled={!canNext}
        >
          <span className="book-demo-cal__nav-icon" aria-hidden>
            ›
          </span>
        </button>
      </div>

      <div className="book-demo-cal__weekdays">
        {weekdays.map((w) => (
          <span key={w} className="book-demo-cal__weekday">
            {w}
          </span>
        ))}
      </div>

      <div className="book-demo-cal__grid" role="grid" aria-readonly="true">
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} className="book-demo-cal__row" role="row">
            {grid.slice(row * 7, row * 7 + 7).map((c) => {
              const iso = cellIso(c);
              const dis = cellDisabled(c);
              const oor = cellOutOfRange(c);
              const sel = value === iso;
              const tdy = todayIso === iso;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="gridcell"
                  disabled={dis}
                  aria-selected={sel}
                  className={clsx(
                    'book-demo-cal__day',
                    !c.inMonth && 'book-demo-cal__day--outside',
                    oor && 'book-demo-cal__day--muted',
                    sel && 'book-demo-cal__day--selected',
                    tdy && !sel && 'book-demo-cal__day--today'
                  )}
                  onClick={() => !dis && onChange(iso)}
                >
                  {c.d}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
