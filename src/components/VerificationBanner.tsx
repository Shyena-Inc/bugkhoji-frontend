import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context";

const VerificationBanner = () => {
  const { user } = useAuth();

  // Only show for organization users
  if (user?.role !== 'ORGANIZATION') return null;

  const verificationStatus = user?.verificationStatus || 'pending';
  const isVerified = user?.verified === true;

  // Don't show banner if already verified
  if (isVerified) return null;

  // Configuration for different verification states
  const statusConfig = {
    pending: {
      icon: Clock,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      title: "Verification Pending",
      message: "Your organization verification is pending review. You can use all features, but your programs won't be visible to researchers until verified.",
      linkText: "View Verification Status",
      linkTo: "/organization/verification-status",
    },
    rejected: {
      icon: XCircle,
      iconColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      title: "Verification Rejected",
      message: "Your organization verification was rejected. Please review the feedback and resubmit your documents.",
      linkText: "Resubmit Documents",
      linkTo: "/organization/verification-status",
    },
    submitted: {
      icon: Clock,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      title: "Documents Submitted",
      message: "Your verification documents have been submitted and are under review. We'll notify you once the review is complete.",
      linkText: "View Status",
      linkTo: "/organization/verification-status",
    },
  };

  const config = statusConfig[verificationStatus] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Alert className={`mb-6 ${config.bgColor} ${config.borderColor} border-l-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
        <div className="flex-1">
          <div className="font-semibold text-slate-900 dark:text-white mb-1">
            {config.title}
          </div>
          <AlertDescription className="text-slate-700 dark:text-slate-300">
            {config.message}
          </AlertDescription>
        </div>
        <Link to={config.linkTo}>
          <Button 
            variant="outline" 
            size="sm"
            className="whitespace-nowrap"
          >
            {config.linkText}
          </Button>
        </Link>
      </div>
    </Alert>
  );
};

export default VerificationBanner;
