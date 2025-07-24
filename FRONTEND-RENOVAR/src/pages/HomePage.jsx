import DashboardMetrics from "../components/DashboardMetrics";
import CampaignsTable from "../components/CampaignsTable";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Comunicaciones Masivas</h1>
        <DashboardMetrics />
        <CampaignsTable />
      </div>
    </div>
  );
};

export default HomePage;