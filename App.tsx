
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { ViewType, RSSItem } from './types';
import { personalizeContent, personalizeImage } from './services/geminiService';

const MOCK_RSS: RSSItem[] = [
  {
    id: '1',
    title: 'La IA Generativa redefine el Arte Moderno',
    summary: 'Los nuevos modelos de difusión están permitiendo a los artistas explorar fronteras nunca antes vistas en la creación digital.',
    platform: 'news',
    timestamp: 'Hoy, 14:05 PM',
    author: 'Art Daily',
    imageUrl: 'https://picsum.photos/seed/ai-art/800/450'
  },
  {
    id: '2',
    title: 'Gadgets que cambiarán tu 2024',
    summary: 'Desde anillos inteligentes hasta gafas de realidad mixta, esta es la lista definitiva de tecnología que debes conocer.',
    platform: 'rss',
    timestamp: 'Hoy, 11:20 AM',
    author: 'Tech Cruncher',
    imageUrl: 'https://picsum.photos/seed/gadget/800/450'
  },
  {
    id: '3',
    title: 'Recetas Minimalistas para el Trabajo',
    summary: 'Cómo preparar platos saludables en menos de 10 minutos para mantener tu energía durante el día.',
    platform: 'news',
    timestamp: 'Hoy, 09:45 AM',
    author: 'Chef Mode',
    imageUrl: 'https://picsum.photos/seed/food/800/450'
  }
];

