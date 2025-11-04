// Tour steps configuration
const TOUR_STEPS = [
  {
    id: "welcome",
    target: null,
    title: "Welcome to Your Dashboard! 👋",
    content:
      "Let's take a quick tour to help you get started. We'll show you the key features and how to navigate the dashboard effectively.",
    placement: "center",
  },
  {
    id: "stats",
    target: "stats-grid",
    title: "Quick Stats Overview",
    content:
      "These cards show your key metrics at a glance: pending requests, total residents, completed tasks, and recent activity. They update in real-time!",
    placement: "bottom",
  },
  {
    id: "chart",
    target: "requests-chart",
    title: "Weekly Requests Trends",
    content:
      "Track request patterns over the week. This helps you identify busy periods and plan your workflow accordingly.",
    placement: "top",
  },
  {
    id: "actions",
    target: "quick-actions",
    title: "Quick Actions",
    content:
      "Access frequently used features with one click. Manage requests, update resident information, or generate reports instantly.",
    placement: "top",
  },
  {
    id: "activity",
    target: "recent-activity",
    title: "Recent Activity Feed",
    content:
      "Stay updated with the latest actions and changes. Monitor registrations, approvals, and system updates in real-time.",
    placement: "top",
  },
  {
    id: "complete",
    target: null,
    title: "You're All Set! 🎉",
    content:
      "You can restart this tour anytime by clicking the help icon in the navigation bar. Feel free to explore and reach out if you need assistance!",
    placement: "center",
  },
];


// Tour Tooltip Component
const TourTooltip = ({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onComplete,
}) => {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const isCentered = step.placement === "center";

  if (isCentered) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 animate-in fade-in zoom-in duration-300">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {step.title}
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              {step.content}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500 font-medium">
              {currentStep + 1} of {totalSteps}
            </div>
            <div className="flex gap-3">
              {!isLast && (
                <button
                  onClick={onSkip}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Skip Tour
                </button>
              )}
              <button
                onClick={isLast ? onComplete : onNext}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg"
              >
                {isLast ? "Get Started" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-2xl p-5 max-w-sm border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
      <button
        onClick={onSkip}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <XIcon className="w-4 h-4" />
      </button>

      <h3 className="text-lg font-bold text-slate-900 mb-2 pr-6">
        {step.title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">
        {step.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500 font-medium">
          Step {currentStep + 1} of {totalSteps}
        </div>
        <div className="flex gap-2">
          {!isFirst && (
            <button
              onClick={onPrev}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Back
            </button>
          )}
          <button
            onClick={isLast ? onComplete : onNext}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            {isLast ? "Finish" : "Next"}
            {!isLast && <ChevronRightIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// Tour Highlight Component
const TourHighlight = ({ targetId }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!targetId) return;

    const updatePosition = () => {
      const element = document.getElementById(targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top - 4,
          left: rect.left - 4,
          width: rect.width + 8,
          height: rect.height + 8,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [targetId]);

  if (!position) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 pointer-events-none" />

      {/* Highlight ring */}
      <div
        className="fixed z-40 pointer-events-none"
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
        }}
      >
        <div className="absolute inset-0 rounded-lg ring-4 ring-white shadow-2xl animate-pulse" />
        <div className="absolute inset-0 rounded-lg bg-white/5" />
      </div>
    </>
  );
};