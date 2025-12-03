import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface EmojiReaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

interface EmojiReactionsProps {
  reactions: EmojiReaction[];
  onReactionPress?: (emoji: string) => void;
  onAddReaction?: () => void;
}

export function EmojiReactions({ reactions, onReactionPress, onAddReaction }: EmojiReactionsProps) {
  const pillBackground = useThemeColor({}, 'reactionPillBackground');
  const pillActiveBackground = useThemeColor({}, 'reactionPillActive');
  const textColor = useThemeColor({}, 'text');
  const secondaryText = useThemeColor({}, 'secondaryText');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {reactions.map((reaction) => (
        <TouchableOpacity
          key={reaction.emoji}
          style={[
            styles.pill,
            {
              backgroundColor: reaction.hasReacted ? pillActiveBackground : pillBackground,
              borderColor: reaction.hasReacted ? '#0095F6' : 'transparent',
            },
          ]}
          onPress={() => onReactionPress?.(reaction.emoji)}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.emoji}>{reaction.emoji}</ThemedText>
          <ThemedText style={[styles.count, { color: reaction.hasReacted ? '#0095F6' : textColor }]}>
            {reaction.count}
          </ThemedText>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.addPill, { backgroundColor: pillBackground }]}
        onPress={onAddReaction}
        activeOpacity={0.7}
      >
        <IconSymbol name="smiley" size={18} color={secondaryText} weight="regular" />
        <IconSymbol name="plus-circle" size={14} color={secondaryText} weight="bold" style={styles.plusIcon} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
  },
  emoji: {
    fontSize: 16,
  },
  count: {
    fontSize: 13,
    fontWeight: '500',
  },
  addPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 2,
  },
  plusIcon: {
    marginLeft: -4,
    marginTop: -8,
  },
});