const App: React.FC = () => {
  const [isExtracted, setIsExtracted] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.FEEDS);
  const [items, setItems] = useState<RSSItem[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleExtract = () => {
    setIsExtracting(true);
    // Simulate API delay for RSS extraction
    setTimeout(() => {
      setItems(MOCK_RSS);
      setIsExtracted(true);
      setIsExtracting(false);
    }, 1500);
  };

  const handleUpdateContext = (id: string, context: string) => {
    setItems(items.map(item => item.id === id ? { ...item, userContext: context } : item));
  };

  const handlePersonalize = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    setProcessingId(id);
    try {
      const newText = await personalizeContent(item.title, item.summary, item.userContext || '');
      const newImage = await personalizeImage(item.imageUrl, newText);
      
      setItems(items.map(i => i.id === id ? { 
        ...i, 
        aiVersion: { text: newText, imageUrl: newImage } 
      } : i));
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSave = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, isSaved: !i.isSaved } : i));
  };

  const filteredItems = items.filter(i => currentView === ViewType.FEEDS ? true : i.isSaved);

  if (!isExtracted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black overflow-hidden p-6">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-10 gap-4">
             {Array.from({length: 50}).map((_, i) => (
               <div key={i} className="h-20 bg-primary rounded-none rotate-45 transform"></div>
             ))}
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-xl">
          <div className="w-24 h-24 bg-primary rounded-none flex items-center justify-center rotate-12 splat-shadow mb-4">
            <span className="material-symbols-outlined text-black text-6xl font-black -rotate-12">rss_feed</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">
            EXTRAE EL <span className="text-primary">FUEGO</span>
          </h1>
          <p className="text-white/60 font-medium text-lg lg:text-xl">
            Tu hub de contenido RSS listo para ser transformado por el poder de la IA y Nano Banana.
          </p>
          
          <button
            onClick={handleExtract}
            disabled={isExtracting}
            className="group relative mt-4"
          >
            <div className="absolute inset-0 bg-white translate-x-2 translate-y-2 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
            <div className={`relative px-12 py-6 border-4 border-white font-black text-2xl uppercase italic tracking-widest transition-all ${isExtracting ? 'bg-primary/50 cursor-wait' : 'bg-primary text-black group-hover:-translate-x-2 group-hover:-translate-y-2'}`}>
              {isExtracting ? 'Extrayendo...' : 'Extraer Publicaciones'}
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto bg-black p-6 lg:p-10">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <header className="flex flex-col gap-2 border-l-8 border-primary pl-6">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              {currentView === ViewType.FEEDS ? 'EL FEED DE HOY' : 'TUS TESOROS'}
            </h1>
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs">Contenido fresco procesado con Splat AI</p>
          </header>

          <section className="flex flex-col gap-12 pb-20">
            {filteredItems.length === 0 ? (
               <div className="text-center py-20 border-4 border-dashed border-white/10 opacity-30">
                 <p className="text-xl font-black uppercase italic">No hay nada por aquí...</p>
               </div>
            ) : filteredItems.map((item) => (
              <div key={item.id} className="bg-[#050505] border-2 border-white/5 rounded-none overflow-hidden hover:border-primary/20 transition-all group splat-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left: Input */}
                  <div className="p-8 border-r border-white/5 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase italic">{item.author}</span>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.timestamp}</span>
                    </div>
                    
                    <h2 className="text-2xl font-black italic uppercase leading-tight group-hover:text-primary transition-colors">{item.title}</h2>
                    <p className="text-white/50 text-sm leading-relaxed">{item.summary}</p>
                    
                    <div className="mt-4 flex flex-col gap-3">
                      <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Añadir Contexto o Instrucciones</label>
                      <textarea
                        className="w-full h-32 bg-black border-2 border-white/10 p-4 text-sm focus:border-primary focus:ring-0 transition-all font-medium placeholder:text-white/20"
                        placeholder="Ej: Hazlo para TikTok, usa un tono agresivo y emocionante..."
                        value={item.userContext || ''}
                        onChange={(e) => handleUpdateContext(item.id, e.target.value)}
                      />
                    </div>

                    <button
                      onClick={() => handlePersonalize(item.id)}
                      disabled={processingId === item.id}
                      className={`w-full py-4 border-4 transition-all font-black text-lg uppercase italic flex items-center justify-center gap-3 ${
                        processingId === item.id 
                          ? 'bg-white/10 border-white/10 cursor-not-allowed' 
                          : 'bg-primary border-primary text-black hover:bg-white hover:border-white shadow-[8px_8px_0px_0px_white] active:shadow-none active:translate-x-2 active:translate-y-2'
                      }`}
                    >
                      {processingId === item.id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          <span>Transformando...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined font-black">bolt</span>
                          <span>Personalizar Splat</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right: AI Output */}
                  <div className="p-8 bg-primary/5 flex flex-col gap-6">
                    {item.aiVersion ? (
                      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full">
                        <div className="relative aspect-video border-4 border-primary splat-shadow overflow-hidden">
                          <img src={item.aiVersion.imageUrl} className="w-full h-full object-cover grayscale-0 hover:scale-110 transition-transform duration-700" alt="AI Splat" />
                          <div className="absolute bottom-4 left-4 bg-black text-primary px-3 py-1 text-[10px] font-black uppercase italic border-2 border-primary">
                            Nano Banana Vision
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 relative">
                          <div className="absolute -top-3 -left-3 w-6 h-6 bg-black"></div>
                          <p className="text-black text-sm font-bold italic leading-relaxed whitespace-pre-wrap">{item.aiVersion.text}</p>
                          <button 
                            className="absolute bottom-2 right-2 text-black/20 hover:text-black transition-colors"
                            onClick={() => navigator.clipboard.writeText(item.aiVersion?.text || '')}
                          >
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                          </button>
                        </div>

                        <div className="mt-auto flex gap-4">
                          <button 
                            onClick={() => handleSave(item.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 border-4 font-black uppercase italic transition-all ${
                              item.isSaved 
                                ? 'bg-black border-black text-primary' 
                                : 'bg-transparent border-white/20 text-white hover:border-primary'
                            }`}
                          >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: item.isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                              {item.isSaved ? 'check_circle' : 'bookmark'}
                            </span>
                            {item.isSaved ? 'Guardado' : 'Guardar'}
                          </button>
                          <button className="flex-1 bg-white text-black border-4 border-white py-4 font-black uppercase italic flex items-center justify-center gap-2 hover:bg-primary hover:border-primary transition-all active:scale-95">
                            <span className="material-symbols-outlined">rocket_launch</span>
                            Publicar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-white/5 opacity-20">
                        <span className="material-symbols-outlined text-8xl mb-4 font-thin italic">auto_fix_high</span>
                        <p className="text-xl font-black uppercase italic">Listo para el Splat</p>
                        <p className="text-xs font-medium uppercase mt-2">Personaliza para generar el post</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
