import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink, Calendar } from "lucide-react";
import { Button } from "./ui/button";

interface RecommendationCardProps {
  title: string;
  category: string;
  friendName: string;
  notes?: string;
  url?: string;
  date: string;
  className?: string;
  onFriendClick: (name: string) => void;
}

export function RecommendationCard({
  title,
  category,
  friendName,
  notes,
  url,
  date,
  className,
  onFriendClick,
}: RecommendationCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className={cn("bg-white/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300", className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription className="mt-1">
              Recommended by{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-medium text-primary hover:underline"
                onClick={() => onFriendClick(friendName)}
              >
                {friendName}
              </Button>
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {notes && <p className="text-sm text-gray-600">{notes}</p>}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:underline"
            >
              Visit Website
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}