import HeaderHome from "./_components/HeaderHome";
import MainPage from "./_components/MainPage";
import CardProduct from "./_components/CardProduct";


export default function HomePage() {
  return (
    <div>
      <HeaderHome />
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
      <MainPage />
      <CardProduct />
    </div>
  );
}