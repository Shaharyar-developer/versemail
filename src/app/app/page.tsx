"use client";
import { Button } from "@/components/ui/button";
export default function Page() {
  return (
    <>
      App Currently In Devleopment{" "}
      <Button onClick={() => (window.location.href = "/api/auth/google")}>
        Login to continue
      </Button>
    </>
  );
}
