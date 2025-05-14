function Breadcrumb() {
  return (
    <nav className="breadcrumb">
      <a href="/" className="breadcrumb-link">
        Trang chủ
      </a>
      <span className="breadcrumb-separator">/</span>
      <span className="breadcrumb-current">Build PC</span>
    </nav>
  );
}

export default Breadcrumb;
