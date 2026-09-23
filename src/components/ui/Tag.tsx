import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Tag({ children, className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-sm border border-line px-3 py-1',
        'font-mono text-xs text-text-secondary transition-colors duration-normal',
        'hover:border-line-strong hover:text-text-primary',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
