import { useEffect } from "react";
import { Smile, Zap } from "lucide-react";
import useWebcam from "../../hooks/useWebcam";

const emotionStyles = {
  Engaged: "bg-emerald-500/10 text-emerald-700",
  Focused: "bg-sky-500/10 text-sky-700",
  Nervous: "bg-amber-500/10 text-amber-700",
};

const VideoFeed = ({ emotion = "Focused" }) => {
  const { videoRef, isActive, error, start, stop } = useWebcam();

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Live camera</p>
          <h3 className="text-xl font-semibold text-slate-900">Candidate feed</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
          <Zap size={18} /> {isActive ? "Connected" : "Inactive"}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-1">
        <video ref={videoRef} autoPlay muted playsInline className="h-72 w-full rounded-3xl object-cover" />
        <div className={`absolute left-4 top-4 rounded-2xl px-3 py-2 text-xs font-semibold ${emotionStyles[emotion] || emotionStyles.Focused}`}>
          <span className="inline-flex items-center gap-1">
            <Smile size={14} /> {emotion}
          </span>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={start} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">Restart</button>
        <button onClick={stop} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">Stop</button>
      </div>
    </div>
  );
};

export default VideoFeed;
