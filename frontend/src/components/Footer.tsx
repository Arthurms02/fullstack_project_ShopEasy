import { Store, Mail, Phone, Camera, ReceiptSwissFranc , MessageCircle } from "lucide-react";
import { Link } from "react-router";


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">
                Mercado<span className="text-orange-500">Livre</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              O melhor marketplace para comprar e vender produtos com segurança e facilidade.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-orange-400 transition-colors">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                <ReceiptSwissFranc className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-orange-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Início</Link></li>
              <li><Link to="/produtos" className="hover:text-orange-400 transition-colors">Produtos</Link></li>
              <li><Link to="/vender" className="hover:text-orange-400 transition-colors">Anunciar</Link></li>
              <li><Link to="/carrinho" className="hover:text-orange-400 transition-colors">Carrinho</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-medium mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/produtos?cat=Celulares" className="hover:text-orange-400 transition-colors">Celulares</Link></li>
              <li><Link to="/produtos?cat=Notebooks" className="hover:text-orange-400 transition-colors">Notebooks</Link></li>
              <li><Link to="/produtos?cat=Computadores" className="hover:text-orange-400 transition-colors">Computadores</Link></li>
              <li><Link to="/produtos?cat=Teclados" className="hover:text-orange-400 transition-colors">Teclados</Link></li>
              <li><Link to="/produtos?cat=Mouses" className="hover:text-orange-400 transition-colors">Mouses</Link></li>
              <li><Link to="/produtos?cat=Monitores" className="hover:text-orange-400 transition-colors">Monitores</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span>suporte@mercadolivre.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span>(11) 4000-0000</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Horário de atendimento</p>
              <p className="text-sm text-gray-300">Seg–Sex, 9h às 18h</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p>© 2026 MercadoLivre. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}