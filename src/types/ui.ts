import React from "react";
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface TestProvidersProps {
  children: React.ReactNode;
}

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type ToasterProps = Record<string, unknown>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export type ToastProps = Record<string, unknown>;
export type ToastActionElement = React.ReactElement;
