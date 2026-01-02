
import React, { useState, useEffect } from 'react';
import { getInode } from '../../services/fs';

type Lang = 'en' | 'es' | 'fr';

interface InstructionManualProps {
  initialPath?: string;
}

const InstructionManual: React.FC<InstructionManualProps> = ({ initialPath }) => {
  const [lang, setLang] = useState<Lang>('en');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLang = async () => {
      if (initialPath) {
        const inode = await getInode(initialPath);
        if (inode && inode.content) {
          try {
            const data = JSON.parse(inode.content);
            if (data.preferredLang) setLang(data.preferredLang as Lang);
          } catch (e) { console.error("Metadata Corrupted"); }
        }
      }
      setLoading(false);
    };
    loadLang();
  }, [initialPath]);

  const ui = {
    en: { title: "SOVEREIGN OPERATIONS MANUAL", search: "Search binaries...", cat: "Category" },
    es: { title: "MANUAL DE OPERACIONES SOBERANAS", search: "Buscar binarios...", cat: "Categoría" },
    fr: { title: "MANUEL D'OPÉRATIONS SOUVERAINES", search: "Rechercher...", cat: "Catégorie" }
  };

  const commandDb = [
    { 
      name: "nmap", 
      cat: "Network",
      desc: {
        en: "Industry standard for network discovery and security auditing.",
        es: "Estándar de la industria para descubrimiento de redes y auditoría.",
        fr: "Standard de l'industrie pour la découverte de réseaux et l'audit."
      }
    },
    { 
      name: "sqlmap", 
      cat: "Web",
      desc: {
        en: "Automatic SQL injection and database takeover tool.",
        es: "Herramienta de inyección SQL automática y toma de bases de datos.",
        fr: "Outil d'injection SQL automatique et prise de contrôle de BD."
      }
    },
    { 
      name: "metasploit", 
      cat: "Exploit",
      desc: {
        en: "Advanced platform for developing and executing exploit code.",
        es: "Plataforma avanzada para desarrollar y ejecutar código de exploit.",
        fr: "Plateforme avancée pour développer et exécuter du code d'exploit."
      }
    },
    { 
      name: "aircrack-ng", 
      cat: "Wireless",
      desc: {
        en: "Suite of tools to assess WiFi network security.",
        es: "Suite de herramientas para evaluar la seguridad de redes WiFi.",
        fr: "Suite d'outils pour évaluer la sécurité des réseaux WiFi."
      }
    },
    { 
      name: "bettercap", 
      cat: "Sniffing",
      desc: {
        en: "The Swiss Army knife for WiFi, Bluetooth Low Energy, and Ethernet networks.",
        es: "La navaja suiza para redes WiFi, Bluetooth LE y Ethernet.",
        fr: "Le couteau suisse pour les réseaux WiFi, Bluetooth LE et Ethernet."
      }
    },
    { 
      name: "hashcat", 
      cat: "Cracking",
      desc: {
        en: "The world's fastest and most advanced password recovery utility.",
        es: "La utilidad de recuperación de contraseñas más rápida del mundo.",
        fr: "L'utilitaire de récupération de mot de passe le plus rapide au monde."
      }
    }
  ];

  const filtered = commandDb.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.desc[lang].toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-10 text-indigo-500 font-mono animate-pulse uppercase text-[10px]">Loading localized manual...</div>;

  return (
    <div className="h-full bg-black text-white font-mono p-10 overflow-y-auto custom-scroll">
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-10 gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-indigo-500 uppercase tracking-widest">{ui[lang].title}</h1>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.6em] italic">VertilOS L0-Protocol | National Edition</p>
          </div>
          <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
            {(['en', 'es', 'fr'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${lang === l ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/20 hover:bg-white/5'}`}>{l}</button>
            ))}
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group">
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={ui[lang].search}
            className="w-full bg-white/5 border border-white/10 p-5 rounded-[2.5rem] outline-none text-indigo-400 font-bold focus:border-indigo-500 transition-all text-xs pl-14"
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-lg opacity-40">🔍</span>
        </div>

        {/* GRID OF COMMANDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((cmd, i) => (
            <div key={i} className="glass p-6 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all group animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[11px] font-black text-white tracking-widest uppercase">{cmd.name}</span>
                <span className="text-[7px] bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full font-black uppercase italic">{cmd.cat}</span>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed font-medium italic lowercase tracking-tight group-hover:text-white/80 transition-colors">
                {cmd.desc[lang]}
              </p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 opacity-20 italic uppercase tracking-widest text-xs">No binaries found in localized table</div>
        )}

        <div className="pt-20 text-center opacity-10">
          <div className="text-6xl mb-4">🛡️</div>
          <div className="text-[8px] uppercase tracking-[1em] font-black">Sovereign Data Integrity Verified</div>
        </div>
      </div>
    </div>
  );
};

export default InstructionManual;
