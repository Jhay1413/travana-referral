// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import type { Referral } from "@/types/schema";
// import { referralStatusLabels } from "@/types/schema";

// export default function RecentReferrals() {
//   const [statusFilter, setStatusFilter] = useState<string>("all");

//   const { data: referrals, isLoading } = useQuery<Referral[]>({
//     queryKey: ["/api/referrals"],
//     retry: false,
//   });


//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .substring(0, 2);
//   };

//   if (isLoading) {
//     return (
//       <Card className="border border-border">
//         <CardContent className="p-4 sm:p-6">
//           <div className="border-b border-border pb-4 mb-4">
//             <div className="h-6 bg-muted rounded w-1/3"></div>
//           </div>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Date Added</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Pending Comm.</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {[...Array(3)].map((_, i) => (
//                 <TableRow key={i} className="animate-pulse">
//                   <TableCell><div className="h-4 bg-muted rounded w-24"></div></TableCell>
//                   <TableCell><div className="h-4 bg-muted rounded w-20"></div></TableCell>
//                   <TableCell><div className="h-4 bg-muted rounded w-16"></div></TableCell>
//                   <TableCell><div className="h-4 bg-muted rounded w-16"></div></TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="border border-border">
//       <div className="p-4 sm:p-6 border-b border-border">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-base sm:text-lg font-semibold text-foreground" data-testid="text-recent-referrals-title">
//             Recent Referrals
//           </h3>
//           <Button variant="ghost" className="text-primary hover:text-primary/90 text-sm font-medium h-10 touch-manipulation" data-testid="button-view-all-referrals">
//             <span className="hidden sm:inline">View All</span>
//             <span className="sm:hidden">All</span>
//           </Button>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-muted-foreground">Filter:</span>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[140px] h-8 text-xs" data-testid="select-status-filter">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               {Object.entries(referralStatusLabels).map(([value, label]) => (
//                 <SelectItem key={value} value={value}>
//                   {label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
      
//       <CardContent className="p-0">
//         {!referrals || referrals.length === 0 ? (
//           <div className="text-center py-8 px-4 sm:px-6">
//             <p className="text-muted-foreground text-sm sm:text-base" data-testid="text-no-referrals">
//               No referrals yet. Create your first referral to get started!
//             </p>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table View */}
//             <div className="hidden md:block">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Date Added</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Pending Comm.</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {referrals
//                     .filter((referral: Referral) => statusFilter === "all" || referral.status === statusFilter)
//                     .slice(0, 5)
//                     .map((referral: Referral) => (
//                     <TableRow key={referral.id} data-testid={`referral-row-${referral.id}`}>
//                       <TableCell>
//                         <div className="flex items-center space-x-3">
//                           <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
//                             <span className="text-xs font-medium text-primary">
//                               {getInitials(referral.refereeName)}
//                             </span>
//                           </div>
//                           <div>
//                             <p className="font-medium text-foreground" data-testid={`text-referral-name-${referral.id}`}>
//                               {referral.refereeName}
//                             </p>
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell data-testid={`text-referral-date-${referral.id}`}>
//                         <span className="text-sm">
//                           {new Date(referral.createdAt!).toLocaleDateString()}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         <ReferralStatusUpdate referral={referral} compact={true} />
//                       </TableCell>
//                       <TableCell data-testid={`text-pending-commission-${referral.id}`}>
//                         <span className="text-sm font-medium text-green-600 dark:text-green-400">
//                           {referral.status === 'booked' ? '£0.00' : '£75.00'}
//                         </span>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Mobile Card View - Name and Pending Commission Only */}
//             <div className="md:hidden divide-y divide-border">
//               {referrals
//                 .filter((referral: Referral) => statusFilter === "all" || referral.status === statusFilter)
//                 .slice(0, 5)
//                 .map((referral: Referral) => (
//                 <div key={referral.id} className="p-4 flex items-center justify-between" data-testid={`referral-card-${referral.id}`}>
//                   {/* Name */}
//                   <div className="flex items-center space-x-3 flex-1 min-w-0">
//                     <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
//                       <span className="text-sm font-medium text-primary">
//                         {getInitials(referral.refereeName)}
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-foreground truncate" data-testid={`text-referral-name-mobile-${referral.id}`}>
//                         {referral.refereeName}
//                       </p>
//                     </div>
//                   </div>
                  
//                   {/* Pending Commission */}
//                   <div className="text-right">
//                     <p className="text-xs text-muted-foreground mb-1">Pending Comm.</p>
//                     <p className="text-green-600 dark:text-green-400 font-semibold" data-testid={`text-pending-commission-mobile-${referral.id}`}>
//                       {referral.status === 'booked' ? '£0.00' : '£75.00'}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
