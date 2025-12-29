import { useEffect, useState } from "react";
import RaidRoster from "../components/RaidRoster";
import AddRaider from "../components/AddRaider";
import { getRoster } from "../utils/api/roster";
import ProtectedRoute from "../components/ProtectedRoute";

export default function CurrentGuildRoster() {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    fetchRoster();
  }, []);

  const fetchRoster = async () => {
    setLoading(true);
    try {
      const data = await getRoster();
      setRoster(data);
    } catch (error) {
      console.error('Error Fetching Roster:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-screen bg-black">
          <div className="relative">
            {/* Spinning loader */}
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="mt-4 text-xs text-blue-400/60 font-mono uppercase tracking-widest text-center">
              Loading Roster
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen pt-10 pb-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              Roster Management
            </h1>
            <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full shadow-[0_0_15px_#3b82f6] mb-3" />
            <p className="text-blue-300/50 font-mono text-xs tracking-[0.5em] uppercase">
              Guild Unit Database
            </p>
          </div>

          {/* Add Raider Button */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-full mb-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 uppercase tracking-[0.2em] transition-all text-sm border-2 border-blue-400/30"
            style={{ clipPath: "polygon(2% 0, 100% 0, 100% 80%, 98% 100%, 0 100%, 0 20%)" }}
          >
            + Register New Unit
          </button>

          {/* Add Raider Modal */}
          {addModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
              onClick={() => setAddModalOpen(false)}
            >
              <div
                className="w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <AddRaider
                  onAdd={(newRaider) => {
                    setRoster(prev => {
                      if (prev.some(r => r.id === newRaider.id)) return prev;
                      return [newRaider, ...prev];
                    });
                    setAddModalOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mb-8" />

          {/* Roster list & details */}
          <RaidRoster
            roster={roster}
            onDelete={(id) => setRoster(prev => prev.filter(r => r.id !== id))}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
