import { useMemo, useState } from "react";

type AdminDashboardProps = {
  onBack: () => void;
};

type ModuleKey =
  | "overview"
  | "accounts"
  | "rooms"
  | "customers"
  | "operations"
  | "reports";

type DataRow = {
  id: string;
  primary: string;
  secondary: string;
  detail: string;
  amount: string;
  status: string;
  statusTone: "success" | "warning" | "info" | "muted";
};

const moduleData: Record<
  Exclude<ModuleKey, "overview" | "reports">,
  {
    owner: string;
    title: string;
    eyebrow: string;
    description: string;
    columns: [string, string, string, string, string];
    rows: DataRow[];
  }
> = {
  accounts: {
    owner: "Sinh viên 1",
    title: "Tài khoản & loại phòng",
    eyebrow: "Phân quyền hệ thống",
    description:
      "Quản lý tài khoản, vai trò truy cập và dữ liệu nền cho từng loại phòng.",
    columns: ["Tài khoản", "Vai trò", "Thông tin", "Hoạt động", "Trạng thái"],
    rows: [
      { id: "TK001", primary: "Nguyễn Minh Anh", secondary: "admin.uneti", detail: "Quản trị viên", amount: "Hôm nay, 08:42", status: "Hoạt động", statusTone: "success" },
      { id: "TK014", primary: "Trần Thu Hà", secondary: "letan.ha", detail: "Nhân viên lễ tân", amount: "Hôm qua, 21:10", status: "Hoạt động", statusTone: "success" },
      { id: "TK028", primary: "Lê Quang Huy", secondary: "huy.le", detail: "Khách hàng", amount: "10/06/2026", status: "Chờ xác minh", statusTone: "warning" },
      { id: "TK031", primary: "Phạm Ngọc Mai", secondary: "mai.pham", detail: "Khách hàng", amount: "08/06/2026", status: "Tạm khóa", statusTone: "muted" },
    ],
  },
  rooms: {
    owner: "Sinh viên 2",
    title: "Quản lý phòng",
    eyebrow: "Kho phòng & khả dụng",
    description:
      "Tìm kiếm, lọc, sắp xếp và theo dõi trạng thái phòng theo từng tầng.",
    columns: ["Phòng", "Loại phòng", "Vị trí", "Đơn giá", "Trạng thái"],
    rows: [
      { id: "P1201", primary: "Phòng 1201", secondary: "Tầng 12", detail: "Deluxe hướng biển", amount: "1.290.000₫", status: "Sẵn sàng", statusTone: "success" },
      { id: "P1504", primary: "Phòng 1504", secondary: "Tầng 15", detail: "Executive Suite", amount: "2.580.000₫", status: "Đang sử dụng", statusTone: "info" },
      { id: "P1801", primary: "Phòng 1801", secondary: "Tầng 18", detail: "Presidential Suite", amount: "5.990.000₫", status: "Đã đặt trước", statusTone: "warning" },
      { id: "P0908", primary: "Phòng 0908", secondary: "Tầng 09", detail: "Deluxe City View", amount: "1.090.000₫", status: "Bảo trì", statusTone: "muted" },
      { id: "P1205", primary: "Phòng 1205", secondary: "Tầng 12", detail: "Deluxe hướng biển", amount: "1.290.000₫", status: "Sẵn sàng", statusTone: "success" },
    ],
  },
  customers: {
    owner: "Sinh viên 3",
    title: "Khách hàng & đặt phòng",
    eyebrow: "Hồ sơ và hành trình khách",
    description:
      "Quản lý hồ sơ cá nhân, yêu cầu đặt phòng và lịch sử lưu trú của khách.",
    columns: ["Khách hàng", "Mã đặt phòng", "Hạng phòng", "Ngày lưu trú", "Trạng thái"],
    rows: [
      { id: "KH0241", primary: "Lê Quang Huy", secondary: "0912 345 678", detail: "BK-260610-014", amount: "10/06 — 12/06", status: "Đã xác nhận", statusTone: "success" },
      { id: "KH0188", primary: "Vũ Thanh Tú", secondary: "0988 201 456", detail: "BK-260610-012", amount: "10/06 — 13/06", status: "Chờ xác nhận", statusTone: "warning" },
      { id: "KH0205", primary: "Nguyễn Hoài An", secondary: "0904 667 182", detail: "BK-260609-042", amount: "09/06 — 11/06", status: "Đang lưu trú", statusTone: "info" },
      { id: "KH0127", primary: "Đỗ Minh Châu", secondary: "0966 552 391", detail: "BK-260608-018", amount: "08/06 — 10/06", status: "Hoàn thành", statusTone: "muted" },
    ],
  },
  operations: {
    owner: "Sinh viên 4",
    title: "Tiếp nhận & trạng thái",
    eyebrow: "Vận hành lễ tân",
    description:
      "Tiếp nhận đặt phòng, thực hiện nhận/trả phòng và kiểm soát luồng trạng thái.",
    columns: ["Giao dịch", "Khách lưu trú", "Phòng", "Thời gian", "Trạng thái"],
    rows: [
      { id: "BK-260610-014", primary: "BK-260610-014", secondary: "Tạo lúc 08:42", detail: "Lê Quang Huy · P1201", amount: "Nhận lúc 14:00", status: "Chờ nhận phòng", statusTone: "warning" },
      { id: "BK-260610-009", primary: "BK-260610-009", secondary: "Tạo lúc 07:18", detail: "Hoàng Minh Đức · P1504", amount: "Trả lúc 12:00", status: "Đang lưu trú", statusTone: "info" },
      { id: "BK-260609-042", primary: "BK-260609-042", secondary: "Tạo hôm qua", detail: "Nguyễn Hoài An · P1801", amount: "11/06, 12:00", status: "Đã nhận phòng", statusTone: "success" },
      { id: "BK-260608-018", primary: "BK-260608-018", secondary: "Tạo 08/06", detail: "Đỗ Minh Châu · P0902", amount: "10/06, 10:25", status: "Đã trả phòng", statusTone: "muted" },
    ],
  },
};

