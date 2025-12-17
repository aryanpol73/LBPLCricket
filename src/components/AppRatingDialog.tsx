import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AppRatingDialogProps {
  open: boolean;
  onClose: () => void;
}

const AppRatingDialog = ({ open, onClose }: AppRatingDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [existingRating, setExistingRating] = useState<number | null>(null);

  // Get unique user identifier
  const getUserIdentifier = () => {
    let identifier = localStorage.getItem("lbpl_user_identifier");
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("lbpl_user_identifier", identifier);
    }
    return identifier;
  };

  // Check if user has already rated
  useEffect(() => {
    if (open) {
      checkExistingRating();
    }
  }, [open]);

  const checkExistingRating = async () => {
    const userIdentifier = getUserIdentifier();
    const { data, error } = await supabase
      .from("app_ratings")
      .select("rating, feedback")
      .eq("user_identifier", userIdentifier)
      .maybeSingle();

    if (data && !error) {
      setHasRated(true);
      setExistingRating(data.rating);
      setRating(data.rating);
      setFeedback(data.feedback || "");
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    const userIdentifier = getUserIdentifier();

    try {
      if (hasRated) {
        // Update existing rating
        const { error } = await supabase
          .from("app_ratings")
          .update({
            rating,
            feedback: feedback.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("user_identifier", userIdentifier);

        if (error) throw error;
      } else {
        // Insert new rating
        const { error } = await supabase.from("app_ratings").insert({
          user_identifier: userIdentifier,
          rating,
          feedback: feedback.trim() || null,
        });

        if (error) throw error;
      }

      setSubmitted(true);
      localStorage.setItem("lbpl_app_rated", "true");
      
      // Close after showing thank you message
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setRating(0);
        setFeedback("");
        setHasRated(false);
        setExistingRating(null);
      }, 2000);
    } catch (error: any) {
      console.error("Rating error:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        className="bg-[#0b1c3d] border border-[#f0b429]/30 rounded-2xl p-6 max-w-sm w-full"
        style={{ animation: "slideInUp 0.3s ease-out" }}
      >
        {submitted ? (
          // Thank you message
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-[#f0b429]/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">❤️</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Thanks for rating LBPL App ❤️
            </h3>
            <p className="text-gray-400 text-sm">
              Your feedback helps us improve!
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {hasRated ? "Update Your Rating" : "Rate LBPL App"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={36}
                    className={`transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-[#f0b429] text-[#f0b429]"
                        : "text-gray-500"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Rating text */}
            <p className="text-center text-gray-400 text-sm mb-4">
              {rating === 0 && "Tap a star to rate"}
              {rating === 1 && "Poor 😞"}
              {rating === 2 && "Fair 😐"}
              {rating === 3 && "Good 🙂"}
              {rating === 4 && "Great 😊"}
              {rating === 5 && "Excellent! 🎉"}
            </p>

            {/* Feedback input (shown after rating) */}
            {rating > 0 && (
              <div className="mb-6">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Any feedback? (optional)"
                  maxLength={500}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f0b429]/50 resize-none"
                />
                <p className="text-right text-xs text-gray-500 mt-1">
                  {feedback.length}/500
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0}
              className="w-full bg-[#f0b429] text-[#0b1c3d] font-semibold py-3 rounded-xl hover:bg-[#f0b429]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0b1c3d]/30 border-t-[#0b1c3d] rounded-full animate-spin" />
              ) : hasRated ? (
                "Update Rating"
              ) : (
                "Submit Rating"
              )}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AppRatingDialog;
