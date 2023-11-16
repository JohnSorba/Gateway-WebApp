import "./App.css";
import { AuthProvider } from "./Contexts/AuthContext";
import AppRouter from "./comps/AppRouter";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  );
}

export default App;
