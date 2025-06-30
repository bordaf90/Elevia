'use client';

import { useState } from 'react';
import { Linkedin, Twitch, Instagram, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ElevIAHome() {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi there! 👋 I’m ElevIA Assistant. Ask me anything about how we can help your business with AI.',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.from === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: 'bot', text: data.reply || 'Sorry, no response.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Error reaching assistant. Try again later.' }]);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://formspree.io/f/mrbkjaly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert('There was an error sending the message.');
      }
    } catch (err) {
      alert('Error sending message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white font-sans">
      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center">
        <motion.h1
          className="text-7xl font-black mb-4 tracking-tight text-white drop-shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ElevIA
        </motion.h1>
        <motion.p
          className="text-2xl text-purple-300 mb-10 italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          The Business AI
        </motion.p>
        <motion.button
          onClick={() => setIsChatModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-10 py-4 rounded-full shadow-lg transition-transform hover:scale-105"
          whileTap={{ scale: 0.95 }}
        >
          Book a Demo
        </motion.button>
      </section>

      {/* Our Services */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center text-purple-100">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <ServiceCard title="Smart Chatbots" desc="24/7 automated customer support with natural language AI." />
          <ServiceCard title="AI-Powered Apps" desc="Custom applications with embedded intelligence and blockchain." />
          <ServiceCard title="Data Engineering" desc="Automated pipelines, warehousing and real-time data flows." />
          <ServiceCard title="Predictive Analytics" desc="Forecast trends, behaviors, and business outcomes." />
          <ServiceCard title="Database Automation" desc="Generate and manage high-quality, smart databases." />
          <ServiceCard title="Marketing Optimization" desc="Hyper-personalized targeting and campaign automation." />
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 px-6 bg-gray-900">
        <h2 className="text-4xl font-bold text-center mb-10 text-white">Why ElevIA?</h2>
        <ul className="max-w-4xl mx-auto space-y-5 text-lg list-disc list-inside text-gray-300">
          <li>Business-focused AI with real impact</li>
          <li>Custom, scalable, and multilingual solutions</li>
          <li>Fast deployment and measurable results</li>
          <li>Built for startups and enterprises alike</li>
        </ul>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Let’s Elevate Your Business</h2>
        <p className="text-lg mb-8 text-gray-300">Schedule a call and discover how AI can boost your growth.</p>
        <button
          onClick={() => setIsContactModalOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:opacity-90"
        >
          Contact Us
        </button>
      </section>

      {isChatModalOpen && (
        <Modal onClose={() => setIsChatModalOpen(false)} title="Live Demo: ElevIA Assistant 🤖">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 border border-gray-200 p-3 rounded-lg max-h-80">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-4 py-2 rounded-xl max-w-[85%] ${
                  msg.from === 'user'
                    ? 'bg-purple-100 text-right self-end ml-auto'
                    : 'bg-gray-100 text-left self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </Modal>
      )}

      {isContactModalOpen && (
        <Modal
          onClose={() => {
            setIsContactModalOpen(false);
            setSubmitted(false);
          }}
          title="Contact Us"
        >
          {!submitted ? (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
              <textarea
                required
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          ) : (
            <p className="text-black text-center font-medium">
              Thanks for contacting us! We’ll get back to you soon.
            </p>
          )}
        </Modal>
      )}

      <footer className="py-6 text-center text-sm border-t border-gray-700 bg-gray-900">
        <p className="text-white mb-4">© 2025 ElevIA. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="w-6 h-6 text-white hover:text-blue-400 transition-colors" />
          </a>
          <a href="https://www.twitch.tv" target="_blank" rel="noopener noreferrer" aria-label="Twitch">
            <Twitch className="w-6 h-6 text-white hover:text-purple-400 transition-colors" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram className="w-6 h-6 text-white hover:text-pink-400 transition-colors" />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
            <X className="w-6 h-6 text-white hover:text-gray-300 transition-colors" />
          </a>
        </div>
      </footer>
    </main>
  );
}

function ServiceCard({ title, desc }) {
  return (
    <div className="bg-white bg-opacity-5 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-700">
      <h3 className="text-xl font-semibold mb-3 text-purple-200">{title}</h3>
      <p className="text-gray-300">{desc}</p>
    </div>
  );
}

function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 px-4">
      <div className="bg-white text-black p-6 rounded-xl shadow-2xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-purple-700">{title}</h2>
        {children}
      </div>
    </div>
  );
}
