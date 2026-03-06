"use client"
import React, { useRef, useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { DatePicker } from "antd"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

interface DurationPickerProps {
  value: string;
  onChange: (val: string) => void;
}

export function DurationPicker({ value, onChange }: DurationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      // If less than 400px below and more space above, flip to top
      if (spaceBelow < 400 && spaceAbove > spaceBelow) {
        setPosition('top')
      } else {
        setPosition('bottom')
      }

      // Smooth scroll if needed
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isOpen])

  const parts = value.split(" - ")
  const startPart = parts[0]?.trim() || ""
  const endPart = parts[1]?.trim() || ""
  
  const isPresent = endPart === "Present" || endPart === "Current"
  
  // Safe parsing helper
  const parseDate = (str: string) => {
    if (!str || str === "Present" || str === "Current") return null
    const d = dayjs(str, "MMM YYYY")
    return d.isValid() ? d : null
  }

  const startDayjs = parseDate(startPart)
  const endDayjs = isPresent ? null : parseDate(endPart)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // Don't close if clicking inside the antd date picker dropdown
        const target = e.target as HTMLElement
        if (target.closest('.ant-picker-dropdown')) return
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleStartChange = (date: dayjs.Dayjs | null) => {
    const startStr = date && date.isValid() ? date.format("MMM YYYY") : ""
    const currentEndStr = isPresent ? "Present" : (endDayjs && endDayjs.isValid() ? endDayjs.format("MMM YYYY") : "")
    onChange(startStr || currentEndStr ? `${startStr} - ${currentEndStr}` : "")
  }

  const handleEndChange = (date: dayjs.Dayjs | null) => {
    const startStr = startDayjs && startDayjs.isValid() ? startDayjs.format("MMM YYYY") : ""
    const endStr = date && date.isValid() ? date.format("MMM YYYY") : ""
    onChange(startStr || endStr ? `${startStr} - ${endStr}` : "")
  }

  const togglePresent = () => {
    const startStr = startDayjs && startDayjs.isValid() ? startDayjs.format("MMM YYYY") : ""
    const nextIsPresent = !isPresent
    const endStr = nextIsPresent ? "Present" : ""
    onChange(startStr || endStr ? `${startStr} - ${endStr}` : "")
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          fontSize: "12px",
          color: "#7c3aed",
          fontWeight: 700,
          background: "rgba(124, 58, 237, 0.05)",
          border: "1px dashed #7c3aed",
          padding: "2px 8px",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          height: "28px",
          width: "auto",
          minWidth: "120px",
          justifyContent: "space-between"
        }}
      >
        <span>{value || "Select Duration"}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          [position === 'top' ? 'bottom' : 'top']: "100%",
          left: 0,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #e5e2f0",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          padding: "16px",
          width: "280px",
          marginTop: position === 'bottom' ? "8px" : "0",
          marginBottom: position === 'top' ? "8px" : "0",
        }}>
          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontSize: "9px", fontWeight: 800, color: "#9ca3af", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Start Date</p>
            <DatePicker 
              picker="month"
              value={startDayjs}
              onChange={handleStartChange}
              format="MMM YYYY"
              style={{ width: "100%" }}
              placeholder="Select month"
              allowClear={false}
            />
          </div>
          
          <div style={{ marginBottom: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <p style={{ fontSize: "9px", fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>End Date</p>
              <button
                type="button"
                onClick={togglePresent}
                style={{
                  fontSize: "8px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "4px",
                  border: "none",
                  background: isPresent ? "#7c3aed" : "rgba(124, 58, 237, 0.1)",
                  color: isPresent ? "#fff" : "#7c3aed",
                  cursor: "pointer",
                  textTransform: "uppercase"
                }}
              >
                Present
              </button>
            </div>
            {!isPresent && (
              <DatePicker 
                picker="month"
                value={endDayjs}
                onChange={handleEndChange}
                format="MMM YYYY"
                style={{ width: "100%" }}
                placeholder="Select month"
                allowClear={false}
              />
            )}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: "100%",
              padding: "8px",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              marginTop: "4px"
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
