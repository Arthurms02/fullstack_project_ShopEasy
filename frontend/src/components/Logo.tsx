import { Link } from "react-router-dom";
import { Store } from "lucide-react";

export default function Logo() {
  return (
      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-900 font-semibold text-lg hidden sm:block">
              Mercado<span className="text-orange-500">Livre</span>
          </span>
      </Link>
  );
}