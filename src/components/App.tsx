import {HashRouter as Router} from "react-router";
import AppRoutes from "./AppRoutes";

export default function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}
