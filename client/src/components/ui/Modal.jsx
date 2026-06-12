import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-soft"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <button onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
            {footer && <div className="border-t border-slate-200 px-6 py-4">{footer}</div>}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Modal;
