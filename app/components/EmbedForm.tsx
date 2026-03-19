import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { Embed } from "../hooks/useWebhookForm";

interface EmbedFormProps {
  embed: Embed;
  index: number;
  onUpdate: (id: string, field: keyof Embed, value: string) => void;
  onRemove: (id: string) => void;
}

export function EmbedForm({
  embed,
  index,
  onUpdate,
  onRemove,
}: EmbedFormProps) {
  return (
    <div className="space-y-2 p-4 border border-border rounded-lg relative">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-semibold">埋め込み {index + 1}</Label>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onRemove(embed.id)}
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
          onChange={(e) => onUpdate(embed.id, "title", e.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`embed-description-${embed.id}`}>説明</Label>
        <Textarea
          id={`embed-description-${embed.id}`}
          placeholder="埋め込みの説明"
          value={embed.description}
          onChange={(e) => onUpdate(embed.id, "description", e.target.value)}
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
            onChange={(e) => onUpdate(embed.id, "color", e.target.value)}
            className="h-10 w-20 cursor-pointer"
          />
          <Input
            type="text"
            value={embed.color}
            onChange={(e) => onUpdate(embed.id, "color", e.target.value)}
            className="h-10"
            placeholder="#5865f2"
          />
        </div>
      </div>
    </div>
  );
}
