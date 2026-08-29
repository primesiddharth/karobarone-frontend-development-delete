"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuestionnaireProvider } from "@/context/questionnaire-context";
import { QuestionnaireLayout } from "@/components/questionaree/questionnaire-layout";
import { useAuth } from "@/context/auth-context";
import "./questionnaire.css";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Checking your session...
      </div>
    );
  }

  return (
    <div className="questionnaire-root">
      <QuestionnaireProvider>
        <QuestionnaireLayout />
      </QuestionnaireProvider>
    </div>
  );
}
