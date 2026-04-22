import { Link } from "react-router-dom";
import { CONTACT_EMAIL, WHATSAPP_NUMBER_DISPLAY } from "../config/contact";

const Footer = () => {
  return (
    <footer className="border-t border-deep-100 bg-deep-50/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-ink-700">Temporada Azul</p>
          <p className="mt-2 text-sm text-ink-600">
            Experiências marítimas premium em Vitória, Espírito Santo.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-deep-600">Serviços</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            <li>
              <Link to="/avista-baleias" className="hover:text-deep-700">
                Avistamento de Baleias
              </Link>
            </li>
            <li>
              <Link to="/pescarias" className="hover:text-deep-700">
                Pescarias
              </Link>
            </li>
            <li>
              <Link to="/praias" className="hover:text-deep-700">
                Tour pelas Praias/Churrasco
              </Link>
            </li>
            <li>
              <Link to="/churrasco-a-bordo" className="hover:text-deep-700">
                Festas/Eventos a Bordo
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-deep-600">Contato</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            <li>Vitória, ES</li>
            <li>WhatsApp: {WHATSAPP_NUMBER_DISPLAY}</li>
            <li>{CONTACT_EMAIL}</li>
            <li>@temporadaazul</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-deep-100 py-6 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} Temporada Azul. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
