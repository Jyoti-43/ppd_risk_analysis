"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "../../Hooks/hook";
import { selectCurrentUser } from "../../redux/feature/user/userSlice";
import { PPD_Risk_Analysis } from "../../component/dashboard/mother/ppd-risk-analysis";
import { ScreeningHistory } from "../../component/dashboard/mother/screeing-history";
import {
  columns,
  PPDRiskAnalysis,
} from "../../component/dashboard/mother/ppd-risk-analysis-column-defination";
import {
  usePostCountQuery,
  useScreeningCountQuery,
  useGetSymptomsScreeningHistoryQuery,
  useGetHybridScreeningHistoryQuery,
  useGetEpdsScreeningHistoryQuery,
  useInvitePartnerMutation,
  useGetInvitedPartnersQuery,
  useGetPendingInvitesQuery,
} from "../../redux/services/userDashboardApi";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Activity,
  FileText,
  AlertTriangle,
  Calendar,
  KeyRound,
  UserPlus,
  Mail,
  UserCheck,
  Clock,
  Hourglass,
  ChevronRight,
} from "lucide-react";
import { timeAgo } from "@/utills/timeAgo";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

// Interface for screening data structure
interface ScreeningData {
  created_at: string;
  createdAt?: string; // For symptoms API
  risk_level?: string; // For EPDS API
  result?: {
    prediction?: string; // For symptoms API
    flag?: number;
    clinical_note?: string;
  };
  method: string;
}

