import { motion } from 'framer-motion';

const AnimatedButton = ({
  children,
  delay = 0,
  className = '',
  whileHover = { scale: 1.02 },
  whileTap = { scale: 0.95 },
  ...rest
}) => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={whileHover}
      whileTap={whileTap}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
