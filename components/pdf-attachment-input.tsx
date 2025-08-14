"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, File, X } from "lucide-react"

interface PdfAttachmentInputProps {
  newJob?: any
  errors?: any
  itemVariants?: any
  setNewJob?: (job: any) => void
  setErrors?: (errors: any) => void
}

export function PdfAttachmentInput({ itemVariants = {}, newJob = {}, setNewJob = () => {}, setErrors = () => {}, errors = {}, }: PdfAttachmentInputProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.type !== "application/pdf") {
        setErrors({ attachment: { message: "Please select a PDF file only" } })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrors({ attachment: { message: "File size must be less than 10MB" } })
        return
      }

      setErrors({})
      setNewJob({ ...newJob, attachment: file })
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const removeFile = () => {
    setNewJob({ ...newJob, attachment: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const currentAttachment = newJob?.attachment || null
  const attachmentError = errors?.attachment || null

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-1 gap-6">
      <div className="space-y-2">
        <div className={`relative border-0 border-b-2 transition-colors duration-200 ${ dragActive ? "border-nursery bg-nursery/5" : attachmentError ? "border-red-300" : "border-gray-300 hover:border-nursery/60" }`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} >
          <input ref={fileInputRef} id="attachment" type="file" accept=".pdf,application/pdf" onChange={handleInputChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          {currentAttachment ? (
            <div className="flex items-center justify-between py-3 px-0">
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentAttachment.name}</p>
                  <p className="text-xs text-gray-500">{(currentAttachment.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button type="button" onClick={removeFile} className="p-1 hover:bg-gray-100 rounded-full transition-colors" > <X className="h-4 w-4 text-gray-500" /> </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 py-3 px-0 text-gray-500">
              <Upload className="h-5 w-5" />
              <div className="flex-1">
                <p className="text-sm"> <span className="font-medium text-nursery cursor-pointer hover:text-nursery/80">Click to upload</span> or drag and drop if required </p>
                <p className="text-xs text-gray-400">PDF files only (max 10MB)</p>
              </div>
            </div>
          )}
        </div>

        {attachmentError && <p className="text-red-500 text-xs mt-1">{attachmentError.message}</p>}
      </div>
    </motion.div>
  )
}
