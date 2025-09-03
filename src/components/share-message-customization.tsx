import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Mail, MessageCircle, Linkedin, Eye, RotateCcw, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { InsertShareMessage, ShareMessage, User } from "@/types/schema";
import { toast } from "sonner";

interface ShareMessageCustomizationProps {
  user: User;
}

const platformConfig = {
  email: {
    name: "Email",
    icon: Mail,
    color: "bg-blue-500",
    hasSubject: true,
    placeholder: {
      subject: "Join Travana - Premium Travel Services",
      message: "Hi there!\n\nI wanted to share Travana with you - they provide amazing travel services and I think you'd love what they offer.\n\nUse my referral link to get started: [REFERRAL_LINK]\n\nBest regards!"
    }
  },
  whatsapp: {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "bg-green-500",
    hasSubject: false,
    placeholder: {
      message: "Hi! 👋\n\nI wanted to share Travana with you - they provide amazing travel services and I think you'd love what they offer!\n\nUse my referral link to get started: [REFERRAL_LINK]\n\nLet me know if you hav questions! ✈️"
    }
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    hasSubject: false,
    placeholder: {
      message: "Check out Travana's premium travel services! [REFERRAL_LINK]"
    }
  }
};

interface PreviewModalProps {
  platform: string;
  subject?: string;
  message: string;
  referralUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

function PreviewModal({ platform, subject, message, referralUrl, isOpen, onClose }: PreviewModalProps) {
  const config = platformConfig[platform as keyof typeof platformConfig];
  const Icon = config.icon;
  
  const processedMessage = message.replace(/\[REFERRAL_LINK\]/g, referralUrl);
  const processedSubject = subject?.replace(/\[REFERRAL_LINK\]/g, referralUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {config.name} Preview
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {config.hasSubject && processedSubject && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Subject:</Label>
              <div className="p-3 bg-muted rounded-md mt-1">
                <p className="text-sm">{processedSubject}</p>
              </div>
            </div>
          )}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Message:</Label>
            <div className="p-3 bg-muted rounded-md mt-1">
              <p className="text-sm whitespace-pre-wrap">{processedMessage}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ShareMessageCustomization({ user }: ShareMessageCustomizationProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("email");
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Record<string, { subject?: string; message: string }>>({});
  
  const referralUrl = `${window.location.origin}/ref/${user?.referralCode || ''}`;

  // Fetch existing share messages
  const { data: shareMessages } = useQuery<ShareMessage[]>({
    queryKey: ['/api/share-messages'],
  });

  // Save share message mutation
  const saveMessageMutation = useMutation({
    mutationFn: async (data: InsertShareMessage) => {
      return apiRequest('/api/share-messages', 'POST', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/share-messages'] });
      toast.success("Message saved");
     
    },
    onError: () => {
      toast.error("Failed to save share message");
      
    },
  });

  // Initialize form data when share messages load
  useEffect(() => {
    if (shareMessages) {
      const data: Record<string, { subject?: string; message: string }> = {};
      
      Object.keys(platformConfig).forEach(platform => {
        const existing = shareMessages.find(msg => msg.platform === platform);
        if (existing) {
          data[platform] = {
            subject: existing.subject || undefined,
            message: existing.message
          };
        } else {
          data[platform] = {
            subject: platformConfig[platform as keyof typeof platformConfig].hasSubject 
              ? platformConfig[platform as keyof typeof platformConfig].placeholder.message
              : undefined,
            message: platformConfig[platform as keyof typeof platformConfig].placeholder.message
          };
        }
      });
      
      setFormData(data);
    }
  }, [shareMessages]);

  const handleSave = (platform: string) => {
    const data = formData[platform];
    if (!data) return;

    saveMessageMutation.mutate({
      platform: platform as keyof typeof platformConfig,
      subject: data.subject,
      message: data.message,
      isActive: true,
    });
  };

  const handleReset = (platform: string) => {
    const config = platformConfig[platform as keyof typeof platformConfig];
    setFormData(prev => ({
      ...prev,
      [platform]: {
        subject: config.hasSubject ? config.placeholder.message : undefined,
        message: config.placeholder.message
      }
    }));
  };

  const updateFormData = (platform: string, field: 'subject' | 'message', value: string) => {
    setFormData(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2"
          data-testid="button-customize-messages"
        >
          <Settings className="h-4 w-4" />
          Customize Messages
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Customize Share Messages
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(platformConfig).map(([platform, config]) => {
              const Icon = config.icon;
              const hasCustomMessage = shareMessages?.some(msg => msg.platform === platform);
              
              return (
                <TabsTrigger 
                  key={platform} 
                  value={platform}
                  className="flex items-center gap-2"
                  data-testid={`tab-${platform}`}
                >
                  <Icon className="h-4 w-4" />
                  {config.name}
                  {hasCustomMessage && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                      ✓
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(platformConfig).map(([platform, config]) => {
            const Icon = config.icon;
            const data = formData[platform] || { message: '' };
            
            return (
              <TabsContent key={platform} value={platform} className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${config.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {config.name} Message Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {config.hasSubject && (
                      <div className="space-y-2">
                        <Label htmlFor={`subject-${platform}`}>Subject Line</Label>
                        <Input
                          id={`subject-${platform}`}
                          value={data.subject || ''}
                          onChange={(e) => updateFormData(platform, 'subject', e.target.value)}
                          placeholder={config.placeholder.message}
                          className="w-full"
                          data-testid={`input-subject-${platform}`}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor={`message-${platform}`}>Message</Label>
                      <Textarea
                        id={`message-${platform}`}
                        value={data.message || ''}
                        onChange={(e) => updateFormData(platform, 'message', e.target.value)}
                        placeholder={config.placeholder.message}
                        rows={6}
                        className="w-full resize-none"
                        data-testid={`textarea-message-${platform}`}
                      />
                      <div className="text-xs text-muted-foreground">
                        Use [REFERRAL_LINK] as a placeholder for your referral URL
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        onClick={() => handleSave(platform)}
                        disabled={saveMessageMutation.isPending}
                        className="gap-2"
                        data-testid={`button-save-${platform}`}
                      >
                        <Save className="h-4 w-4" />
                        Save Template
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => setShowPreview(true)}
                        className="gap-2"
                        data-testid={`button-preview-${platform}`}
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      
                      <Button
                        variant="ghost"
                        onClick={() => handleReset(platform)}
                        className="gap-2"
                        data-testid={`button-reset-${platform}`}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset to Default
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Preview Modal */}
        <PreviewModal
          platform={activeTab}
          subject={formData[activeTab]?.subject}
          message={formData[activeTab]?.message || ''}
          referralUrl={referralUrl}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      </DialogContent>
    </Dialog>
  );
}