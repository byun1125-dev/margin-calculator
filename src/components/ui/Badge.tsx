interface BadgeProps {
  children: React.ReactNode;
  variant?: 'profit' | 'loss' | 'neutral';
  className?: string;
}

const variants = {
  profit: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  loss: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-gray-50 text-gray-700 border-gray-200',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
