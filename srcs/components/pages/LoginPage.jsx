import { motion } from "framer-motion";
import LoginForm from "@/components/features/auth/LoginForm";

function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    >
      <LoginForm />
    </motion.div>
  );
}

export default LoginPage;
