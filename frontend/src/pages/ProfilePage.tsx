import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, GraduationCap, Building, IdCard } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  
  console.log("ProfilePage -> current user from AuthContext:", user);

  const fullName = user?.name || "User";
  const studentId = user?.userId || "N/A";
  const email = user?.email;

  const [editorImageSrc, setEditorImageSrc] = useState<string | null>(null);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displayDims, setDisplayDims] = useState({ w: 256, h: 256 });
  const [isUploading, setIsUploading] = useState(false);
  const [isTestingVerification, setIsTestingVerification] = useState(false);

  useEffect(() => {
    if (isWebcamOpen && webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [isWebcamOpen, webcamStream]);

  const startWebcam = () => {
    console.log("startWebcam -> Requesting webcam access");
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        console.log("startWebcam -> Access granted, assigning stream");
        setWebcamStream(stream);
        setIsWebcamOpen(true);
      })
      .catch((error) => {
        console.error("startWebcam -> Failed to open webcam:", error);
        alert("Could not access your camera. Please ensure permissions are granted.");
        setIsTestingVerification(false);
      });
  };

  const startTestingVerification = () => {
    console.log("startTestingVerification -> Activating webcam for testing match");
    setIsTestingVerification(true);
    startWebcam();
  };

  const stopWebcam = () => {
    console.log("stopWebcam -> Stopping camera stream tracks");
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
    setIsWebcamOpen(false);
  };

  const capturePhoto = () => {
    console.log("capturePhoto -> Capturing frame from stream");
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, 640, 480);
        const dataUrl = canvas.toDataURL("image/png");
        console.log("capturePhoto -> Frame captured, opening editor");
        setEditorImageSrc(dataUrl);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        
        const img = new Image();
        img.onload = () => {
          const aspect = img.width / img.height;
          let w = 256;
          let h = 256;
          if (aspect > 1) {
            w = 256 * aspect;
          } else {
            h = 256 / aspect;
          }
          setDisplayDims({ w, h });
        };
        img.src = dataUrl;
      }
      stopWebcam();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("handleFileSelect -> No file chosen");
      return;
    }
    console.log("handleFileSelect -> File chosen:", file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setEditorImageSrc(dataUrl);
      setZoom(1);
      setPosition({ x: 0, y: 0 });

      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        let w = 256;
        let h = 256;
        if (aspect > 1) {
          w = 256 * aspect;
        } else {
          h = 256 / aspect;
        }
        setDisplayDims({ w, h });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleVerifyFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("handleVerifyFileSelect -> No file chosen");
      return;
    }
    console.log("handleVerifyFileSelect -> Verification file chosen:", file.name);
    setIsTestingVerification(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setEditorImageSrc(dataUrl);
      setZoom(1);
      setPosition({ x: 0, y: 0 });

      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        let w = 256;
        let h = 256;
        if (aspect > 1) {
          w = 256 * aspect;
        } else {
          h = 256 / aspect;
        }
        setDisplayDims({ w, h });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log("handlePointerDown -> Start dragging image");
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handlePointerUp = () => {
    console.log("handlePointerUp -> Stop dragging image");
    setIsDragging(false);
  };

  const handleCropAndUpload = async () => {
    if (!editorImageSrc) return;
    console.log("handleCropAndUpload -> Drawing cropped circle on high-res canvas");
    setIsUploading(true);

    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const factor = 400 / 256;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 400, 400);
        ctx.save();
        ctx.translate(200, 200);
        ctx.scale(zoom, zoom);
        ctx.translate((position.x * factor) / zoom, (position.y * factor) / zoom);
        ctx.drawImage(
          img,
          (-displayDims.w * factor) / 2,
          (-displayDims.h * factor) / 2,
          displayDims.w * factor,
          displayDims.h * factor
        );
        ctx.restore();

        canvas.toBlob(async (blob) => {
          if (!blob) {
            console.error("handleCropAndUpload -> Error producing PNG blob");
            setIsUploading(false);
            return;
          }

          const file = new File([blob], "profile.png", { type: "image/png" });
          const formData = new FormData();
          formData.append("file", file);

          console.log("handleCropAndUpload -> Uploading PNG to backend");
          try {
            const response = await fetch("http://localhost:3000/biometric/upload-photo", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`,
              },
              body: formData,
            });

            console.log("handleCropAndUpload -> Upload response status:", response.status);
            if (response.ok) {
              const data = await response.json();
              console.log("handleCropAndUpload -> Upload data:", data);
              if (data.avatarUrl) {
                updateUser({ avatarUrl: data.avatarUrl });
                setEditorImageSrc(null);
              }
            } else {
              const err = await response.text();
              console.error("handleCropAndUpload -> Failed. Response:", err);
            }
          } catch (error) {
            console.error("handleCropAndUpload -> Network error:", error);
          } finally {
            setIsUploading(false);
          }
        }, "image/png");
      }
    };
    img.src = editorImageSrc;
  };

  const handleCropAndVerify = async () => {
    if (!editorImageSrc) return;
    console.log("handleCropAndVerify -> Generating high-res verification canvas crop");
    setIsUploading(true);

    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const factor = 400 / 256;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 400, 400);
        ctx.save();
        ctx.translate(200, 200);
        ctx.scale(zoom, zoom);
        ctx.translate((position.x * factor) / zoom, (position.y * factor) / zoom);
        ctx.drawImage(
          img,
          (-displayDims.w * factor) / 2,
          (-displayDims.h * factor) / 2,
          displayDims.w * factor,
          displayDims.h * factor
        );
        ctx.restore();

        canvas.toBlob(async (blob) => {
          if (!blob) {
            console.error("handleCropAndVerify -> Failed to create PNG Blob");
            setIsUploading(false);
            return;
          }

          const file = new File([blob], "verify.png", { type: "image/png" });
          const formData = new FormData();
          formData.append("file", file);

          console.log("handleCropAndVerify -> Sending comparison request");
          try {
            const response = await fetch("http://localhost:3000/biometric/verify-face", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${user?.token || localStorage.getItem("token")}`,
              },
              body: formData,
            });

            console.log("handleCropAndVerify -> Verification status:", response.status);
            const data = await response.json();
            console.log("handleCropAndVerify -> Verification Response payload:", data);
            
            if (data.match) {
              console.log("PHOTOS MATCH! Confidence distance:", data.distance);
              alert(`MATCH SUCCESS! Similarity Confidence: ${Math.round((1 - data.distance) * 100)}% Match.`);
            } else {
              console.log("PHOTOS DO NOT MATCH! Confidence distance:", data.distance);
              alert(`MATCH FAILED! Photos do not match. Similarity: ${Math.round((1 - data.distance) * 100)}% Match.`);
            }

            setEditorImageSrc(null);
          } catch (error) {
            console.error("handleCropAndVerify -> Network error:", error);
            alert("An error occurred during verification.");
          } finally {
            setIsUploading(false);
            setIsTestingVerification(false);
          }
        }, "image/png");
      }
    };
    img.src = editorImageSrc;
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <header className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-3xl items-center font-normal text-slate-700 dark:text-slate-100 tracking-tight">Profile</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-md md:col-span-1 border-t-4 border-t-[#009FE3] dark:border-t-[#009FE3]">
          <CardContent className="pt-8 flex flex-col items-center justify-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-white dark:border-slate-800 shadow-sm">
              <AvatarImage src={user?.avatarUrl ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:3000${user.avatarUrl}`) : ""} className="object-cover" />
              <AvatarFallback className="bg-[#009FE3] text-white text-4xl">
                {fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{fullName}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">ID: {studentId}</p>
            
            <div className="mt-6 w-full flex flex-col gap-3">
              <input 
                type="file" 
                id="profile-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileSelect}
              />
              <label 
                htmlFor="profile-upload" 
                className="flex items-center justify-center w-full h-10 px-4 py-2 bg-[#009FE3] text-white rounded-md hover:bg-[#008bc6] cursor-pointer transition-colors text-sm font-medium"
              >
                Upload Profile Photo
              </label>
              <Button 
                onClick={startWebcam}
                variant="outline"
                className="w-full h-10 border-[#009FE3] text-[#009FE3] hover:bg-[#009FE3]/10"
              >
                Take Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-md md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-normal text-slate-700 dark:text-slate-100 flex items-center gap-2">
              <IdCard className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              Personal Information
            </CardTitle>
            <CardDescription className="dark:text-slate-400">Your personal details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <p className="text-slate-800 dark:text-slate-200 mt-1 pl-6">{fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <p className="text-slate-800 dark:text-slate-200 mt-1 pl-6">{email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Role
                </label>
                <p className="text-slate-800 dark:text-slate-200 mt-1 pl-6 capitalize">{user?.role || "Student"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Building className="w-4 h-4" /> Campus
                </label>
                <p className="text-slate-800 dark:text-slate-200 mt-1 pl-6">BINUS University</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">AI Face Verification Testing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Test the AI model comparison. You can take a live photo or upload a file to match against your current profile photo.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="file" 
                  id="verify-file-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleVerifyFileSelect}
                />
                <label 
                  htmlFor="verify-file-upload"
                  className={`flex items-center justify-center h-10 px-4 py-2 border border-[#009FE3] text-[#009FE3] rounded-md hover:bg-[#009FE3]/10 cursor-pointer transition-colors text-sm font-medium ${!user?.avatarUrl ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Verify via File Upload
                </label>
                <Button 
                  onClick={startTestingVerification}
                  className="bg-[#009FE3] hover:bg-[#008bc6] text-white h-10"
                  disabled={!user?.avatarUrl}
                >
                  Verify via Webcam
                </Button>
              </div>
              {!user?.avatarUrl && (
                <p className="text-xs text-red-500 mt-1 font-medium">Please upload a profile photo first to enable AI testing.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isWebcamOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold tracking-tight mb-4 text-slate-100">Take Profile Photo</h2>
            
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#009FE3] shadow-md relative bg-slate-950 flex items-center justify-center mb-6">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            <div className="flex gap-3 w-full">
              <Button 
                onClick={stopWebcam}
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={capturePhoto}
                className="flex-1 bg-[#009FE3] hover:bg-[#008bc6] text-white font-semibold"
              >
                Capture
              </Button>
            </div>
          </div>
        </div>
      )}

      {editorImageSrc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold tracking-tight mb-2 text-slate-100">{isTestingVerification ? "Align & Verify" : "Crop & Position"}</h2>
            <p className="text-xs text-slate-400 mb-6 text-center">Drag the photo to align and use the slider to zoom.</p>
            
            <div 
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#009FE3] shadow-md relative bg-slate-950 flex items-center justify-center mb-6 cursor-move select-none touch-none"
            >
              <img 
                src={editorImageSrc}
                draggable={false}
                style={{
                  width: displayDims.w,
                  height: displayDims.h,
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  maxWidth: "none"
                }}
                className="select-none pointer-events-none"
              />
            </div>
            
            <div className="w-full mb-6 flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-400 px-1 font-medium">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#009FE3]"
              />
            </div>
            
            <div className="flex gap-3 w-full">
              <Button 
                onClick={() => {
                  console.log("Crop modal -> Exit");
                  setEditorImageSrc(null);
                  setIsTestingVerification(false);
                }}
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                disabled={isUploading}
              >
                Exit
              </Button>
              <Button 
                onClick={isTestingVerification ? handleCropAndVerify : handleCropAndUpload}
                className="flex-1 bg-[#009FE3] hover:bg-[#008bc6] text-white font-semibold"
                disabled={isUploading}
              >
                {isUploading ? (isTestingVerification ? "Verifying..." : "Uploading...") : (isTestingVerification ? "Verify" : "Save Photo")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}