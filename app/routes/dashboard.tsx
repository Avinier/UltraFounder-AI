import { Link } from "@remix-run/react";
import AnalyticsDashboard from "~/components/Dashboard/AnalyticsDashboard"
import { ChevronLeft } from "lucide-react";
import DashboardOverview from "~/components/Dashboard/DashboardOverview"

export default function Dashboard() {
    return (
        <>
            <Link to="/" className="absolute top-4 left-4 inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-grey/50 text-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Link>
            <AnalyticsDashboard/>
        </>
    )
}
