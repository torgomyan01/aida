'use client';

import { getLocalTimeZone, today } from '@internationalized/date';
import clsx from 'clsx';
import { useLocale } from 'next-intl';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { BookDemoCalendar } from '@/components/landing/book-demo-calendar';
import { useLandingMessages } from '@/i18n/landing/hooks';

const TIME_SLOTS = (() => {
  const out: string[] = [];
  for (let h = 9; h <= 17; h++) {
    for (const m of [0, 30]) {
      if (h === 17 && m === 30) continue;
      out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return out;
})();

function formatBookDemoTime(slot: string, locale: string): string {
  const [hh, mm] = slot.split(':');
  const h = Number(hh);
  const m = Number(mm);
  if (Number.isNaN(h) || Number.isNaN(m)) return slot;
  const d = new Date(2000, 0, 1, h, m);
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(d);
}

type BookDemoContextValue = {
  openBookDemo: () => void;
};

const BookDemoContext = createContext<BookDemoContextValue | null>(null);

export function useBookDemoModal(): BookDemoContextValue {
  const ctx = useContext(BookDemoContext);
  if (!ctx) {
    throw new Error('useBookDemoModal must be used within BookDemoModalProvider');
  }
  return ctx;
}

function BookDemoModalDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const messages = useLandingMessages();
  const appLocale = useLocale();
  const intlLocale = appLocale === 'ru' ? 'ru-RU' : appLocale === 'uz' ? 'uz-UZ' : 'en-US';
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const timeSelectRef = useRef<HTMLDivElement>(null);
  const [timeListOpen, setTimeListOpen] = useState(false);

  const tz = getLocalTimeZone();
  const minCalendarDate = today(tz);
  const maxCalendarDate = today(tz).add({ months: 6 });
  const minIso = minCalendarDate.toString();
  const maxIso = maxCalendarDate.toString();

  const [date, setDate] = useState('');
  const [time, setTime] = useState(TIME_SLOTS[0] ?? '09:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSent(false);
    setDate('');
    setTime(TIME_SLOTS[0] ?? '09:00');
    setName('');
    setPhone('');
    setTimeListOpen(false);
  }, [open]);

  useEffect(() => {
    if (!timeListOpen) return;
    const onDoc = (e: MouseEvent) => {
      const el = timeSelectRef.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) {
        setTimeListOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setTimeListOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [timeListOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('overflow');
    document.body.classList.add('overflow');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('overflow');
      document.body.classList.remove('overflow');
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || sent) return;
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLButtonElement>('.book-demo-cal__nav:not(:disabled)')?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, sent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date.trim() || !name.trim() || !phone.trim()) return;
    const payload = { date, time, name: name.trim(), phone: phone.trim() };
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aida:book-demo', { detail: payload }));
    }
    setSent(true);
  };

  const handleBookAnother = () => {
    setSent(false);
    setDate('');
    setTime(TIME_SLOTS[0] ?? '09:00');
    setName('');
    setPhone('');
  };

  if (!open) return null;

  return (
    <div className="book-demo-modal__root" role="presentation">
      <button
        type="button"
        className="book-demo-modal__backdrop"
        aria-label={messages.bookDemo.closeAria}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="book-demo-modal__panel book-demo-modal__panel--split"
      >
        <button
          type="button"
          className="book-demo-modal__close"
          onClick={onClose}
          aria-label={messages.bookDemo.closeAria}
        >
          <span aria-hidden>×</span>
        </button>

        <div className="book-demo-modal__scroll">
        {sent ? (
          <div className="book-demo-modal__success">
            <h2 id={titleId} className="book-demo-modal__title">
              {messages.bookDemo.successTitle}
            </h2>
            <p className="book-demo-modal__text">{messages.bookDemo.successBody}</p>
            <div className="book-demo-modal__actions">
              <button type="button" className="green-btn" onClick={handleBookAnother}>
                {messages.bookDemo.bookAnother}
              </button>
              <button type="button" className="book-demo-modal__btn-secondary" onClick={onClose}>
                {messages.bookDemo.closeAria}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="book-demo-modal__form" noValidate>
            <h2 id={titleId} className="book-demo-modal__title book-demo-modal__title--split">
              {messages.bookDemo.title}
            </h2>

            <div className="book-demo-modal__datetime-row">
              <div className="book-demo-modal__calendar-col">
                <span className="book-demo-modal__label" id={`${titleId}-date`}>
                  {messages.bookDemo.dateLabel}
                </span>
                <div className="book-demo-modal__calendar-wrap">
                  <BookDemoCalendar
                    value={date}
                    onChange={setDate}
                    minIso={minIso}
                    maxIso={maxIso}
                    locale={intlLocale}
                    ariaLabelledBy={`${titleId}-date`}
                    prevMonthAria={messages.bookDemo.prevMonthAria}
                    nextMonthAria={messages.bookDemo.nextMonthAria}
                  />
                </div>
                {!date ? (
                  <p className="book-demo-modal__hint" role="status">
                    {messages.bookDemo.pickDateHint}
                  </p>
                ) : null}
              </div>

              <aside className="book-demo-modal__time-col">
                <span className="book-demo-modal__label" id={`${titleId}-time`}>
                  {messages.bookDemo.timeLabel}
                </span>
                <div ref={timeSelectRef} className="book-demo-modal__time-select">
                  <button
                    type="button"
                    id={`${titleId}-time-trigger`}
                    className={clsx(
                      'book-demo-modal__time-select-trigger',
                      timeListOpen && 'is-open'
                    )}
                    aria-haspopup="listbox"
                    aria-expanded={timeListOpen}
                    aria-controls={`${titleId}-time-list`}
                    aria-labelledby={`${titleId}-time ${titleId}-time-value`}
                    onClick={() => setTimeListOpen((o) => !o)}
                  >
                    <span id={`${titleId}-time-value`} className="book-demo-modal__time-select-value">
                      {formatBookDemoTime(time, intlLocale)}
                    </span>
                    <span className="book-demo-modal__time-select-chevron" aria-hidden />
                  </button>
                  {timeListOpen ? (
                    <ul
                      id={`${titleId}-time-list`}
                      className="book-demo-modal__time-select-list"
                      role="listbox"
                      aria-labelledby={`${titleId}-time`}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <li key={slot} className="book-demo-modal__time-select-item" role="presentation">
                          <button
                            type="button"
                            role="option"
                            className={clsx(
                              'book-demo-modal__time-select-option',
                              time === slot && 'is-selected'
                            )}
                            aria-selected={time === slot}
                            onClick={() => {
                              setTime(slot);
                              setTimeListOpen(false);
                            }}
                          >
                            {formatBookDemoTime(slot, intlLocale)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </aside>
            </div>

            <label className="book-demo-modal__field book-demo-modal__field--after-split">
              <span className="book-demo-modal__label">{messages.bookDemo.nameLabel}</span>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder={messages.bookDemo.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="book-demo-modal__input"
              />
            </label>

            <label className="book-demo-modal__field">
              <span className="book-demo-modal__label">{messages.bookDemo.phoneLabel}</span>
              <input
                type="tel"
                required
                autoComplete="tel"
                placeholder={messages.bookDemo.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="book-demo-modal__input"
              />
            </label>

            <button type="submit" className="green-btn book-demo-modal__submit">
              {messages.bookDemo.submit}
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}

export function BookDemoModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openBookDemo = useCallback(() => setOpen(true), []);
  const closeBookDemo = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openBookDemo }), [openBookDemo]);

  return (
    <BookDemoContext.Provider value={value}>
      {children}
      <BookDemoModalDialog open={open} onClose={closeBookDemo} />
    </BookDemoContext.Provider>
  );
}
