import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Button from "../ui/Button";

const FollowUpBanner = ({ followUpQuestion, onAnswer, onSkip }) => {
  return (
    <AnimatePresence>
      {followUpQuestion && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="rounded-lg border border-amber-300 bg-amber-50 p-5"
        >
          <div className="flex gap-3">
            <MessageCircle className="mt-1 text-amber-700" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-950">Follow-Up Question</h3>
              <p className="mt-2 text-sm text-amber-900">{followUpQuestion.text || followUpQuestion}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={onAnswer}>Answer This</Button>
                <Button variant="outline" onClick={onSkip}>Skip to Next</Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FollowUpBanner;
