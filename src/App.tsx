import { useMemo, useState } from "react";
import AdminDashboard from "./AdminDashboard";

type IconName =
  | "arrow"
  | "calendar"
  | "check"
  | "chevron"
  | "close"
  | "heart"
  | "menu"
  | "minus"
  | "moon"
  | "plus"
  | "search"
  | "sparkle"
  | "star"
  | "user"
  | "users";

type IconProps = {
  name: IconName;
  size?: number;
  filled?: boolean;
};

function Icon({ name, size = 18, filled = false }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    minus: <path d="M5 12h14" />,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    sparkle: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></>,
    star: <path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9L6.4 20l1.1-6.2L3 9.4l6.2-.9L12 2.8Z" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill={filled ? "currentColor" : "none"}
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "gold" | "navy" | "ghost" | "light" | "icon";
};

function Button({ children, className = "", tone = "navy", ...props }: ButtonProps) {
  return (
    <button className={`button button--${tone} ${className}`} {...props}>
      {children}
    </button>
  );
}

const rooms = [
  {
    id: 1,
    name: "Deluxe hướng biển",
    type: "Deluxe",
    price: 1290000,
    image:
      "https://images.unsplash.com/photo-1668277155881-9d3bccb1683a?auto=format&fit=crop&w=1100&q=86",
    meta: "1 giường King · 2 khách · 42m²",
    description: "Ban công riêng đón bình minh, bồn tắm đá và tầm nhìn trọn vịnh.",
    label: "Được yêu thích",
  },
  {
    id: 2,
    name: "Executive Suite",
    type: "Suite",
    price: 2580000,
    image:
      "https://images.unsplash.com/photo-1556426983-5705abbfcad6?auto=format&fit=crop&w=1100&q=86",
    meta: "1 giường King · 2 khách · 68m²",
    description: "Không gian tiếp khách biệt lập cùng đặc quyền Executive Lounge.",
    label: "Bữa sáng miễn phí",
  },
  {
    id: 3,
    name: "Presidential Suite",
    type: "Presidential",
    price: 5990000,
    image:
      "https://images.unsplash.com/photo-1776876648949-63ccabf63b10?auto=format&fit=crop&w=1100&q=86",
    meta: "2 giường King · 4 khách · 120m²",
    description: "Dấu ấn thượng lưu với phòng khách lớn và dịch vụ quản gia riêng.",
    label: "Trải nghiệm độc bản",
  },
];

