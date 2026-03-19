import { useState } from 'react';

export interface Embed {
  id: string;
  title: string;
  description: string;
  color: string;
}

export function useWebhookForm() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [content, setContent] = useState('');
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const addEmbed = () => {
    const newEmbed: Embed = {
      id: Math.random().toString(36).substring(7),
      title: '',
      description: '',
      color: '#5865f2',
    };
    setEmbeds([...embeds, newEmbed]);
  };

  const removeEmbed = (id: string) => {
    setEmbeds(embeds.filter(embed => embed.id !== id));
  };

  const updateEmbed = (id: string, field: keyof Embed, value: string) => {
    setEmbeds(embeds.map(embed =>
      embed.id === id ? { ...embed, [field]: value } : embed
    ));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const payload: { content?: string; embeds?: unknown[] } = {};

    if (content.trim()) {
      payload.content = content;
    }

    if (embeds.length > 0) {
      payload.embeds = embeds.map(embed => ({
        title: embed.title || undefined,
        description: embed.description || undefined,
        color: parseInt(embed.color.replace('#', ''), 16),
      }));
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 204) {
        setStatus({ type: 'success', message: 'メッセージを送信しました！' });
        setContent('');
        setEmbeds([]);
      } else {
        setStatus({ type: 'error', message: `送信に失敗しました: ${response.status}` });
      }
    } catch {
      setStatus({ type: 'error', message: '送信中にエラーが発生しました' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    webhookUrl,
    setWebhookUrl,
    content,
    setContent,
    embeds,
    addEmbed,
    removeEmbed,
    updateEmbed,
    isLoading,
    status,
    handleSubmit,
  };
}
