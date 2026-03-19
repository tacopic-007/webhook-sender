import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { Embed } from '../hooks/useWebhookForm';

interface MessagePreviewProps {
  content: string;
  embeds: Embed[];
}

export function MessagePreview({ content, embeds }: MessagePreviewProps) {
  return (
    <Card className="w-full p-0">
      <CardContent className="p-5">
        <div className="space-y-3">
          <Label htmlFor="content" className='mb-2'>プレビュー</Label>

          <div className="bg-[#36393f] dark:bg-[#36393f] rounded-lg p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-semibold flex-shrink-0">
                W
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold text-sm">Webhook</span>
                  <span className="text-white font-bold text-xs bg-[#5865f2] px-1 rounded">アプリ</span>
                  <span className="text-[#949ba4] text-xs">今日 12:00</span>
                </div>

                {content && (
                  <div className="text-[#dcddde] text-sm mb-2 whitespace-pre-wrap break-words">
                    {content}
                  </div>
                )}

                {embeds.length > 0 && (
                  <div className="space-y-2">
                    {embeds.map((embed) => (
                      <div
                        key={embed.id}
                        className="bg-[#2f3136] rounded border-l-4 p-3 max-w-[520px]"
                        style={{ borderLeftColor: embed.color || '#5865f2' }}
                      >
                        {embed.title && (
                          <div className="text-white font-semibold text-sm mb-1">
                            {embed.title}
                          </div>
                        )}
                        {embed.description && (
                          <div className="text-[#dcddde] text-sm whitespace-pre-wrap break-words">
                            {embed.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!content && embeds.length === 0 && (
                  <div className="text-[#949ba4] text-sm italic">
                    メッセージまたは埋め込みを入力してください
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
