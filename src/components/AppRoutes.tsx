import {Route, Routes} from "react-router";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/lib/NotFoundPage";
import Sidebar from "./custom/Sidebar/Sidebar";
import DayPage from "./pages/DayPage";
import HomeOfficePage from "./pages/HomeOfficePage";

export default function AppRoutes() {

    return (
        <div className="flex min-h-screen max-h-screen max-w-screen bg-background text-text-primary">
            <Sidebar />
            <div className={`flex flex-col w-full min-w-0 transition-all duration-300 ml-60`}>
                <main className="flex-1 overflow-auto p-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="*" element={<NotFoundPage />} />

                        <Route path="/day" element={<DayPage />} />
                        <Route path="/homeoffice" element={<HomeOfficePage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
