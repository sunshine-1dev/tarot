import { motion } from 'framer-motion';

interface InterpretationPanelProps {
  text: string;
  isLoading: boolean;
}

export default function InterpretationPanel({ text, isLoading }: InterpretationPanelProps) {
  if (!text && !isLoading) return null;

  // Simple markdown-ish rendering
  const renderText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, i) => {
      // Bold
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-accent-gold">$1</strong>');
      // Blockquote
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={i}
            className="border-l-2 border-accent-gold/50 pl-4 my-2 italic text-text-secondary"
            dangerouslySetInnerHTML={{ __html: processed.slice(2) }}
          />
        );
      }
      // Divider
      if (line.trim() === '---') {
        return <hr key={i} className="border-accent-purple/20 my-4" />;
      }
      // Empty line
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return (
        <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-2xl border border-accent-purple/20 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">✨</span>
          <h3 className="text-accent-gold font-bold text-lg">星语解读</h3>
          {isLoading && (
            <div className="flex gap-1 ml-2">
              <motion.span
                className="w-1.5 h-1.5 bg-accent-gold rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
              />
              <motion.span
                className="w-1.5 h-1.5 bg-accent-gold rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
              />
              <motion.span
                className="w-1.5 h-1.5 bg-accent-gold rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
              />
            </div>
          )}
        </div>

        <div className="text-text-primary text-sm md:text-base space-y-1">
          {renderText(text)}
          {isLoading && <span className="typing-cursor" />}
        </div>
      </div>
    </motion.div>
  );
}
