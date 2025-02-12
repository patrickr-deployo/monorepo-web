"use client"

import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Typography } from "@package/ui/typography"
import { Progress } from "@package/ui/progress"

type UploadStatus = "idle" | "uploading" | "success" | "error"

type FileUploadProps = {
  onUpload: (file: File) => void
}

const simulateUpload = (file: File): Promise<void> => {
  // Calculate upload time based on file size (1MB = 1 second, min 2s, max 5s)
  const uploadTime = Math.min(Math.max(file.size / (1024 * 1024) * 1000, 2000), 5000)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, uploadTime)
  })
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploadStatus("uploading")
    setErrorMessage("")
    setUploadProgress(0)

    // Calculate progress increment based on file size
    // Larger files will have smaller increments for smoother progress
    const incrementSize = Math.max(1, Math.min(5, 100 / (file.size / (100 * 1024))))

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + incrementSize
      })
    }, 100)

    try {
      await simulateUpload(file)
      setUploadProgress(100)
      setUploadStatus("success")
      onUpload(file)
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Upload failed")
    } finally {
      clearInterval(progressInterval)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: uploadStatus === "uploading",
    accept: {
      'application/octet-stream': ['.pt', '.pth', '.onnx', '.pb', '.h5', '.keras', '.pkl', '.joblib'],
    }
  })

  const renderContent = () => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <div className="mt-4 space-y-4 w-full max-w-md">
            <Typography variant="body" className="text-center">Uploading model...</Typography>
            <Progress value={uploadProgress} />
          </div>
        )
      case "success":
        return (
          <div className="mt-4 space-y-2 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <Typography variant="body">Upload complete!</Typography>
          </div>
        )
      case "error":
        return (
          <div className="mt-4 space-y-2 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <Typography variant="body" className="text-red-500">{errorMessage}</Typography>
            <Typography variant="small" className="text-muted-foreground">
              Click or drag to try again
            </Typography>
          </div>
        )
      default:
        return (
          <div className="mt-4 space-y-2 text-center max-w-md">
            <Typography variant="body" className="text-center">
              {isDragActive ? "Drop your model here" : "Drag & drop your model here"}
            </Typography>
            <Typography variant="muted" className="text-muted-foreground text-center">
              Supports PyTorch (.pt, .pth), ONNX (.onnx), TensorFlow (.pb), 
              Keras (.h5, .keras), and Scikit-learn (.pkl, .joblib)
            </Typography>
          </div>
        )
    }
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 
        transition-colors duration-200 ease-in-out
        cursor-pointer text-center min-h-[200px]
        flex flex-col items-center justify-center
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
        ${uploadStatus === "uploading" ? 'pointer-events-none' : 'hover:border-primary hover:bg-primary/5'}
        ${uploadStatus === "success" ? 'border-green-500' : ''}
        ${uploadStatus === "error" ? 'border-red-500' : ''}
      `}
    >
      <input {...getInputProps()} />
      {uploadStatus === "idle" && (
        <UploadCloud className="h-12 w-12 text-muted-foreground" />
      )}
      {renderContent()}
    </div>
  )
} 