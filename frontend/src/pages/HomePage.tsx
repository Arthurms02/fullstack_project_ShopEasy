import Header  from "../components/Header";
import Cart from "../features/cart/Cart";
import SellProduct from "../features/product/SellProduct";


export default function HomePage() {

    const onSearch = (query: string) => {
        console.log("Search query:", query);
    };

    return (
        <>
        <Header onSearch={onSearch} />
            <div className="home-page">
                <h1>Welcome to the Home Page</h1>
                <p>This is a protected page. You must be logged in to see this content.</p>
                <Cart />
            </div>
            <SellProduct />
        </>
    );
}