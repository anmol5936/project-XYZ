import React, { useState } from 'react';
import { Heart, Laugh, Frown, Angry, Eye, ThumbsUp } from 'lucide-react';

interface ReactionPickerProps {
  onReactionSelect: (type: string) => void;
  currentReactions: { [key: string]: number };
  userReaction?: string;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({ 
  onReactionSelect, 
  currentReactions, 
  userReaction 
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const reactions = [
    { type: 'like', icon: ThumbsUp, emoji: '👍', label: 'Like' },
    { type: 'love', icon: Heart, emoji: '❤️', label: 'Love' },
    { type: 'laugh', icon: Laugh, emoji: '😂', label: 'Laugh' },
    { type: 'wow', icon: Eye, emoji: '😮', label: 'Wow' },
    { type: 'sad', icon: Frown, emoji: '😢', label: 'Sad' },
    { type: 'angry', icon: Angry, emoji: '😠', label: 'Angry' },
  ];

  const handleReactionClick = (type: string) => {
    onReactionSelect(type);
    setShowPicker(false);
  };

  const getTotalReactions = () => {
    return Object.values(currentReactions).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className={`btn btn-ghost btn-sm ${userReaction ? 'text-blue-600' : ''}`}
      >
        {userReaction ? (
          <>
            <span className="text-base">
              {reactions.find(r => r.type === userReaction)?.emoji || '👍'}
            </span>
            {getTotalReactions()}
          </>
        ) : (
          <>
            <ThumbsUp className="w-4 h-4" />
            {getTotalReactions() || 'React'}
          </>
        )}
      </button>

      {showPicker && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex gap-1 z-20">
            {reactions.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => handleReactionClick(reaction.type)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex flex-col items-center min-w-[50px]"
                title={reaction.label}
              >
                <span className="text-xl">{reaction.emoji}</span>
                {currentReactions[reaction.type] > 0 && (
                  <span className="text-xs text-gray-500 mt-1">
                    {currentReactions[reaction.type]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReactionPicker;