const experiences = [
  {
    title: "Hồ bơi chân mây",
    subtitle: "Mở cửa hằng ngày · 06:00—22:00",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=86",
  },
  {
    title: "Serene Spa",
    subtitle: "Liệu trình thư giãn từ thảo mộc bản địa",
    image:
      "https://images.unsplash.com/photo-1775811091644-69162fa36ea1?auto=format&fit=crop&w=1200&q=86",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "₫";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("Tất cả");
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [searchMessage, setSearchMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<(typeof rooms)[number] | null>(
    null,
  );
  const [bookingDone, setBookingDone] = useState(false);

  const visibleRooms = useMemo(
    () => rooms.filter((room) => roomType === "Tất cả" || room.type === roomType),
    [roomType],
  );

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((roomId) => roomId !== id)
        : [...current, id],
    );
  };

  const handleSearch = () => {
    setSearchMessage(
      `Đã tìm thấy ${visibleRooms.length} hạng phòng phù hợp cho ${guests} khách.`,
    );
    document.querySelector("#rooms")?.scrollIntoView({ behavior: "smooth" });
  };

  const openBooking = (room: (typeof rooms)[number]) => {
    setBookingDone(false);
    setSelectedRoom(room);
  };

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <main>
      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#top" aria-label="UNETI Grand Hotel trang chủ">
            <span className="brand-mark">U</span>
            <span>
              <strong>UNETI GRAND</strong>
              <small>HOTEL & SPA</small>
            </span>
          </a>

          <nav className={`main-nav ${mobileMenu ? "is-open" : ""}`}>
            <a href="#top" className="is-active">Trang chủ</a>
            <a href="#rooms">Hạng phòng</a>
            <a href="#experience">Trải nghiệm</a>
            <a href="#story">Về chúng tôi</a>
            <button className="nav-admin-link" onClick={() => setShowAdmin(true)}>Quản trị</button>
          </nav>

          <div className="nav-actions">
            <Button tone="ghost" className="desktop-action" onClick={() => setShowAdmin(true)}>
              <Icon name="user" size={17} /> Đăng nhập
            </Button>
            <Button
              tone="gold"
              className="desktop-action"
              onClick={() => document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" })}
            >
              Đặt phòng
            </Button>
            <Button
              aria-label={mobileMenu ? "Đóng menu" : "Mở menu"}
              className="menu-button"
              onClick={() => setMobileMenu((open) => !open)}
              tone="icon"
            >
              <Icon name={mobileMenu ? "close" : "menu"} />
            </Button>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1668277155756-0ebb2801f6b4?auto=format&fit=crop&w=2200&q=90"
          alt="Không gian nghỉ dưỡng nhìn ra biển lúc hoàng hôn"
        />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="eyebrow light"><span /> Trải nghiệm nghỉ dưỡng 5 sao</div>
          <h1>Nơi mỗi khoảnh khắc<br />trở thành <em>di sản.</em></h1>
          <p>
            Vẻ đẹp tinh tuyển, lòng hiếu khách chân thành và những trải nghiệm
            được thiết kế riêng cho bạn.
          </p>
          <div className="hero-actions">
            <Button tone="gold" onClick={() => document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" })}>
              Khám phá kỳ nghỉ <Icon name="arrow" />
            </Button>
            <a className="text-link text-link--light" href="#rooms">
              Xem hạng phòng <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
        <div className="hero-index">
          <span>01</span><i /><small>03</small>
        </div>
      </section>

      <section className="booking-shell" id="booking">
        <div className="container">
          <div className="booking-panel">
            <div className="booking-heading">
              <span className="booking-icon"><Icon name="sparkle" /></span>
              <div>
                <small>Đặt phòng trực tiếp</small>
                <strong>Giá tốt nhất được đảm bảo</strong>
              </div>
            </div>

            <div className="field">
              <label htmlFor="checkin">Ngày nhận phòng</label>
              <div className="input-wrap">
                <Icon name="calendar" size={17} />
                <input id="checkin" type="date" defaultValue="2026-06-10" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="checkout">Ngày trả phòng</label>
              <div className="input-wrap">
                <Icon name="calendar" size={17} />
                <input id="checkout" type="date" defaultValue="2026-06-12" />
              </div>
            </div>
            <div className="field guest-field">
              <label>Số khách lưu trú</label>
              <div className="guest-control">
                <Button
                  aria-label="Giảm số khách"
                  disabled={guests <= 1}
                  onClick={() => setGuests((count) => Math.max(1, count - 1))}
                  tone="icon"
                >
                  <Icon name="minus" size={15} />
                </Button>
                <span><Icon name="users" size={17} /> {guests} khách</span>
                <Button
                  aria-label="Tăng số khách"
                  disabled={guests >= 6}
                  onClick={() => setGuests((count) => Math.min(6, count + 1))}
                  tone="icon"
                >
                  <Icon name="plus" size={15} />
                </Button>
              </div>
            </div>
            <Button className="search-button" onClick={handleSearch}>
              <Icon name="search" /> Tìm phòng trống
            </Button>
          </div>
        </div>
      </section>

      <section className="section rooms-section" id="rooms">
        <div className="container">
          {searchMessage && (
            <div className="search-status" role="status">
              <span><Icon name="check" size={16} /></span>
              {searchMessage}
              <Button
                aria-label="Đóng thông báo"
                onClick={() => setSearchMessage("")}
                tone="icon"
              >
                <Icon name="close" size={16} />
              </Button>
            </div>
          )}

          <div className="section-header">
            <div>
              <div className="eyebrow"><span /> Hạng phòng nổi bật</div>
              <h2>Không gian nghỉ dưỡng<br /><em>thượng hạng</em></h2>
            </div>
            <p>
              Mỗi căn phòng là một không gian riêng tư, nơi từng chi tiết được
              hoàn thiện để mang đến cảm giác thư thái trọn vẹn.
            </p>
          </div>

          <div className="filters" aria-label="Lọc hạng phòng">
            {["Tất cả", "Deluxe", "Suite", "Presidential"].map((type) => (
              <Button
                className={roomType === type ? "is-selected" : ""}
                key={type}
                onClick={() => setRoomType(type)}
                tone="light"
              >
                {type}
              </Button>
            ))}
          </div>

          <div className="room-grid">
            {visibleRooms.map((room) => (
              <article className="room-card" key={room.id}>
                <div className="room-media">
                  <img src={room.image} alt={`Phòng ${room.name}`} />
                  <span className="room-label">{room.label}</span>
                  <Button
                    aria-label={favorites.includes(room.id) ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                    className={favorites.includes(room.id) ? "is-favorite" : ""}
                    onClick={() => toggleFavorite(room.id)}
                    tone="icon"
                  >
                    <Icon name="heart" filled={favorites.includes(room.id)} />
                  </Button>
                </div>
                <div className="room-body">
                  <div className="room-title-row">
                    <div>
                      <span className="room-type">{room.type}</span>
                      <h3>{room.name}</h3>
                    </div>
                    <div className="rating"><Icon name="star" size={13} filled /> 4.9</div>
                  </div>
                  <p className="room-meta">{room.meta}</p>
                  <p className="room-description">{room.description}</p>
                  <div className="room-footer">
                    <div className="price">
                      <small>Chỉ từ</small>
                      <strong>{formatPrice(room.price)}</strong>
                      <span>/ đêm</span>
                    </div>
                    <Button onClick={() => openBooking(room)} tone="navy">
                      Chọn phòng <Icon name="arrow" size={16} />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section experience-section" id="experience">
        <div className="container experience-layout">
          <div className="experience-copy">
            <div className="eyebrow light"><span /> Trải nghiệm tinh tuyển</div>
            <h2>Hơn cả một<br />kỳ nghỉ.</h2>
            <p>
              Chạm đến sự cân bằng trong từng khoảnh khắc — từ làn nước xanh
              trên tầng cao đến liệu trình trị liệu được cá nhân hóa.
            </p>
            <a className="text-link text-link--gold" href="#story">
              Khám phá tiện ích <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className="experience-grid">
            {experiences.map((item, index) => (
              <article className={`experience-card card-${index + 1}`} key={item.title}>
                <img src={item.image} alt={item.title} />
                <div className="experience-gradient" />
                <div>
                  <small>0{index + 1}</small>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="container story-grid">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1776761603930-e4509e386fbf?auto=format&fit=crop&w=1200&q=86"
              alt="Bàn tiệc riêng tư nhìn ra đại dương"
            />
            <div className="seal"><span>U</span><small>Since 2008</small></div>
          </div>
          <div className="story-copy">
            <div className="eyebrow"><span /> Câu chuyện UNETI Grand</div>
            <h2>Lòng hiếu khách,<br /><em>được nâng tầm.</em></h2>
            <p className="lead">
              “Chúng tôi tin rằng sự sang trọng đích thực không nằm ở những gì
              hào nhoáng, mà ở cảm giác được thấu hiểu.”
            </p>
            <p>
              Từ lời chào đầu tiên đến từng chi tiết nhỏ trong căn phòng, đội
              ngũ của chúng tôi luôn hiện diện để biến kỳ nghỉ của bạn thành một
              ký ức đáng trân trọng.
            </p>
            <div className="stats">
              <div><strong>18+</strong><span>Năm kiến tạo<br />trải nghiệm</span></div>
              <div><strong>4.9</strong><span>Điểm đánh giá<br />trung bình</span></div>
              <div><strong>24/7</strong><span>Dịch vụ<br />tận tâm</span></div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-main">
          <div>
            <a className="brand brand--footer" href="#top">
              <span className="brand-mark">U</span>
              <span><strong>UNETI GRAND</strong><small>HOTEL & SPA</small></span>
            </a>
            <p>Nơi vẻ đẹp tinh tuyển gặp gỡ<br />lòng hiếu khách chân thành.</p>
          </div>
          <div className="footer-links">
            <div><strong>Khám phá</strong><a href="#rooms">Hạng phòng</a><a href="#experience">Ẩm thực & Spa</a><a href="#story">Về chúng tôi</a></div>
            <div><strong>Hỗ trợ</strong><a href="#booking">Đặt phòng</a><a href="#top">Liên hệ</a><a href="#top">Chính sách</a></div>
            <div><strong>Liên hệ</strong><span>353 Trần Hưng Đạo, Hà Nội</span><span>+84 24 5555 8888</span><span>hello@unetigrand.vn</span></div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 UNETI Grand Hotel & Spa</span>
          <span>Được tạo nên với sự tận tâm.</span>
        </div>
      </footer>

      {selectedRoom && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedRoom(null)}>
          <div
            aria-labelledby="booking-title"
            aria-modal="true"
            className="modal"
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
          >
            <Button
              aria-label="Đóng"
              className="modal-close"
              onClick={() => setSelectedRoom(null)}
              tone="icon"
            >
              <Icon name="close" />
            </Button>
            {bookingDone ? (
              <div className="success-state">
                <span><Icon name="check" size={28} /></span>
                <div className="eyebrow"><span /> Yêu cầu đã được ghi nhận</div>
                <h2 id="booking-title">Cảm ơn bạn.</h2>
                <p>
                  Chuyên viên của UNETI Grand sẽ liên hệ để xác nhận phòng trong
                  ít phút tới.
                </p>
                <Button onClick={() => setSelectedRoom(null)} tone="gold">Hoàn tất</Button>
              </div>
            ) : (
              <>
                <img src={selectedRoom.image} alt={selectedRoom.name} />
                <div className="modal-content">
                  <div className="eyebrow"><span /> Yêu cầu đặt phòng</div>
                  <h2 id="booking-title">{selectedRoom.name}</h2>
                  <p>{selectedRoom.meta}</p>
                  <div className="modal-summary">
                    <span>10/06/2026 — 12/06/2026</span>
                    <strong>{formatPrice(selectedRoom.price * 2)}</strong>
                  </div>
                  <label className="modal-field">
                    <span>Họ và tên</span>
                    <input type="text" placeholder="Nguyễn Văn An" />
                  </label>
                  <label className="modal-field">
                    <span>Số điện thoại</span>
                    <input type="tel" placeholder="09xx xxx xxx" />
                  </label>
                  <Button className="modal-submit" onClick={() => setBookingDone(true)} tone="gold">
                    Gửi yêu cầu xác nhận <Icon name="arrow" />
                  </Button>
                  <small className="modal-note">Chưa cần thanh toán ở bước này.</small>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
