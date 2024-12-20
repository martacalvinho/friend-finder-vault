import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink, Calendar, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface RecommendationCardProps {
  id: string;
  title: string;
  category: string;
  friendName: string;
  notes?: string;
  url?: string;
  date: string;
  used: boolean;
  className?: string;
  onFriendClick: (name: string) => void;
  onDelete: (id: string) => void;
  onToggleUsed: (id: string, used: boolean) => void;
}

export function RecommendationCard({
  id,
  title,
  category,
  friendName,
  notes,
  url,
  date,
  used,
  className,
  onFriendClick,
  onDelete,
  onToggleUsed,
}: RecommendationCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className={cn(
      "bg-white/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300",
      used && "bg-gray-50",
      className
    )}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className={cn(
              "text-xl font-semibold",
              used && "line-through text-gray-500"
            )}>
              {title}
            </CardTitle>
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
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="ml-2">
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {notes && <p className="text-sm text-gray-600">{notes}</p>}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`used-${id}`}
                checked={used}
                onCheckedChange={(checked) => onToggleUsed(id, checked as boolean)}
              />
              <label
                htmlFor={`used-${id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Used?
              </label>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Recommendation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this recommendation? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      onDelete(id);
                      setIsDeleting(false);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}