import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, Plane } from "lucide-react";
import santoriniImage from "/Santorini_Greece_travel_destination_f056b3fb.png";
import baliImage from "/Bali_Indonesia_tropical_paradise_0f6cdb1c.png";
import dubaiImage from "/Dubai_UAE_modern_cityscape_fdfcae05.png";
import tuscanyImage from "/Tuscany_Italy_countryside_landscape_ec0bb092.png";

interface HolidayDeal {
  id: string;
  destination: string;
  country: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  duration: string;
  departure: string;
  rating: number;
  image: string;
  featured: boolean;
}

export default function HolidayDeals() {
  const [deals, setDeals] = useState<HolidayDeal[]>([]);

  useEffect(() => {
    // Simulating API call for holiday deals
    // In a real app, this would fetch from your travel deals API
    const fetchDeals = () => {
      const sampleDeals: HolidayDeal[] = [
        {
          id: "1",
          destination: "Santorini",
          country: "Greece",
          originalPrice: 1299,
          discountPrice: 899,
          discount: 31,
          duration: "7 days",
          departure: "London",
          rating: 4.8,
          image: santoriniImage,
          featured: true
        },
        {
          id: "2", 
          destination: "Bali",
          country: "Indonesia",
          originalPrice: 1599,
          discountPrice: 1199,
          discount: 25,
          duration: "10 days",
          departure: "London",
          rating: 4.9,
          image: baliImage,
          featured: false
        },
        {
          id: "3",
          destination: "Dubai",
          country: "UAE",
          originalPrice: 899,
          discountPrice: 649,
          discount: 28,
          duration: "5 days", 
          departure: "London",
          rating: 4.7,
          image: dubaiImage,
          featured: true
        },
        {
          id: "4",
          destination: "Tuscany",
          country: "Italy", 
          originalPrice: 1199,
          discountPrice: 849,
          discount: 29,
          duration: "8 days",
          departure: "London",
          rating: 4.6,
          image: tuscanyImage,
          featured: false
        }
      ];
      
      setDeals(sampleDeals);
    };

    fetchDeals();
  }, []);

  return (
    <Card data-testid="card-holiday-deals">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plane className="h-5 w-5 text-blue-600" />
            <CardTitle>Latest Holiday Deals</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            Limited Time
          </Badge>
        </div>
        <CardDescription>
          Exclusive travel deals for Travana partners
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deals.map((deal) => (
            <div 
              key={deal.id} 
              className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
              data-testid={`deal-${deal.id}`}
            >
              {/* Deal Image */}
              <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={deal.image} 
                  alt={`${deal.destination}, ${deal.country}`}
                  className="w-full h-full object-cover"
                  data-testid={`image-${deal.id}`}
                />
              </div>
              
              {/* Deal Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate" data-testid={`text-destination-${deal.id}`}>
                        {deal.destination}
                      </h4>
                      {deal.featured && (
                        <Badge variant="default" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span data-testid={`text-country-${deal.id}`}>{deal.country}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span data-testid={`text-duration-${deal.id}`}>{deal.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        <span data-testid={`text-rating-${deal.id}`}>{deal.rating}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      From {deal.departure}
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-right ml-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-foreground" data-testid={`text-price-${deal.id}`}>
                        £{deal.discountPrice}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        -{deal.discount}%
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground line-through">
                      £{deal.originalPrice}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                      Save £{deal.originalPrice - deal.discountPrice}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {deals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-deals">
              <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No holiday deals available at the moment</p>
            </div>
          )}
          
          {deals.length > 0 && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full"
                data-testid="button-view-all-deals"
              >
                View All Holiday Deals
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}