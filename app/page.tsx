"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useWebhookForm } from "./hooks/useWebhookForm";
import { EmbedForm } from "./components/EmbedForm";
import { MessagePreview } from "./components/MessagePreview";

export default function Home() {
  const {
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
    showPreview,
    setShowPreview,
  } = useWebhookForm();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className={`w-full ${showPreview ? "max-w-7xl" : "max-w-2xl"}`}>
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-foreground underline hover:no-underline"
          >
            {showPreview ? "プレビューを非表示" : "プレビューを表示"}
          </button>
        </div>

        <div
          className={`grid gap-4 ${showPreview ? "grid-cols-2" : "grid-cols-1"}`}
        >
          <Card className="w-full p-0">
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
                  <p className="text-xs text-muted-foreground">
                    メンションを使用する場合: ユーザー{" "}
                    <code className="text-xs px-1 rounded text-[#dea700] bg-[#ffe2973d] font-semibold">
                      &lt;@id&gt;
                    </code>
                    、ロール{" "}
                    <code className="text-xs px-1 rounded text-[#dea700] bg-[#ffe2973d] font-semibold">
                      &lt;@&amp;id&gt;
                    </code>
                    、チャンネル{" "}
                    <code className="text-xs px-1 rounded text-[#dea700] bg-[#ffe2973d] font-semibold">
                      &lt;#id&gt;
                    </code>
                  </p>
                </div>

                {embeds.map((embed, index) => (
                  <EmbedForm
                    key={embed.id}
                    embed={embed}
                    index={index}
                    onUpdate={updateEmbed}
                    onRemove={removeEmbed}
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addEmbed}
                  className="w-full h-10 mb-2"
                >
                  <Plus className="size-4" />
                  埋め込みを追加する
                </Button>

                {status && (
                  <div
                    className={`p-4 rounded-md ${
                      status.type === "success"
                        ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                        : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10"
                >
                  {isLoading ? "送信中..." : "送信"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {showPreview && <MessagePreview content={content} embeds={embeds} />}
        </div>
      </div>
    </div>
  );
}
