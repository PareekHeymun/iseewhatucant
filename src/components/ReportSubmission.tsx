import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Camera, MapPin, Mic, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReportSubmissionProps {
  onSubmit: (report: any) => void;
  onBack: () => void;
}

export function ReportSubmission({ onSubmit, onBack }: ReportSubmissionProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Get user's location automatically
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('success');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('error');
          // Set default location (example: City Hall)
          setLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceNote('Voice note recorded (mock)');
    } else {
      setIsRecording(true);
      // Mock recording - in real app would use MediaRecorder API
      setTimeout(() => {
        setIsRecording(false);
        setVoiceNote('Voice note recorded (mock)');
      }, 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !title || !location) return;

    setIsSubmitting(true);

    const report = {
      id: Date.now().toString(),
      title,
      description,
      category,
      location,
      photo,
      voiceNote,
      status: 'submitted',
      priority: category === 'emergency' ? 'high' : category === 'infrastructure' ? 'medium' : 'low',
      createdAt: new Date().toISOString(),
      userId: '1', // Mock user ID
      ward: Math.floor(Math.random() * 10) + 1 // Mock ward assignment
    };

    // Mock API call
    setTimeout(() => {
      onSubmit(report);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
            ← Back
          </Button>
          <h1 className="mt-2">Report Issue</h1>
          <p className="text-muted-foreground">Help improve your community by reporting civic issues</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Location</span>
                {locationStatus === 'loading' && (
                  <Badge variant="outline">Getting location...</Badge>
                )}
                {locationStatus === 'success' && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Auto-captured
                  </Badge>
                )}
                {locationStatus === 'error' && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Using default
                  </Badge>
                )}
              </div>
              {location && (
                <p className="text-sm text-muted-foreground mt-2">
                  GPS: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Category */}
          <div className="space-y-2">
            <label>Category *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="sanitation">Sanitation</SelectItem>
                <SelectItem value="safety">Public Safety</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
                <SelectItem value="traffic">Traffic & Transport</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label>Issue Title *</label>
            <Input
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label>Description</label>
            <Textarea
              placeholder="Provide more details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label>Photo</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              {photo ? (
                <div className="space-y-2">
                  <ImageWithFallback 
                    src={photo} 
                    alt="Issue photo" 
                    className="w-full h-32 object-cover rounded-lg" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPhoto(null)}
                  >
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Tap to add photo</p>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Voice Note */}
          <div className="space-y-2">
            <label>Voice Note</label>
            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              className="w-full"
              onClick={handleVoiceRecord}
            >
              <Mic className="w-4 h-4 mr-2" />
              {isRecording ? 'Recording... (Tap to stop)' : voiceNote ? 'Re-record voice note' : 'Add voice note'}
            </Button>
            {voiceNote && !isRecording && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Voice note ready</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !category || !title || !location}
          >
            {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Reports are automatically routed to the appropriate department based on category and location.
          </p>
        </form>
      </div>
    </div>
  );
}