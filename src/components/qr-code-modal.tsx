import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappUrl: string;
  userName: string;
}

export default function QRCodeModal({ isOpen, onClose, whatsappUrl, userName }: QRCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && whatsappUrl) {
      generateQRCode();
    }
  }, [isOpen, whatsappUrl]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(whatsappUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `travana-referral-qr-${userName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-testid="modal-qr-code">
      <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground" data-testid="text-qr-modal-title">
              WhatsApp QR Code
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground h-10 w-10 p-0 touch-manipulation"
              data-testid="button-close-qr-modal"
            >
              ✕
            </Button>
          </div>

          <div className="text-center space-y-4 sm:space-y-6">
            <div className="bg-white p-3 sm:p-4 rounded-lg inline-block shadow-sm max-w-full">
              {isGenerating ? (
                <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="WhatsApp Referral QR Code" 
                  className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] max-w-full"
                  data-testid="img-qr-code"
                />
              ) : (
                <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
                  Failed to generate QR code
                </div>
              )}
            </div>

            <div className="space-y-2 px-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Show this QR code to someone so they can scan it with their phone camera to open WhatsApp with your referral message
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Works with any smartphone camera or QR scanner app
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 touch-manipulation"
                onClick={downloadQRCode}
                disabled={!qrCodeDataUrl}
                data-testid="button-download-qr"
              >
                <span className="mr-2">📥</span>
                Download
              </Button>
              <Button
                variant="secondary"
                className="flex-1 h-12 touch-manipulation"
                onClick={onClose}
                data-testid="button-close-qr"
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}