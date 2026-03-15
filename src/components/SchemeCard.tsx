import { CATEGORY_COLORS } from "@/lib/constants";
import { Bookmark, BookmarkCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface SchemeCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  eligible: boolean;
  eligibleCount?: string | null;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  type: "scheme" | "exam";
}

export function SchemeCard({ id, name, description, category, eligible, eligibleCount, isBookmarked, onToggleBookmark, type }: SchemeCardProps) {
  const navigate = useNavigate();
  const catClass = CATEGORY_COLORS[category] || "cat-education";

  return (
    <div className="glass-card hover-lift p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-sm leading-tight mb-1 truncate">{name}</h3>
          <p className="text-muted-foreground text-xs line-clamp-2">{description}</p>
        </div>
        <button onClick={onToggleBookmark} className="shrink-0 text-muted-foreground hover:text-accent transition-colors">
          {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-accent" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {category && <span className={`${catClass} text-xs font-semibold px-2 py-0.5 rounded-full`}>{category}</span>}
        <Badge variant={eligible ? "default" : "secondary"} className={eligible ? "bg-eligible text-primary-foreground text-xs" : "bg-not-eligible text-primary-foreground text-xs"}>
          {eligible ? "Eligible" : "Not Eligible"}
        </Badge>
      </div>

      {eligibleCount && (
        <p className="text-xs text-muted-foreground">{eligibleCount} eligible</p>
      )}

      <Button
        variant="outline"
        size="sm"
        className="mt-auto self-start text-xs"
        onClick={() => navigate(`/${type}/${id}`)}
      >
        <Eye className="h-3 w-3 mr-1" /> View Details
      </Button>
    </div>
  );
}
