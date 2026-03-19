'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface Embed {
  id: string;
  title: string;
  description: string;
  color: string;
}

export default function Home() {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-2xl p-0">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">メッセージ内容</Label>
              <Textarea
                id="content"
                placeholder="送信するメッセージを入力してください"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </div>

            {embeds.map((embed, index) => (
              <div key={embed.id} className="space-y-2 p-4 border border-border rounded-lg relative">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold">埋め込み {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeEmbed(embed.id)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-title-${embed.id}`}>タイトル</Label>
                  <Input
                    id={`embed-title-${embed.id}`}
                    type="text"
                    placeholder="埋め込みのタイトル"
                    value={embed.title}
                    onChange={(e) => updateEmbed(embed.id, 'title', e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-description-${embed.id}`}>説明</Label>
                  <Textarea
                    id={`embed-description-${embed.id}`}
                    placeholder="埋め込みの説明"
                    value={embed.description}
                    onChange={(e) => updateEmbed(embed.id, 'description', e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-color-${embed.id}`}>カラー</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id={`embed-color-${embed.id}`}
                      type="color"
                      value={embed.color}
                      onChange={(e) => updateEmbed(embed.id, 'color', e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={embed.color}
                      onChange={(e) => updateEmbed(embed.id, 'color', e.target.value)}
                      className="h-10"
                      placeholder="#5865f2"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addEmbed}
              className="w-full h-10"
            >
              <Plus className="size-4" />
              埋め込みを追加する
            </Button>

            {status && (
              <div
                className={`p-4 rounded-md ${
                  status.type === 'success'
                    ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200'
                    : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
                }`}
              >
                {status.message}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full h-10">
              {isLoading ? '送信中...' : '送信'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
