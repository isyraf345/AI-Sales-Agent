import { useState } from 'react';
import { ChatProvider } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import UserInfoPanel from './components/UserInfoPanel';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);

  return (
    <ChatProvider>
      <div className="h-screen flex overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Chat Area */}
        <ChatArea 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onInfoClick={() => setInfoPanelOpen(!infoPanelOpen)}
        />

        {/* User Info Panel */}
        <UserInfoPanel 
          isOpen={infoPanelOpen}
          onClose={() => setInfoPanelOpen(false)}
        />

        {/* Mobile Overlay */}
        {(sidebarOpen || infoPanelOpen) && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => {
              setSidebarOpen(false);
              setInfoPanelOpen(false);
            }}
          />
        )}
      </div>
    </ChatProvider>
  );
}

export default App;