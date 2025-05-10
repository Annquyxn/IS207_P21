import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon,
  ...props 
}) => (
  <button 
    className={`${styles.button} ${styles[variant]} ${styles[size]}`}
    {...props}
  >
    {icon && <span className={styles.icon}>{icon}</span>}
    {children}
  </button>
);

export default Button;