const navItems: { key: ModuleKey; label: string; owner?: string; icon: string }[] = [
  { key: "overview", label: "Tổng quan", icon: "⌂" },
  { key: "accounts", label: "Tài khoản & loại phòng", owner: "SV 1", icon: "A" },
  { key: "rooms", label: "Quản lý phòng", owner: "SV 2", icon: "P" },
  { key: "customers", label: "Khách hàng & đặt phòng", owner: "SV 3", icon: "K" },
  { key: "operations", label: "Tiếp nhận & trạng thái", owner: "SV 4", icon: "N" },
  { key: "reports", label: "Doanh thu & báo cáo", owner: "SV 5", icon: "B" },
];

const statusOptions = ["Tất cả trạng thái", "Hoạt động", "Sẵn sàng", "Chờ xác nhận", "Đang lưu trú"];

function MiniIcon({ type }: { type: "search" | "bell" | "plus" | "download" | "arrow" | "menu" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M5 21h14" /></>,
    arrow: <path d="m9 18 6-6-6-6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  };
  return <svg aria-hidden="true" className="admin-icon" viewBox="0 0 24 24">{paths[type]}</svg>;
}

function Overview({ onOpen }: { onOpen: (key: ModuleKey) => void }) {
  const stats = [
    { label: "Tổng số phòng", value: "128", note: "96 phòng khả dụng", trend: "+4.8%", tone: "navy" },
    { label: "Khách đang lưu trú", value: "74", note: "12 khách VIP", trend: "+12.3%", tone: "gold" },
    { label: "Đặt phòng hôm nay", value: "26", note: "08 chờ xử lý", trend: "+8.1%", tone: "blue" },
    { label: "Doanh thu tháng", value: "1,84 Tỷ", note: "Đạt 82% mục tiêu", trend: "+16.5%", tone: "green" },
  ];

  return (
    <>
      <div className="admin-title-row">
        <div>
          <span className="admin-overline">Trung tâm vận hành</span>
          <h1>Chào buổi sáng, Minh Anh.</h1>
          <p>Tổng quan hoạt động khách sạn ngày 10 tháng 06, 2026.</p>
        </div>
        <button className="admin-primary" onClick={() => onOpen("customers")}>
          <MiniIcon type="plus" /> Tạo đặt phòng
        </button>
      </div>

      <div className="stat-grid">
        {stats.map((stat) => (
          <article className={`stat-card stat-card--${stat.tone}`} key={stat.label}>
            <div className="stat-top">
              <span>{stat.label}</span>
              <strong>{stat.trend}</strong>
            </div>
            <b>{stat.value}</b>
            <small>{stat.note}</small>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card revenue-card">
          <div className="card-heading">
            <div><span>Hiệu suất kinh doanh</span><h2>Doanh thu 7 ngày gần nhất</h2></div>
            <button className="admin-select">Tuần này <MiniIcon type="arrow" /></button>
          </div>
          <div className="revenue-summary"><strong>428.600.000₫</strong><span>+14,2% so với tuần trước</span></div>
          <div className="bar-chart" aria-label="Biểu đồ doanh thu 7 ngày">
            {[48, 64, 54, 78, 66, 90, 74].map((height, index) => (
              <div className="bar-column" key={index}>
                <i style={{ height: `${height}%` }}><span>{[48, 62, 54, 76, 65, 91, 74][index]}tr</span></i>
                <small>{["T2", "T3", "T4", "T5", "T6", "T7", "CN"][index]}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card occupancy-card">
          <div className="card-heading"><div><span>Công suất phòng</span><h2>Theo hạng phòng</h2></div></div>
          <div className="occupancy-ring"><div><strong>76%</strong><span>Trung bình</span></div></div>
          <div className="occupancy-list">
            {[["Deluxe", "84%"], ["Executive", "72%"], ["Presidential", "58%"]].map(([name, value]) => (
              <div key={name}><span><i />{name}</span><strong>{value}</strong></div>
            ))}
          </div>
        </article>
      </div>

      <article className="dashboard-card recent-card">
        <div className="card-heading">
          <div><span>Cập nhật gần đây</span><h2>Đặt phòng mới nhất</h2></div>
          <button className="admin-text-button" onClick={() => onOpen("operations")}>Xem tất cả →</button>
        </div>
        <DataTable columns={["Mã đặt phòng", "Khách hàng", "Hạng phòng", "Tổng tiền", "Trạng thái"]} rows={[
          { id: "BK-260610-014", primary: "BK-260610-014", secondary: "Đặt trực tiếp", detail: "Lê Quang Huy", amount: "2.580.000₫", status: "Đã xác nhận", statusTone: "success" },
          { id: "BK-260610-012", primary: "BK-260610-012", secondary: "Website", detail: "Vũ Thanh Tú", amount: "7.740.000₫", status: "Chờ xử lý", statusTone: "warning" },
          { id: "BK-260610-009", primary: "BK-260610-009", secondary: "Đặt trực tiếp", detail: "Hoàng Minh Đức", amount: "5.160.000₫", status: "Đang lưu trú", statusTone: "info" },
        ]} />
      </article>
    </>
  );
}

function DataTable({ columns, rows }: { columns: string[]; rows: DataRow[] }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}<th /></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td><strong>{row.primary}</strong><small>{row.secondary}</small></td>
              <td>{row.detail}</td>
              <td>{row.id.startsWith("P") ? row.secondary : row.id.startsWith("TK") ? row.detail : row.primary}</td>
              <td><strong>{row.amount}</strong></td>
              <td><span className={`status-badge status-badge--${row.statusTone}`}><i />{row.status}</span></td>
              <td><button className="row-action" aria-label={`Xem chi tiết ${row.primary}`}>•••</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModuleView({ moduleKey }: { moduleKey: Exclude<ModuleKey, "overview" | "reports"> }) {
  const data = moduleData[moduleKey];
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);
  const filteredRows = useMemo(() => {
    const normalized = query.toLowerCase();
    return data.rows.filter((row) => {
      const matchesSearch = Object.values(row).some((value) => String(value).toLowerCase().includes(normalized));
      const matchesStatus = status === statusOptions[0] || row.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [data.rows, query, status]);

  return (
    <>
      <div className="admin-title-row">
        <div>
          <span className="admin-overline">{data.eyebrow}</span>
          <h1>{data.title}</h1>
          <p>{data.description}</p>
        </div>
        <button className="admin-primary"><MiniIcon type="plus" /> Thêm mới</button>
      </div>

      <div className="module-owner">
        <div className="owner-avatar">{data.owner.slice(-1)}</div>
        <div><small>Phụ trách chính</small><strong>{data.owner}</strong></div>
        <span>Mỗi thành viên vẫn cần hiểu cấu trúc chung và luồng nghiệp vụ liên quan.</span>
      </div>

      <article className="dashboard-card data-card">
        <div className="table-toolbar">
          <label className="admin-search">
            <MiniIcon type="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm theo mã, tên hoặc trạng thái..." />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          <button className="admin-secondary"><MiniIcon type="download" /> Xuất dữ liệu</button>
        </div>
        <div className="table-result-row"><span>Hiển thị <strong>{filteredRows.length}</strong> kết quả</span><span>Sắp xếp: Mới nhất</span></div>
        {filteredRows.length ? (
          <DataTable columns={data.columns} rows={filteredRows} />
        ) : (
          <div className="empty-table"><strong>Không tìm thấy dữ liệu</strong><span>Hãy thử từ khóa hoặc bộ lọc khác.</span></div>
        )}
        <div className="pagination"><button disabled>←</button><button className="active">1</button><button>2</button><button>3</button><button>→</button></div>
      </article>
    </>
  );
}

function ReportsView() {
  return (
    <>
      <div className="admin-title-row">
        <div>
          <span className="admin-overline">Sinh viên 5 · Tài chính</span>
          <h1>Doanh thu & báo cáo</h1>
          <p>Tính tiền phòng, thống kê hiệu suất và xuất báo cáo quản trị.</p>
        </div>
        <button className="admin-primary"><MiniIcon type="download" /> Xuất báo cáo</button>
      </div>
      <div className="report-highlight">
        <div><span>Doanh thu tháng 06</span><strong>1.842.600.000₫</strong><small>+16,5% so với tháng 05</small></div>
        <div><span>Đã thanh toán</span><strong>1.568.200.000₫</strong><small>85,1% tổng doanh thu</small></div>
        <div><span>Chờ thanh toán</span><strong>274.400.000₫</strong><small>18 giao dịch</small></div>
      </div>
      <div className="dashboard-grid report-grid">
        <article className="dashboard-card revenue-card">
          <div className="card-heading"><div><span>Xu hướng</span><h2>Doanh thu theo tháng</h2></div><button className="admin-select">Năm 2026 <MiniIcon type="arrow" /></button></div>
          <div className="line-chart">
            <div className="line-fill" />
            <div className="line-path">●<span>●</span><span>●</span><span>●</span><span>●</span><span>●</span></div>
            <div className="month-labels">{["T1", "T2", "T3", "T4", "T5", "T6"].map((month) => <small key={month}>{month}</small>)}</div>
          </div>
        </article>
        <article className="dashboard-card">
          <div className="card-heading"><div><span>Cơ cấu doanh thu</span><h2>Theo hạng phòng</h2></div></div>
          <div className="report-bars">
            {[["Deluxe hướng biển", 78, "682,4tr"], ["Executive Suite", 62, "546,8tr"], ["Presidential", 39, "346,2tr"], ["Dịch vụ khác", 27, "267,2tr"]].map(([name, width, value]) => (
              <div key={name as string}><p><span>{name}</span><strong>{value}</strong></p><i><b style={{ width: `${width}%` }} /></i></div>
            ))}
          </div>
        </article>
      </div>
    </>
  );
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [active, setActive] = useState<ModuleKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openModule = (key: ModuleKey) => {
    setActive(key);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-app">
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <button className="admin-brand" onClick={onBack}>
          <span>U</span><div><strong>UNETI GRAND</strong><small>HOTEL MANAGEMENT</small></div>
        </button>
        <div className="sidebar-section-label">Không gian làm việc</div>
        <nav>
          {navItems.map((item) => (
            <button className={active === item.key ? "active" : ""} key={item.key} onClick={() => openModule(item.key)}>
              <i>{item.icon}</i><span>{item.label}</span>{item.owner && <small>{item.owner}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-help"><span>?</span><div><strong>Cần hỗ trợ?</strong><small>Xem tài liệu hệ thống</small></div></div>
        <button className="back-to-site" onClick={onBack}>← Về trang khách sạn</button>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <button className="admin-menu" onClick={() => setSidebarOpen((open) => !open)} aria-label="Mở menu"><MiniIcon type="menu" /></button>
          <div className="global-search"><MiniIcon type="search" /><input placeholder="Tìm kiếm nhanh..." /><kbd>⌘ K</kbd></div>
          <div className="admin-header-actions">
            <button className="notification" aria-label="Thông báo"><MiniIcon type="bell" /><i /></button>
            <div className="admin-profile"><span>MA</span><div><strong>Minh Anh</strong><small>Quản trị viên</small></div><MiniIcon type="arrow" /></div>
          </div>
        </header>
        <main className="admin-content">
          {active === "overview" && <Overview onOpen={openModule} />}
          {active !== "overview" && active !== "reports" && <ModuleView moduleKey={active} />}
          {active === "reports" && <ReportsView />}
        </main>
      </div>
      {sidebarOpen && <button aria-label="Đóng menu" className="admin-scrim" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
