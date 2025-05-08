
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserRankBadge } from "./UserRankBadge";
import { Trophy, Award } from "lucide-react";

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

export function UserProfileCard() {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<UserPointsData | null>(null);
  const [ranks, setRanks] = useState<RankDefinition[]>([]);
  const [currentRank, setCurrentRank] = useState<RankDefinition | null>(null);
  const [nextRank, setNextRank] = useState<RankDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchUserPointsAndRanks() {
      try {
        // Fetch all rank definitions first
        const { data: ranksData, error: ranksError } = await supabase
          .from('rank_definitions')
          .select('*')
          .order('min_points', { ascending: true });

        if (ranksError) throw ranksError;
        setRanks(ranksData || []);

        // Fetch user points
        const { data: pointsData, error: pointsError } = await supabase
          .from('user_points')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (pointsError) throw pointsError;
        setUserPoints(pointsData);

        // If we have both user points and ranks, determine current and next rank
        if (pointsData && ranksData?.length > 0) {
          // Find current rank
          const currentRankDef = ranksData
            .filter(rank => rank.min_points <= pointsData.points)
            .reduce((prev, current) => (current.min_points > prev.min_points ? current : prev));
          
          setCurrentRank(currentRankDef);

          // Find next rank
          const nextRankDef = ranksData
            .filter(rank => rank.min_points > pointsData.points)
            .sort((a, b) => a.min_points - b.min_points)[0];
          
          setNextRank(nextRankDef);
        }
      } catch (error) {
        console.error("Error fetching user points and ranks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPointsAndRanks();
  }, [user]);

  if (loading || !userPoints) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Φόρτωση προφίλ...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Calculate progress to next rank
  const calculateProgress = () => {
    if (!currentRank || !nextRank) {
      return currentRank ? 100 : 0;
    }
    
    const currentPoints = userPoints.points;
    const currentRankPoints = currentRank.min_points;
    const nextRankPoints = nextRank.min_points;
    const totalNeededPoints = nextRankPoints - currentRankPoints;
    const userEarnedPoints = currentPoints - currentRankPoints;
    
    return Math.min(Math.floor((userEarnedPoints / totalNeededPoints) * 100), 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Το προφίλ μου</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Επίπεδο</span>
            </div>
            <UserRankBadge showPoints={false} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Πόντοι</span>
            </div>
            <span className="font-bold">{userPoints.points}</span>
          </div>
        </div>

        {nextRank && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Επόμενο επίπεδο: {nextRank.title}</span>
              <span className="text-sm font-medium">{calculateProgress()}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {nextRank.min_points - userPoints.points} πόντοι ακόμα
            </p>
          </div>
        )}

        <div className="pt-2 border-t">
          <h4 className="text-sm font-medium mb-2">Πώς κερδίζω πόντους:</h4>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Αναφορά αδέσποτου χαμηλής προτεραιότητας: 10 πόντοι</li>
            <li>• Αναφορά αδέσποτου μεσαίας προτεραιότητας: 30 πόντοι</li>
            <li>• Αναφορά αδέσποτου υψηλής προτεραιότητας: 50 πόντοι</li>
            <li>• Προσθήκη λεπτομερειών περιγραφής: +5 πόντοι</li>
            <li>• Κάθε ετικέτα που προσθέτεις: +2 πόντοι</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
