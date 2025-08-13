const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">↗︎ 0 (0%)</div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Active Teams</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">↗︎ 0 (0%)</div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Active Challenges</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">↗︎ 0 (0%)</div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">Completed Challenges</div>
          <div className="stat-value">0</div>
          <div className="stat-desc">↗︎ 0 (0%)</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
