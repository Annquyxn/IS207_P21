import { motion } from "framer-motion";

function SocialLogin() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-[400px] space-y-4"
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full flex items-center justify-center gap-3 py-3 px-5 border rounded-xl bg-white hover:bg-gray-100 transition duration-200"
      >
        <img src="/google-icon.svg" className="w-7 h-7" alt="Google" />
        <span className="text-lg font-semibold text-gray-800">
          Đăng ký bằng Google
        </span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200"
      >
        <img src="/facebook-icon.svg" className="w-7 h-7" alt="Facebook" />
        <span className="text-lg font-semibold">Đăng ký bằng Facebook</span>
      </motion.button>
    </motion.div>
  );
}

export default SocialLogin;
