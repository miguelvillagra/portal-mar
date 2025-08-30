export function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 ${className}`}>
      {title && <div className="text-sm font-medium text-gray-600 mb-2">{title}</div>}
      {children}
    </div>
  );
}
