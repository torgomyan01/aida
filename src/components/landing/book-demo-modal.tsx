'use client';

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

import { useLandingMessages } from '@/i18n/landing/hooks';

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
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSent(false);
    setName('');
    setPhone('');
    setEmail('');
  }, [open]);

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
      panelRef.current?.querySelector<HTMLInputElement>('.book-demo-modal__input')?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, sent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) return;
    const payload = { name: name.trim(), phone: phone.trim(), email: email.trim() };
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aida:book-demo', { detail: payload }));
    }
    setSent(true);
  };

  const handleBookAnother = () => {
    setSent(false);
    setName('');
    setPhone('');
    setEmail('');
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
        className="book-demo-modal__panel"
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
              <h2 id={titleId} className="book-demo-modal__title">
                {messages.bookDemo.title}
              </h2>

              <label className="book-demo-modal__field book-demo-modal__field--first">
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

              <label className="book-demo-modal__field">
                <span className="book-demo-modal__label">{messages.bookDemo.emailLabel}</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder={messages.bookDemo.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
