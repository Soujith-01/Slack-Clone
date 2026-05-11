import React, { useRef } from 'react'
import { useNavigate } from 'react-router'

function Home() {
  const navigate = useNavigate()
  const featuresRef = useRef(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="text-5xl sm:text-6xl font-extrabold tracking-tight">
              Real-Time Chat Application
              <br />
              (Slack-Clone)
            </div>
            <p className="mt-6 text-xl sm:text-2xl text-slate-600">
              Connects with your team. This is the best place to collaborate.
            </p>

            {/* Mini Navigation Bar */}
            <div className="mt-10 flex justify-center">
              <div className="inline-flex items-center gap-1 bg-linear-to-r from-purple-100 to-blue-100 rounded-full p-1">
                <button 
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 rounded-full text-slate-700 font-semibold hover:bg-white/50 transition"
                >
                  Get started
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 rounded-full text-slate-700 font-semibold hover:bg-white/50 transition"
                >
                  Login
                </button>
                <button 
                  onClick={scrollToFeatures}
                  className="px-6 py-2 rounded-full text-slate-700 font-semibold hover:bg-white/50 transition"
                >
                  Features
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="px-4 py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-16">Features</h2>
          
          {/* Feature Item - Channels */}
          <div className="flex items-center gap-12 mb-20">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Channels</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Create dedicated spaces for different teams and topics. Organize conversations by project, department, or any way that works for your team.
              </p>
            </div>
            <div className="shrink-0 w-96 h-72 bg-linear-to-br from-blue-200 to-blue-300 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-semibold">Channels Image</span>
            </div>
          </div>

          {/* Feature Item - Direct Messages */}
          <div className="flex items-center gap-12 mb-20">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Direct Messages</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Have one-on-one conversations with team members privately. Share files, ideas, and feedback in a personal space away from channel noise.
              </p>
            </div>
            <div className="shrink-0 w-96 h-72 bg-linear-to-br from-green-200 to-green-300 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-semibold">Direct Messages Image</span>
            </div>
          </div>

          {/* Feature Item - File Sharing */}
          <div className="flex items-center gap-12 mb-20">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">File Sharing</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Seamlessly upload and share files with your team. Keep all your important documents and resources in one centralized location for easy access.
              </p>
            </div>
            <div className="shrink-0 w-96 h-72 bg-linear-to-br from-yellow-200 to-yellow-300 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-semibold">File Sharing Image</span>
            </div>
          </div>

          {/* Feature Item - Message Reactions */}
          <div className="flex items-center gap-12 mb-20">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Message Reactions</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                React to messages with emojis to show appreciation or feedback. Express yourself quickly without cluttering the chat with additional messages.
              </p>
            </div>
            <div className="shrink-0 w-96 h-72 bg-linear-to-br from-pink-200 to-pink-300 rounded-lg flex items-center justify-center">
              <span className="text-pink-600 font-semibold">Reactions Image</span>
            </div>
          </div>

          {/* Feature Item - Message Editing */}
          <div className="flex items-center gap-12 mb-20">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Message Editing</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Edit your messages after sending them to fix typos or update information. Keep your conversations accurate and clear with full control over your messages.
              </p>
            </div>
            <div className="shrink-0 w-96 h-72 bg-linear-to-br from-purple-200 to-purple-300 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-semibold">Message Editing Image</span>
            </div>
          </div>

          {/* Feature Item - Thread Replies */}
          <div className="flex items-center gap-12 mb-20">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Thread Replies</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Keep conversations organized with threaded replies. Reply to specific messages to maintain context and prevent channel conversations from becoming chaotic.
              </p>
            </div>
            <div className="shrink-0 w-96 h-72 bg-linear-to-br from-indigo-200 to-indigo-300 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">Thread Replies Image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Developers</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">name1</a></li>
                <li><a href="#" className="hover:text-white transition">name2</a></li>
                <li><a href="#" className="hover:text-white transition">name3</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">number1</a></li>
                <li><a href="#" className="hover:text-white transition">number2</a></li>
                <li><a href="#" className="hover:text-white transition">number3</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">features</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">feature1</a></li>
                <li><a href="#" className="hover:text-white transition">feature2</a></li>
                <li><a href="#" className="hover:text-white transition">feature3</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>This is just a clone and our second project</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home