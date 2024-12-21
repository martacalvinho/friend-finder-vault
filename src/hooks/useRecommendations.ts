import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  friend_name: string;
  notes: string | null;
  url: string | null;
  date: string;
  used: boolean;
  user_id: string;
}

export const useRecommendations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
      }

      return data || [];
    },
  });

  const handleAddRecommendation = async (newRecommendation: Omit<Recommendation, "id" | "used">) => {
    const { data, error } = await supabase
      .from('recommendations')
      .insert([{ ...newRecommendation, used: false }])
      .select()
      .single();

    if (error) {
      console.error('Error adding recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to add recommendation. Please try again.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    toast({
      title: "Success!",
      description: "Recommendation added successfully",
    });
  };

  const handleDeleteRecommendation = async (id: string) => {
    const { error } = await supabase
      .from('recommendations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to delete recommendation. Please try again.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    toast({
      title: "Success",
      description: "Recommendation deleted successfully",
    });
  };

  const handleToggleUsed = async (id: string, used: boolean) => {
    const { error } = await supabase
      .from('recommendations')
      .update({ used })
      .eq('id', id);

    if (error) {
      console.error('Error updating recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to update recommendation. Please try again.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['recommendations'] });
  };

  return {
    recommendations,
    isLoading,
    handleAddRecommendation,
    handleDeleteRecommendation,
    handleToggleUsed,
  };
};