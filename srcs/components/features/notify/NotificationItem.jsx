import IconSvg from "@/components/features/notify/IconSvg";

export default function NotificationItem({ title, description, icon, color }) {
  return (
    <article className="flex gap-4 mb-6 last:mb-0 hover:scale-[1.01] transition-transform">
      <IconSvg className={color}>{icon}</IconSvg>
      <div className="flex-1">
        <h2 className="text-base font-semibold font-sans mb-1 text-gray-800">
          {title}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </article>
  );
}
