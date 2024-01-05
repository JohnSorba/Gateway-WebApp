import "./App.css";
import { AuthProvider } from "./Contexts/AuthContext";
import { SearchProvider } from "./Contexts/SearchContext";
import { UserProvider } from "./Contexts/UserContext";
import AppRouter from "./comps/AppRouter";

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <UserProvider>
          <SearchProvider>
            <AppRouter />
          </SearchProvider>
        </UserProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
