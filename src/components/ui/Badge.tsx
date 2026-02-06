interface BadgeProps {
  children: React.ReactNode;
  variant?: 'profit' | 'loss' | 'neutral';
  className?: string;
}

const variants = {
  profit: 'bg-white text-gray-900 border-gray-900',
  loss: 'bg-white text-gray-900 border-gray-400',
  neutral: 'bg-white text-gray-700 border-gray-300',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
