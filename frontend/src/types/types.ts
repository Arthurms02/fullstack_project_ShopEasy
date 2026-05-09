

export type NavBarProps = {
    isVendedor?: boolean;
    user?: {
        name: string;
        email: string;
        avatar: string;
    } | null;
};

export type LoadingProps = { text?: string; fullScreen?: boolean };


