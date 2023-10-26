import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ComingSoon from "./ComingSoon";

function AppRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<ComingSoon />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default AppRouter;
