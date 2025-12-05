"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!email || !password) {
      setLocalError("Veuillez remplir tous les champs");
      return;
    }

    const success = await login(email, password);
    console.log(success)
    if (success) {
      router.push("/dashboard");
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6 gap-3">
          <div className="h-10 w-10 rounded-md bg-white flex items-center justify-center shadow-sm overflow-hidden">
            <Image
              src="/logo.png"
              alt="Domaine Bini"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Domaine Bini</h1>
            <p className="text-xs text-slate-500">Tableau de bord écotourisme</p>
          </div>
        </div>

        {/* Card connexion */}
        <Card className="border-slate-200 shadow-sm">
          <div className="px-6 pt-6 pb-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Connexion
            </h2>
            <p className="text-xs text-slate-500">
              Accédez à votre espace de pilotage.
            </p>
          </div>

          <div className="px-6 pb-6">
            {displayError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-xs text-red-700 ml-1.5">
                  {displayError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Adresse email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pdg@domainebini.ci"
                  className="h-9 text-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Mot de passe
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-9 text-sm"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 text-sm font-medium bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            {/* Bloc démo */}
            <div className="mt-5 rounded-md bg-slate-50 border border-dashed border-slate-300 px-3 py-2.5">
              <p className="text-xs font-semibold text-slate-700 mb-1.5">
                Identifiants de démonstration
              </p>
              <div className="space-y-0.5 text-[11px] text-slate-600">
                <p>
                  <span className="font-medium">PDG :</span> pdg@domainebini.ci / admin123
                </p>
                <p>
                  <span className="font-medium">Coordinateur :</span> coordinator@domainebini.ci / admin123
                </p>
              </div>
            </div>
          </div>
        </Card>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          © 2025 Domaine Bini · Tableau de bord interne
        </p>
      </div>
    </div>
  );
}
