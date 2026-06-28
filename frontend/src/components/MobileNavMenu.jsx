import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

/**
 * Hamburger menu for mobile navigation.
 *
 * Props:
 *   items   – [{ label, to?, href? }]  (use `to` for React Router, `href` for anchors)
 *   actions – optional JSX rendered below items (e.g. Sign In / Get Started buttons)
 */
export function MobileNavMenu({ items = [], actions = null }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Hamburger toggle — visible on mobile only */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
              onClick={close}
              aria-hidden="true"
            />

            {/* Full-screen slide-down panel */}
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 bg-card z-50 flex flex-col"
            >
              {/* Panel header row */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-playfair font-bold text-lg">H</span>
                  </div>
                  <span className="font-playfair font-bold text-xl tracking-tight">HerJo</span>
                </div>
                <button
                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  onClick={close}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {items.map((item) =>
                  item.to ? (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={close}
                      className="flex items-center justify-between w-full py-3 px-4 rounded-xl hover:bg-muted/50 text-base font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={close}
                      className="flex items-center justify-between w-full py-3 px-4 rounded-xl hover:bg-muted/50 text-base font-medium transition-colors"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </nav>

              {/* CTA actions (e.g. Sign In / Get Started) */}
              {actions && (
                <div className="px-4 pb-8 pt-4 border-t border-border/40 flex flex-col gap-3 flex-shrink-0">
                  {actions}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
