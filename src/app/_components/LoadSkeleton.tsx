import { Skeleton } from '@mui/material';

interface LoadingProps {
    loading: boolean;
    children: React.ReactNode;
}
export const LoadSkeleton = ({ children, loading }: LoadingProps) => {
    return loading ? <Skeleton>{children}</Skeleton> : children;
};
