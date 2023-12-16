import "./App.css";
import { AuthProvider } from "./Contexts/AuthContext";
import { UserProvider } from "./Contexts/UserContext";
import AppRouter from "./comps/AppRouter";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <UserProvider>
          <AppRouter />
        </UserProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
