import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </div>
    </AuthProvider>
  );
}

export default App;
