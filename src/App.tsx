import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import { HOME_PATH } from "./constant/constants";
import Home from "./pages/home/Home";
import LoadingPage from "./ui/LoadingPage";

export default function App() {
  return (
    <Routes>
      <Route path={HOME_PATH} element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingPage />}>
              <Home />
            </Suspense>
          }
        />
        <Route path="*" element={<p>Error</p>} />
      </Route>
    </Routes>
  );
}
