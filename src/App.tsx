import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4">
        <div className="flex gap-8">
          <a href="#" className="text-[#FF0000]">LISTEN</a>
          <a href="#" className="text-[#FF0000]">WATCH 'TERMITES'</a>
          <a href="#" className="text-[#FF0000]">SHOWS</a>
          <a href="#" className="text-[#FF0000]">SHOP</a>
          <a href="#" className="text-[#FF0000]">INFO</a>
        </div>
        <div>
          <span className="text-[#FF0000]">VOID: <span className="text-white">ON</span> OFF</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative h-[80vh] flex flex-col items-center justify-center">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl text-[#4A7F3F] mb-12"
        >
          Mercy Land
        </motion.h1>

        {/* Email Signup */}
        <div className="flex gap-2 items-center">
          <span className="text-[#4A7F3F]">KEEP UP:</span>
          <input
            type="email"
            className="bg-[#4A7F3F] text-white px-4 py-2 outline-none"
            placeholder="YOUR EMAIL"
          />
          <button className="bg-[#4A7F3F] text-white px-4 py-2">
            SUBMIT
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