export default function MotherDashboard() {
  const user = useAppSelector(selectCurrentUser);
  const { data: postCount, isLoading: isPostLoading } = usePostCountQuery(
    undefined,
    { refetchOnMountOrArgChange: false },
  );
  const { data: screeningCount, isLoading: isScreeningLoading } =
    useScreeningCountQuery(undefined, { refetchOnMountOrArgChange: false });
  const { data: symptomsScreeningHistory, isLoading: isSymptomsLoading } =
    useGetSymptomsScreeningHistoryQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });
  const { data: epdsScreeningHistory, isLoading: isEpdsLoading } =
    useGetEpdsScreeningHistoryQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });
  const { data: hybridScreeningHistory, isLoading: isHybridLoading } =
    useGetHybridScreeningHistoryQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });

  console.log("Dashboard State:", {
    symptoms: { data: symptomsScreeningHistory, loading: isSymptomsLoading },
    epds: { data: epdsScreeningHistory, loading: isEpdsLoading },
    hybrid: { data: hybridScreeningHistory?.history, loading: isHybridLoading },
    counts: screeningCount,
  });
  // Aggregated screening history from all sources, mapped to table format
  const screeningHistory = useMemo(() => {
    const allScreenings: any[] = [];

    // 1. Symptoms Screening History
    const symptomsData = Array.isArray(symptomsScreeningHistory?.data)
      ? symptomsScreeningHistory.data
      : Array.isArray(symptomsScreeningHistory)
        ? symptomsScreeningHistory
        : [];

    symptomsData.forEach((screening: any) => {
      const pred =
        screening.risk_label ||
        screening.result?.prediction ||
        screening.prediction ||
        "";
      const lowerPred = pred.toLowerCase();
      const riskLevel = lowerPred.includes("critical")
        ? "Critical"
        : lowerPred.includes("high")
          ? "High"
          : lowerPred.includes("low")
            ? "Low"
            : "Moderate";
      allScreenings.push({
        id:
          screening._id ||
          screening.id ||
          `symptoms-${screening.createdAt || screening.created_at}-${
            allScreenings.length
          }`,
        screeningType: "Symptoms",
        date: new Date(
          screening.createdAt || screening.created_at,
        ).toLocaleDateString(),
        created_at: screening.createdAt || screening.created_at,
        risk: riskLevel,
        prediction: riskLevel,
        action: "View Details",
        method: "symptoms",
        raw: screening,
      });
    });

    // 2. EPDS Screening History
    const epdsData = Array.isArray(epdsScreeningHistory?.history)
      ? epdsScreeningHistory.history
      : Array.isArray(epdsScreeningHistory)
        ? epdsScreeningHistory
        : [];

    epdsData.forEach((screening: any, index: number) => {
      const pred = screening.risk_label || screening.risk_level || "";
      const lowerPred = pred.toLowerCase();
      const riskLevel = lowerPred.includes("critical")
        ? "Critical"
        : lowerPred.includes("high")
          ? "High"
          : lowerPred.includes("low")
            ? "Low"
            : "Moderate";
      allScreenings.push({
        id:
          screening.id ||
          screening._id ||
          `epds-${index}-${screening.created_at}-${allScreenings.length}`,
        screeningType: "EPDS",
        date: new Date(screening.created_at).toLocaleDateString(),
        created_at: screening.created_at,
        risk: riskLevel,
        prediction: riskLevel,
        action: "View Details",
        method: "epds",
        raw: screening,
      });
    });

    // 3. Hybrid Screening History
    const hybridData = Array.isArray(hybridScreeningHistory?.history)
      ? hybridScreeningHistory.history
      : Array.isArray(hybridScreeningHistory)
        ? hybridScreeningHistory
        : [];

    hybridData.forEach((screening: any) => {
      const pred =
        screening.risk_label ||
        screening.result?.prediction ||
        screening.prediction ||
        "";
      const lowerPred = pred.toLowerCase();
      const riskLevel = lowerPred.includes("critical")
        ? "Critical"
        : lowerPred.includes("high")
          ? "High"
          : lowerPred.includes("low")
            ? "Low"
            : "Moderate";
      allScreenings.push({
        id:
          screening._id ||
          screening.id ||
          `hybrid-${screening.createdAt || screening.created_at}-${
            allScreenings.length
          }`,
        screeningType: "Hybrid",
        date: new Date(
          screening.createdAt || screening.created_at,
        ).toLocaleDateString(),
        created_at: screening.createdAt || screening.created_at,
        risk: riskLevel,
        prediction: riskLevel,
        action: "View Details",
        method: "hybrid",
        raw: screening,
      });
    });

    // Sort by created_at date (most recent first)
    return allScreenings.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  }, [symptomsScreeningHistory, epdsScreeningHistory, hybridScreeningHistory]);

  // Calculate the latest screening from sorted history
  const latestScreening = useMemo(() => {
    return screeningHistory.length > 0 ? screeningHistory[0] : null;
  }, [screeningHistory]);

  // Extract risk level from latest screening
  // Handle different API structures:
  // - EPDS: risk_level (direct field)
  // - Symptoms: result.prediction (nested field)
  // - Hybrid: TBD (will likely follow one of the above patterns)
  const currentRiskLevel = latestScreening
    ? latestScreening.prediction || "N/A"
    : "N/A";

  // Calculate time since last screening (days, hours, or minutes)
  const calculateTimeSince = (
    dateString: string,
  ): { value: number; unit: string } => {
    // Normalize date (logic from @/utills/timeAgo)
    let screeningDate: Date;
    if (dateString.includes("Z") || dateString.includes("+")) {
      screeningDate = new Date(dateString);
    } else {
      // If no timezone info, treat as UTC by appending 'Z'
      screeningDate = new Date(dateString + "Z");
    }

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - screeningDate.getTime());

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    // If more than 1 day, show days
    if (diffDays >= 1) {
      return { value: diffDays, unit: "DAYS" };
    }
    // If more than 1 hour but less than 24 hours, show hours
    else if (diffHours >= 1) {
      return { value: diffHours, unit: "HOURS" };
    }
    // Otherwise show minutes
    else {
      return { value: diffMinutes, unit: "MINUTES" };
    }
  };

  // Get time since last screening
  const timeSinceLastScreening = latestScreening?.created_at
    ? calculateTimeSince(latestScreening.created_at)
    : null;

  // Check if any screening data is loading
  const isAnyScreeningLoading =
    isSymptomsLoading || isEpdsLoading || isHybridLoading;

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [screeningTypes, setScreeningTypes] = useState<string[]>([
    "epds",
    "ppd",
    "hybrid",
  ]);
  const [accessLevel, setAccessLevel] = useState("latest_summary");
  const [invitePartner, { isLoading: isInviting }] = useInvitePartnerMutation();
  const { data: linkedPartners, isLoading: isPartnersLoading } =
    useGetInvitedPartnersQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });
  const { data: pendingInvites, isLoading: isPendingLoading } =
    useGetPendingInvitesQuery(undefined, {
      refetchOnMountOrArgChange: false,
    });
  console.log("linkedPartners", linkedPartners);
  console.log("pendingInvites", pendingInvites);

  // Combine active links and pending invites for the UI
  const allPartners = useMemo(() => {
    const active = Array.isArray(linkedPartners)
      ? linkedPartners
      : linkedPartners?.data || [];
    const pending = Array.isArray(pendingInvites)
      ? pendingInvites
      : pendingInvites?.data || [];

    // Filter out potential duplicates (in case an invite is transitioning to active)
    const activeEmails = new Set(
      active.map((p: any) => p.partner_email?.toLowerCase()),
    );
    const uniquePending = pending.filter(
      (p: any) => !activeEmails.has(p.partner_email?.toLowerCase()),
    );

    return [...active, ...uniquePending].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [linkedPartners, pendingInvites]);

  const handlePartnerInvite = async () => {
    if (!partnerEmail) {
      toast.error("Please enter a partner email");
      return;
    }
    try {
      await invitePartner({
        partner_email: partnerEmail,
        access_level: accessLevel,
        screening_types: screeningTypes,
      }).unwrap();
      toast.success("Invitation sent successfully!");
      setIsInviteDialogOpen(false);
      setPartnerEmail("");
    } catch (err) {
      toast.error("Failed to send invitation. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-full px-2 sm:px-4 space-y-8 overflow-x-hidden min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4 hidden"></h2>
          <div className="space-y-1">
            <span className="text-2xl md:text-3xl font-bold text-amber-950/80 tracking-tight text-heading block">
              Welcome back, {user?.userName} !
            </span>
            <p className="text-muted-foreground font-medium">
              Here is your wellness overview.
            </p>
          </div>
        </div>
        <div className="relative flex items-center">
          <Button
            className="bg-primary text-white"
            onClick={() => setIsInviteDialogOpen(true)}
          >
            + Add Partner
          </Button>

          <Dialog
            open={isInviteDialogOpen}
            onOpenChange={setIsInviteDialogOpen}
          >
            <DialogContent className="p-0 border-none bg-transparent">
              <div className="bg-white rounded-[32px] p-8 shadow-2xl space-y-6 max-w-md w-full mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-amber-950/80">
                    Invite Your Partner
                  </DialogTitle>
                  <p className="text-amber-900/60 font-medium">
                    Share your screening results with your support system.
                  </p>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="partner-email"
                      className="font-semibold text-amber-950/80"
                    >
                      Partner's Email
                    </Label>
                    <Input
                      id="partner-email"
                      type="email"
                      placeholder="partner@example.com"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      className="rounded-xl border-amber-100 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold text-amber-950/80">
                      Access Level
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "latest_summary", label: "Latest Summary" },
                        { id: "full_history", label: "Full History" },
                      ].map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => setAccessLevel(level.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            accessLevel === level.id
                              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                              : "bg-white text-slate-500 border-slate-100 hover:border-primary/30"
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-semibold text-amber-950/80">
                      Share Screenings
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["epds", "ppd", "hybrid"].map((type) => (
                        <div
                          key={type}
                          onClick={() => {
                            if (screeningTypes.includes(type)) {
                              setScreeningTypes(
                                screeningTypes.filter((t) => t !== type),
                              );
                            } else {
                              setScreeningTypes([...screeningTypes, type]);
                            }
                          }}
                          className={`flex items-center justify-center p-2 rounded-xl border cursor-pointer transition-all ${
                            screeningTypes.includes(type)
                              ? "bg-primary/5 border-primary text-primary font-bold"
                              : "bg-white border-slate-100 text-slate-400"
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-wider">
                            {type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handlePartnerInvite}
                    disabled={
                      isInviting || !partnerEmail || screeningTypes.length === 0
                    }
                    className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-white mt-2"
                  >
                    {isInviting ? "Sending..." : "Send Invitation"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* total count cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-2 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total screenings
              </span>
              <p className="text-2xl font-bold text-slate-800">
                {isScreeningLoading
                  ? "..."
                  : screeningCount?.total_screening_count}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-2 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Posts
              </span>
              <p className="text-2xl font-bold text-slate-800">
                {isPostLoading ? "..." : postCount?.total_post_count}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-2 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Current Risk Level
              </span>
              <p className="text-2xl font-bold capitalize text-slate-800">
                {isAnyScreeningLoading ? "..." : currentRiskLevel}
              </p>
              {!isAnyScreeningLoading && currentRiskLevel !== "N/A" && (
                <p
                  className={`text-xs font-semibold mt-0.5 ${
                    currentRiskLevel?.toLowerCase().includes("critical")
                      ? "text-red-600 animate-pulse"
                      : currentRiskLevel?.toLowerCase().includes("high")
                        ? "text-red-500"
                        : currentRiskLevel?.toLowerCase().includes("moderate")
                          ? "text-amber-500"
                          : "text-emerald-500"
                  }`}
                >
                  {currentRiskLevel?.toLowerCase().includes("critical")
                    ? "EMERGENCY"
                    : currentRiskLevel?.toLowerCase().includes("high")
                      ? "Seek Care"
                      : currentRiskLevel?.toLowerCase().includes("moderate")
                        ? "Monitor Closely"
                        : "Doing Great"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-2 h-full">
            <div className="flex-shrink-0 w-12 h-12 bg-[#fff1f2] rounded-2xl flex items-center justify-center">
              <Calendar className="h-7 w-7 text-[#fb7185]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                LATEST SCREENING
              </span>
              <h3 className="text-xl font-bold text-slate-700 mt-0.5">
                {isAnyScreeningLoading
                  ? "..."
                  : latestScreening
                    ? new Date(latestScreening.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                    : "No data"}
              </h3>
              <p className="text-sm font-medium text-emerald-500 mt-0.5">
                On schedule
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Section: Analysis and Partners side-by-side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Risk Analysis Chart */}
        <div className="w-full min-w-0 col-span-2">
          <PPD_Risk_Analysis
            symptomsHistory={symptomsScreeningHistory}
            epdsHistory={epdsScreeningHistory}
            hybridHistory={hybridScreeningHistory}
          />
        </div>

        {/* Linked Partners Section */}
        <div className="space-y-4 col-span-1">
          <div className="flex items-center gap-2 px-1">
            <UserPlus className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-800">
              Linked Support Partners
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-4">
            {isPartnersLoading || isPendingLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Card
                  key={i}
                  className="animate-pulse bg-slate-50 border-none h-24"
                />
              ))
            ) : allPartners && allPartners.length > 0 ? (
              allPartners.map((partner: any, index: number) => (
                <Card
                  key={
                    partner.id || partner._id || partner.partner_email || index
                  }
                  className="hover:shadow-md transition-all border-none bg-white/60 backdrop-blur-sm"
                >
                  <CardContent className="px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 truncate max-w-[120px] 2xl:max-w-[150px]">
                          {partner.partner_email}
                        </p>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {partner.status === "active" ? (
                              <div className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                <UserCheck className="h-2.5 w-2.5 mr-0.5" />
                                Connected
                              </div>
                            ) : (
                              <div className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                <Clock className="h-2.5 w-2.5 mr-0.5" />
                                Pending
                              </div>
                            )}
                            <span className="text-[10px] text-gray-400">
                              {new Date(
                                partner.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full border-dashed border-2 bg-transparent">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      No support partners
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-primary color-primary hover:bg-primary/5"
                    onClick={() => setIsInviteDialogOpen(true)}
                  >
                    Invite Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Screening History Table - Occupies full width at the bottom */}
      <div className="w-full min-w-0 overflow-hidden pb-10">
        <ScreeningHistory columns={columns} data={screeningHistory} />
      </div>
    </div>
  );
}
