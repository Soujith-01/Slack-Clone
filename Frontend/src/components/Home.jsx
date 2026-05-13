import React, { useRef } from 'react'
import { useNavigate } from 'react-router'

function Home() {
  const navigate = useNavigate()
  const featuresRef = useRef(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-[#050505] text-white font-sans">

      {/* Hero Section */}
      <div className="px-4 py-24 bg-[#050505] border-b border-[#111111]">
        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            {/* Main Heading */}
            <div className="text-5xl sm:text-7xl font-black tracking-tight leading-none uppercase">
              Real-Time
              <br />
              <span className="text-[#11A8E8]">
                Chat Application
              </span>
            </div>

            {/* Subtitle */}
            <p className="mt-8 text-lg sm:text-2xl text-[#a1a1a1] max-w-3xl mx-auto leading-relaxed">
              Connects with your team. This is the best place to collaborate.
            </p>

            {/* Mini Navigation */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-[#0d0d0d] border border-[#1f1f1f] rounded-full p-2 shadow-[0_0_40px_rgba(17,168,232,0.08)]">

                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 rounded-full bg-[#11A8E8] text-white font-semibold hover:bg-[#38BDF8] transition-all duration-300"
                >
                  Get started
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 rounded-full text-white font-medium hover:bg-[#161616] transition-all duration-300"
                >
                  Login
                </button>

                <button
                  onClick={scrollToFeatures}
                  className="px-6 py-3 rounded-full text-white font-medium hover:bg-[#161616] transition-all duration-300"
                >
                  Features
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        ref={featuresRef}
        className="px-4 py-24 bg-[#050505]"
      >
        <div className="mx-auto max-w-6xl">

          <h2 className="text-5xl font-black mb-20 uppercase tracking-tight">
            Features
          </h2>

          {/* Feature Item - Channels */}
          <div className="flex items-center gap-12 mb-20">

            <div className="flex-1">
              <h3 className="text-3xl font-black mb-5 text-white uppercase">
                Channels
              </h3>

              <p className="text-lg text-[#9b9b9b] leading-relaxed max-w-xl">
                Create dedicated spaces for different teams and topics. Organize conversations by project, department, or any way that works for your team.
              </p>
            </div>

            <div className="shrink-0 w-96 h-72 bg-[#0d0d0d] border border-[#1f1f1f] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(17,168,232,0.12)] hover:border-[#11A8E8]/40 transition-all duration-300">
              <span className="text-[#11A8E8] font-bold text-lg">
                Channels Image
              </span>
            </div>

          </div>

          {/* Feature Item - Direct Messages */}
          <div className="flex items-center gap-12 mb-20">

            <div className="flex-1">
              <h3 className="text-3xl font-black mb-5 text-white uppercase">
                Direct Messages
              </h3>

              <p className="text-lg text-[#9b9b9b] leading-relaxed max-w-xl">
                Have one-on-one conversations with team members privately. Share files, ideas, and feedback in a personal space away from channel noise.
              </p>
            </div>

            <div className="shrink-0 w-96 h-72 bg-[#0d0d0d] border border-[#1f1f1f] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(17,168,232,0.12)] hover:border-[#11A8E8]/40 transition-all duration-300">
              <span className="text-[#11A8E8] font-bold text-lg">
                Direct Messages Image
              </span>
            </div>

          </div>

          {/* Feature Item - File Sharing */}
          <div className="flex items-center gap-12 mb-20">

            <div className="flex-1">
              <h3 className="text-3xl font-black mb-5 text-white uppercase">
                File Sharing
              </h3>

              <p className="text-lg text-[#9b9b9b] leading-relaxed max-w-xl">
                Seamlessly upload and share files with your team. Keep all your important documents and resources in one centralized location for easy access.
              </p>
            </div>

            <div className="shrink-0 w-96 h-72 bg-[#0d0d0d] border border-[#1f1f1f] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(17,168,232,0.12)] hover:border-[#11A8E8]/40 transition-all duration-300">
              <span className="text-[#11A8E8] font-bold text-lg">
                File Sharing Image
              </span>
            </div>

          </div>

          {/* Feature Item - Message Reactions */}
          <div className="flex items-center gap-12 mb-20">

            <div className="flex-1">
              <h3 className="text-3xl font-black mb-5 text-white uppercase">
                Message Reactions
              </h3>

              <p className="text-lg text-[#9b9b9b] leading-relaxed max-w-xl">
                React to messages with emojis to show appreciation or feedback. Express yourself quickly without cluttering the chat with additional messages.
              </p>
            </div>

            <div className="shrink-0 w-96 h-72 bg-[#0d0d0d] border border-[#1f1f1f] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(17,168,232,0.12)] hover:border-[#11A8E8]/40 transition-all duration-300">
              <span className="text-[#11A8E8] font-bold text-lg">
                Reactions Image
              </span>
            </div>

          </div>

          {/* Feature Item - Message Editing */}
          <div className="flex items-center gap-12 mb-20">

            <div className="flex-1">
              <h3 className="text-3xl font-black mb-5 text-white uppercase">
                Message Editing
              </h3>

              <p className="text-lg text-[#9b9b9b] leading-relaxed max-w-xl">
                Edit your messages after sending them to fix typos or update information. Keep your conversations accurate and clear with full control over your messages.
              </p>
            </div>

            <div className="shrink-0 w-96 h-72 bg-[#0d0d0d] border border-[#1f1f1f] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(17,168,232,0.12)] hover:border-[#11A8E8]/40 transition-all duration-300">
              <span className="text-[#11A8E8] font-bold text-lg">
                Message Editing Image
              </span>
            </div>

          </div>

          {/* Feature Item - Thread Replies */}
          <div className="flex items-center gap-12 mb-20">

            <div className="flex-1">
              <h3 className="text-3xl font-black mb-5 text-white uppercase">
                Thread Replies
              </h3>

              <p className="text-lg text-[#9b9b9b] leading-relaxed max-w-xl">
                Keep conversations organized with threaded replies. Reply to specific messages to maintain context and prevent channel conversations from becoming chaotic.
              </p>
            </div>

            <div className="shrink-0 w-96 h-72 bg-[#0d0d0d] border border-[#1f1f1f] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(17,168,232,0.12)] hover:border-[#11A8E8]/40 transition-all duration-300">
              <span className="text-[#11A8E8] font-bold text-lg">
                Thread Replies Image
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#050505] text-white px-4 py-14 border-t border-[#111111]">

        <div className="mx-auto max-w-6xl">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            <div>
              <h4 className="text-lg font-black mb-5 text-[#11A8E8] uppercase">
                Developers
              </h4>

              <ul className="space-y-3 text-[#8a8a8a]">
                <li><a href="#" className="hover:text-white transition">name1</a></li>
                <li><a href="#" className="hover:text-white transition">name2</a></li>
                <li><a href="#" className="hover:text-white transition">name3</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-black mb-5 text-[#11A8E8] uppercase">
                Contact
              </h4>

              <ul className="space-y-3 text-[#8a8a8a]">
                <li><a href="#" className="hover:text-white transition">number1</a></li>
                <li><a href="#" className="hover:text-white transition">number2</a></li>
                <li><a href="#" className="hover:text-white transition">number3</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-black mb-5 text-[#11A8E8] uppercase">
                Features
              </h4>

              <ul className="space-y-3 text-[#8a8a8a]">
                <li><a href="#" className="hover:text-white transition">feature1</a></li>
                <li><a href="#" className="hover:text-white transition">feature2</a></li>
                <li><a href="#" className="hover:text-white transition">feature3</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-[#111111] pt-8 text-center text-[#666666]">
            <p>This is just a clone and our second project</p>
          </div>

        </div>
      </footer>

    </div>
  )
}

export default Home