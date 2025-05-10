import styles from './Header.module.css';
import Icon from '../ui/Icon/Icon';

const Header = () => (
  <header className={styles.redHeader}>
    <div className={styles.headerTop}>
      <div className={styles.categorySearch}>
        <div className={styles.categoryDropdown}>
          <span className={styles.categoryText}>Danh mục</span>
          <Icon name="chevron-down" className={styles.dropdownIcon} />
        </div>
        <div className={styles.searchContainer}>
          <span className={styles.searchText}>Tìm kiếm</span>
          <Icon name="search" className={styles.searchIcon} />
        </div>
      </div>
      
      <div className={styles.headerActions}>
        {/* Các action items */}
        <div className={styles.loginSection}>
          <button className={styles.loginButton}>
            <Icon name="person-outline" />
            <span>Đăng nhập</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;