import { useState } from "react";
import { Star, CheckCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { motion } from "motion/react";
import { renderStars, simulateFileUpload } from "../../utils/reviewHelpers";
import { ReviewSubmission } from "../../types";

interface ReviewSubmissionFormProps {
  onSubmit: (review: ReviewSubmission) => void;
  isSubmitting: boolean;
}

export function ReviewSubmissionForm({ onSubmit, isSubmitting }: ReviewSubmissionFormProps) {
  const [step, setStep] = useState(1);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<ReviewSubmission>({
    productId: 1,
    rating: 0,
    title: '',
    content: '',
    images: [],
    videos: [],
    userName: '',
    userLocation: ''
  });

  const handleImageUpload = async (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - formData.images.length);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      await simulateFileUpload(setUploadProgress);
    }
  };

  const handleVideoUpload = (files: FileList | null) => {
    if (files) {
      const newVideos = Array.from(files).slice(0, 2 - formData.videos.length);
      setFormData(prev => ({ ...prev, videos: [...prev.videos, ...newVideos] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const handleStarClick = (star: number) => {
    setFormData(prev => ({ ...prev, rating: star }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const steps = [
    { number: 1, title: "Rate" },
    { number: 2, title: "Media" },
    { number: 3, title: "Write" }
  ];

  return (
    <div className="space-y-6">
      {/* Step Progress */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((stepItem) => (
          <div key={stepItem.number} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepItem.number 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step > stepItem.number ? <CheckCircle className="h-4 w-4" /> : stepItem.number}
            </div>
            {stepItem.number < steps.length && (
              <div className={`w-12 h-0.5 mx-2 ${
                step > stepItem.number ? 'bg-orange-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Rating */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center space-y-6"
        >
          <div>
            <h3 className="font-heading text-lg mb-2">Rate this product</h3>
            <p className="text-gray-600 mb-6">How would you rate your overall experience?</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {renderStars(hoveredStar || formData.rating, true).map((star) => (
                <Star
                  key={star.id}
                  className={star.className}
                  onClick={() => handleStarClick(star.id)}
                  onMouseEnter={() => setHoveredStar(star.id)}
                  onMouseLeave={() => setHoveredStar(0)}
                />
              ))}
            </div>
            
            {formData.rating > 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-orange-600 font-medium"
              >
                {formData.rating === 5 ? 'Excellent!' : 
                 formData.rating === 4 ? 'Great!' :
                 formData.rating === 3 ? 'Good' :
                 formData.rating === 2 ? 'Fair' : 'Poor'}
              </motion.p>
            )}
          </div>
          
          <Button
            onClick={() => setStep(2)}
            disabled={formData.rating === 0}
            className="btn-moema-gradient-orange btn-moema-rounded-lg disabled:opacity-50"
          >
            Continue
          </Button>
        </motion.div>
      )}

      {/* Step 2: Media Upload */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="font-heading text-lg mb-2">Add photos or videos</h3>
            <p className="text-gray-600 mb-4">Help other customers by sharing your experience</p>
            
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Photos (up to 5)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="material-icons text-gray-400">camera_alt</span>
                    </div>
                    <p className="text-gray-600">Click to upload images</p>
                  </div>
                </label>
              </div>
              
              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(1)}
              className="btn-moema-secondary btn-moema-rounded-lg flex-1"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="btn-moema-gradient-orange btn-moema-rounded-lg flex-1"
            >
              Continue
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Written Review */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="font-heading text-lg mb-2">Tell us about your experience</h3>
            <p className="text-gray-600 mb-4">Share details that would be helpful for other customers</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <Input
                  placeholder="Summarize your review in one line"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <Textarea
                  placeholder="Share your experience with this product..."
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.content.length}/500 characters
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <Input
                    placeholder="Your name"
                    value={formData.userName}
                    onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location (Optional)</label>
                  <Input
                    placeholder="City, Country"
                    value={formData.userLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, userLocation: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(2)}
              className="btn-moema-secondary btn-moema-rounded-lg flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.content || !formData.userName || isSubmitting}
              className="btn-moema-gradient-orange btn-moema-rounded-lg flex-1 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}