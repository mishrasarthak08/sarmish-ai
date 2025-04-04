import { useState } from 'react';
import { generateResponse } from './services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await generateResponse(prompt);
      setResponse(result);
    } catch (error) {
      setError('Error: ' + error.message);
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="app"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="title-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="arc-reactor"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="arc-reactor-core"></div>
          <div className="arc-reactor-ring"></div>
          <div className="arc-reactor-ring"></div>
          <div className="arc-reactor-ring"></div>
        </motion.div>
        <h1>Sarmish AI</h1>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.textarea
          variants={itemVariants}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything..."
          rows={4}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
        <motion.button
          variants={itemVariants}
          type="submit"
          disabled={loading || !prompt.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={loading ? 'loading' : ''}
          animate={{
            width: loading ? 200 : 300
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          {loading ? 'Generating...' : 'Generate Response'}
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {error && (
          <motion.div
            className="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div
            className="skeleton-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="skeleton-line"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1,
                  delay: index * 0.2
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {response && !loading && (
          <motion.div
            className="response"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Response:
            </motion.h2>
            <motion.div
              className="markdown-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ReactMarkdown>{response}</ReactMarkdown>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;