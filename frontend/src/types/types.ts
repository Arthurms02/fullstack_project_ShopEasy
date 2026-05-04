export type HeaderProps = {
    onSearch: (query: string) => void;
    isVendedor?: boolean;
    user?: {
        name: string;
        email: string;
        avatar: string;
    } | null;
};

export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
};