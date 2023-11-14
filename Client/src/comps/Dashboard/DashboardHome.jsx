import "./DashboardHome.css";

function DashboardHome() {
  return (
    <div className="dashboard-home">
      <header className="header">
        <h2>Welcome to your Dashboard!</h2>
      </header>
      <section className="stats">
        <article className="item">1220</article>
        <article className="item">120</article>
        <article className="item">15</article>
        <article className="item">100</article>
      </section>
      <section className="middle-section">
        <div className="item">Upcoming Classes</div>
        <div className="item">Attendance Overview</div>
      </section>
    </div>
  );
}

export default DashboardHome;
