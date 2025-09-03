import { Check, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReferralStatus } from "@/types/schema";

interface ReferralProgressProps {
  currentStatus: ReferralStatus;
  className?: string;
}

const progressStages = [
  {
    key: 'enquiry' as ReferralStatus,
    label: 'Enquiry',
    description: 'Initial interest received',
    icon: Clock,
  },
  {
    key: 'quote_in_progress' as ReferralStatus,
    label: 'Quote In Progress',
    description: 'Preparing custom quote',
    icon: Clock,
  },
  {
    key: 'quote_ready' as ReferralStatus,
    label: 'Quote Ready',
    description: 'Quote sent to customer',
    icon: Clock,
  },
  {
    key: 'awaiting_decision' as ReferralStatus,
    label: 'Awaiting Decision',
    description: 'Customer reviewing quote',
    icon: Clock,
  },
] as const;

const finalStages = [
  {
    key: 'booked' as ReferralStatus,
    label: 'Booked',
    description: 'Trip confirmed & booked',
    color: 'success',
  },
  {
    key: 'lost' as ReferralStatus,
    label: 'Lost',
    description: 'Customer declined',
    color: 'destructive',
  },
] as const;

export default function ReferralProgress({ currentStatus, className }: ReferralProgressProps) {
  const getCurrentStageIndex = () => {
    return progressStages.findIndex(stage => stage.key === currentStatus);
  };

  const isStageCompleted = (stageIndex: number) => {
    const currentIndex = getCurrentStageIndex();
    return currentIndex > stageIndex;
  };

  const isStageActive = (stageKey: ReferralStatus) => {
    return currentStatus === stageKey;
  };

  const isFinalStage = () => {
    return currentStatus === 'booked' || currentStatus === 'lost';
  };

  const getFinalStageInfo = () => {
    return finalStages.find(stage => stage.key === currentStatus);
  };

  return (
    <Card className={cn("border border-border", className)} data-testid="referral-progress-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-primary" />
          Referral Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border"></div>
            <div 
              className="absolute left-6 top-8 w-0.5 bg-primary transition-all duration-500"
              style={{
                height: isFinalStage() 
                  ? '100%' 
                  : `${(getCurrentStageIndex() / (progressStages.length - 1)) * 100}%`
              }}
            ></div>

            {/* Progress Stages */}
            <div className="space-y-6">
              {progressStages.map((stage, index) => {
                const isCompleted = isStageCompleted(index);
                const isActive = isStageActive(stage.key);
                const Icon = stage.icon;

                return (
                  <div 
                    key={stage.key} 
                    className="relative flex items-start gap-4"
                    data-testid={`progress-stage-${stage.key}`}
                  >
                    {/* Stage Icon */}
                    <div className={cn(
                      "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                      isCompleted ? "bg-primary border-primary text-primary-foreground" :
                      isActive ? "bg-primary/10 border-primary text-primary animate-pulse" :
                      "bg-background border-border text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>

                    {/* Stage Content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          "font-semibold text-sm",
                          isActive ? "text-primary" : "text-foreground"
                        )}>
                          {stage.label}
                        </h3>
                        {isActive && (
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Final Stage */}
              {isFinalStage() && (
                <div className="relative flex items-start gap-4" data-testid={`progress-final-${currentStatus}`}>
                  <div className={cn(
                    "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2",
                    currentStatus === 'booked' 
                      ? "bg-green-500 border-green-500 text-white" 
                      : "bg-red-500 border-red-500 text-white"
                  )}>
                    <Check className="h-5 w-5" />
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn(
                        "font-semibold text-sm",
                        currentStatus === 'booked' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {getFinalStageInfo()?.label}
                      </h3>
                      <Badge 
                        variant={currentStatus === 'booked' ? 'default' : 'destructive'} 
                        className="text-xs"
                      >
                        Final
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getFinalStageInfo()?.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Summary */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge 
                variant={
                  currentStatus === 'booked' ? 'default' :
                  currentStatus === 'lost' ? 'destructive' :
                  'secondary'
                }
                className="font-medium"
                data-testid={`status-badge-${currentStatus}`}
              >
                {progressStages.find(s => s.key === currentStatus)?.label || 
                 finalStages.find(s => s.key === currentStatus)?.label}
              </Badge>
            </div>
            {!isFinalStage() && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium text-primary">
                  {Math.round(((getCurrentStageIndex() + 1) / progressStages.length) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}