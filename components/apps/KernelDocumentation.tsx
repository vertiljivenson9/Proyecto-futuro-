
import React from 'react';

const KernelDocumentation: React.FC = () => {
  const README_CONTENT = `# VERTILOS SOVEREIGN OS - DOCUMENTACIÓN TÉCNICA
© 2025 Vertil Jivenson - Segunda Oportunidad para el Mundo

## 1. ARQUITECTURA DEL NÚCLEO
VertilOS opera sobre un Kernel híbrido que gestiona un Sistema de Archivos Virtual (VFS) persistente basado en IndexedDB.
- **DNA Integrity**: El sistema conoce sus 39 archivos base y puede replicarse a sí mismo.
- **Sovereign Registry**: Gestión de identidad y hardware virtual.

## 2. MANUAL DE LA TERMINAL (POWERSHELL)
La terminal de VertilOS no es un simulacro; ejecuta comandos lógicos sobre el VFS:
- \`ls\`: Lista inodos en el directorio actual.
- \`cd <dir>\`: Navega por la estructura de carpetas.
- \`apt install <pkg>\`: Instala binarios virtuales en /bin.
- \`nano <file>\`: Abre el editor de bajo nivel para modificar archivos.
- \`curl <url>\`: Realiza peticiones de red reales (vía proxy soberano).
- \`git clone <repo>\`: Descarga repositorios de GitHub al VFS.
- \`clear\`: Limpia el búfer de la terminal.

## 3. APLICACIONES DEL SISTEMA
- **CloneSys**: Replicador atómico de los 39 archivos hacia GitHub.
- **GerthaStore**: Tienda de aplicaciones Mesh para expandir el sistema.
- **IDE Studio**: Entorno de desarrollo para crear archivos .vpx nativos.
- **Tor Browser**: Gateway de privacidad para navegación profunda.
- **Vault**: Bóveda con cifrado AES-256 para llaves privadas.

## 4. SEGURIDAD SOBERANA
El acceso está protegido por el protocolo VertiLock-V1. Los archivos .vtl contienen la firma digital necesaria para desbloquear el Kernel sin necesidad de servidores externos.
`;

  const downloadReadme = () => {
    const blob = new Blob([README_CONTENT], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VertilOS_Sovereign_Manifesto.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] font-mono p-8 overflow-hidden">
      <div className="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-[3rem] mb-8">
        <div className="flex items-center gap-6">
          <div className="text-5xl">📖</div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Sovereign Documentation</h2>
            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.4em] mt-1">Manual de Operaciones Nivel 0</p>
          </div>
        </div>
      </div>

      <div className="flex-grow bg-black/40 border border-white/5 rounded-[2.5rem] p-8 overflow-y-auto custom-scroll text-indigo-100/70 text-[11px] leading-relaxed mb-8">
        <pre className="whitespace-pre-wrap font-mono">
          {README_CONTENT}
        </pre>
      </div>

      <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center gap-4">
        <p className="text-[8px] text-white/20 uppercase font-black tracking-[0.2em] text-center">
          Descarga este manifiesto para leerlo fuera de línea en tu dispositivo físico.
          No requiere descifrado.
        </p>
        <button 
          onClick={downloadReadme}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span>📥</span> DESCARGAR MANIFIESTO TÉCNICO (.MD)
        </button>
      </div>
    </div>
  );
};

export default KernelDocumentation;
