import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Tag({ children, className, ...props }: TagProps) {
  return (
    <span
      data-cursor="hover"
      className={cn(
        'inline-block rounded-full border border-accent/40 px-3 py-1 text-xs',
        'text-text-secondary transition-colors duration-normal hover:border-accent hover:text-accent',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
