
import React, { useState, useEffect } from 'react';
import { saveFile, getInode } from '../../services/fs';

interface TextEditorProps {
  initialPath?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialPath }) => {
  const [content, setContent] = useState('');
  const [path, setPath] = useState('/user/config.vpx');
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (initialPath) {
      loadFileData(initialPath);
    }
  }, [initialPath]);

  const loadFileData = async (filePath: string) => {
    const inode = await getInode(filePath);
    if (inode && inode.content) {
      setPath(inode.path);
      // Si el contenido es Data URL (base64 de importación), intentamos decodificarlo si es texto
      if (inode.content.startsWith('data:text/plain;base64,')) {
        setContent(atob(inode.content.split(',')[1]));
      } else if (inode.content.startsWith('data:')) {
        setContent("[ARCHIVO BINARIO - SOLO LECTURA]");
      } else {
        setContent(inode.content);
      }
    }
  };

  const calculateHash = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSave = async () => {
    setWorking(true);
    try {
      const hash = await calculateHash(content);
      const sum = hash.split('').reduce((a, b) => a + parseInt(b, 16), 0);
      
      if (sum % 2 !== 0) {
        alert(`CRITICAL INTEGRITY ERROR\nHash: ${hash.substring(0, 16)}...\nValidation sum ${sum} is ODD. System protection triggered.`);
        window.location.reload(); 
        return;
      }

      await saveFile(path, content, 'com.vertil.user');
      alert("SUCCESS: File committed with verified checksum.");
    } catch (e) {
      console.error(e);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-mono p-4">
      <div className="flex items-center gap-2 mb-3 bg-white/5 p-2 rounded-lg border border-white/10">
        <div className="text-green-500 text-[8px] px-2 py-1 bg-green-500/10 rounded border border-green-500/30 font-black tracking-widest uppercase">EFI_SECURE</div>
        <input 
          value={path}
          onChange={e => setPath(e.target.value)}
          className="bg-transparent border-none outline-none text-white/70 text-[10px] flex-grow font-bold"
        />
        <button 
          onClick={handleSave}
          disabled={working}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded text-[8px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
        >
          {working ? 'hashing...' : 'save .vpx'}
        </button>
      </div>
      <textarea 
        value={content}
        onChange={e => setContent(e.target.value)}
        className="flex-grow bg-black/60 p-4 rounded-lg border border-white/5 text-emerald-400 outline-none resize-none text-[11px] leading-relaxed font-bold custom-scroll"
        placeholder="Raw instructions or system data..."
      />
    </div>
  );
};

export default TextEditor;
