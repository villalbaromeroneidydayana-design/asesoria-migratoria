export default function QuickExit() {
  const handleExit = () => {
    window.location.replace("https://www.google.com");
  };

  return (
    <button
      onClick={handleExit}
      className="fixed bottom-4 right-4 z-50 bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-full shadow-xl hover:shadow-red-500/20 transition-all flex items-center gap-2 backdrop-blur-sm border border-red-500"
      title="Salir rápidamente de esta página"
    >
      🔒 Salida Rápida
    </button>
  );
}
