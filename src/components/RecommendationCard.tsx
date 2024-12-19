import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  title: string;
  category: string;
  friendName: string;
  notes?: string;
  className?: string;
}

export function RecommendationCard({
  title,
  category,
  friendName,
  notes,
  className,
}: RecommendationCardProps) {
  return (
    <Card className={cn("transition-all duration-300 hover:animate-card-hover", className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription className="mt-1">Recommended by {friendName}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">
            {category}
          </Badge>
        </div>
      </CardHeader>
      {notes && (
        <CardContent>
          <p className="text-sm text-gray-600">{notes}</p>
        </CardContent>
      )}
    </Card>
  );
}