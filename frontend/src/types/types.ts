

export type HeaderProps = {
    onSearch: (query: string) => void;
    isVendedor?: boolean;
    user?: {
        name: string;
        email: string;
        avatar: string;
    } | null;
};

export type LoadingProps = { text?: string; fullScreen?: boolean };


