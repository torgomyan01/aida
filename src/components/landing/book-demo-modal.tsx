'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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

const panelTransition = (reduce: boolean) =>
  reduce
    ? { duration: 0.15 }
    : { type: 'spring' as const, damping: 28, stiffness: 360, mass: 0.82 };

const backdropTransition = (reduce: boolean) =>
  reduce ? { duration: 0.12 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

const staggerContainer = (reduce: boolean) => ({
  hidden: {},
  show: {
    transition: reduce
      ? { staggerChildren: 0.02, delayChildren: 0 }
      : { staggerChildren: 0.055, delayChildren: 0.08 },
  },
});

const staggerItem = (reduce: boolean) => ({
  hidden: { opacity: 0, y: reduce ? 0 : 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: reduce
      ? { duration: 0.12 }
      : { type: 'spring' as const, damping: 26, stiffness: 320 },
  },
});

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
  const reduceMotion = useReducedMotion();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const reduce = reduceMotion ?? false;

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

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="book-demo-root"
          className="book-demo-modal__root"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition(reduce)}
        >
          <button
            type="button"
            className="book-demo-modal__backdrop"
            aria-label={messages.bookDemo.closeAria}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="book-demo-modal__panel"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 36, scale: 0.94 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={panelTransition(reduce)}
          >
            <motion.button
              type="button"
              className="book-demo-modal__close"
              onClick={onClose}
              aria-label={messages.bookDemo.closeAria}
              initial={reduce ? false : { opacity: 0, scale: 0.65, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={
                reduce
                  ? { duration: 0.1 }
                  : { type: 'spring', damping: 22, stiffness: 400, delay: 0.12 }
              }
              whileTap={reduce ? undefined : { scale: 0.92 }}
              whileHover={reduce ? undefined : { scale: 1.05 }}
            >
              <span aria-hidden>×</span>
            </motion.button>

            <div className="book-demo-modal__scroll">
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.div
                    key="success"
                    className="book-demo-modal__success"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={panelTransition(reduce)}
                  >
                    <motion.div
                      variants={staggerContainer(reduce)}
                      initial="hidden"
                      animate="show"
                    >
                      <motion.h2 id={titleId} className="book-demo-modal__title" variants={staggerItem(reduce)}>
                        {messages.bookDemo.successTitle}
                      </motion.h2>
                      <motion.p className="book-demo-modal__text" variants={staggerItem(reduce)}>
                        {messages.bookDemo.successBody}
                      </motion.p>
                      <motion.div className="book-demo-modal__actions" variants={staggerItem(reduce)}>
                        <button type="button" className="green-btn" onClick={handleBookAnother}>
                          {messages.bookDemo.bookAnother}
                        </button>
                        <button type="button" className="book-demo-modal__btn-secondary" onClick={onClose}>
                          {messages.bookDemo.closeAria}
                        </button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="book-demo-modal__form"
                    noValidate
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={panelTransition(reduce)}
                  >
                    <motion.div
                      variants={staggerContainer(reduce)}
                      initial="hidden"
                      animate="show"
                    >
                      <motion.h2
                        id={titleId}
                        className="book-demo-modal__title"
                        variants={staggerItem(reduce)}
                      >
                        {messages.bookDemo.title}
                      </motion.h2>

                      <motion.label
                        className="book-demo-modal__field book-demo-modal__field--first"
                        variants={staggerItem(reduce)}
                      >
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
                      </motion.label>

                      <motion.label className="book-demo-modal__field" variants={staggerItem(reduce)}>
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
                      </motion.label>

                      <motion.label className="book-demo-modal__field" variants={staggerItem(reduce)}>
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
                      </motion.label>

                      <motion.div variants={staggerItem(reduce)}>
                        <motion.button
                          type="submit"
                          className="green-btn book-demo-modal__submit"
                          whileTap={reduce ? undefined : { scale: 0.98 }}
                        >
                          {messages.bookDemo.submit}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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
