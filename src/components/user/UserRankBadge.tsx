
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserPointsData {
  id: string;
  points: number;
  rank_title: string;
}

interface RankDefinition {
  id: number;
  title: string;
  min_points: number;
  badge_color: string;
  description: string;
}

export function UserRankBadge({ showPoints = true }: { showPoints?: boolean }) {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<UserPointsData | null>(null);
  const [rankDefinition, setRankDefinition] = useState<RankDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchUserPointsAndRank() {
      try {
        // Fetch user points
        const { data: pointsData, error: pointsError } = await supabase
          .from('user_points')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (pointsError) throw pointsError;

        if (pointsData) {
          setUserPoints(pointsData);
          
          // Fetch rank definition
          const { data: rankData, error: rankError } = await supabase
            .from('rank_definitions')
            .select('*')
            .eq('title', pointsData.rank_title)
            .maybeSingle();

          if (rankError) throw rankError;
          if (rankData) setRankDefinition(rankData);
        }
      } catch (error) {
        console.error("Error fetching user points:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPointsAndRank();
  }, [user]);

  if (loading || !userPoints || !rankDefinition) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2 cursor-help">
            <Badge className={`${rankDefinition.badge_color} text-white`}>
              <Trophy className="h-3 w-3 mr-1" />
              {rankDefinition.title}
            </Badge>
            {showPoints && (
              <span className="text-xs font-medium">{userPoints.points} πόντοι</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-sm">
            <p className="font-medium">{rankDefinition.title}</p>
            <p>{rankDefinition.description}</p>
            <p className="text-xs mt-1">
              {userPoints.points} πόντοι - {' '}
              {rankDefinition?.min_points < 1000 ? (
                <>Επόμενο επίπεδο στους {1000 - userPoints.points} πόντους</>
              ) : (
                <>Έχεις φτάσει το μέγιστο επίπεδο!</>
              )}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
