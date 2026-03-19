'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
        }),
      });

      if (response.ok || response.status === 204) {
        setStatus({ type: 'success', message: 'メッセージを送信しました！' });
        setContent('');
      } else {
        setStatus({ type: 'error', message: `送信に失敗しました: ${response.status}` });
      }
    } catch (error) {
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
                required
                rows={8}
                className="resize-none"
              />
            </div>

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
