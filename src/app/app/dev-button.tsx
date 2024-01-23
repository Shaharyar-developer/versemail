"use client";
import { Button } from "@/components/ui/button";

export default function DevButton() {
  return (
    <>
      App Currently In Devleopment
      <Button onClick={() => (window.location.href = "/api/auth/google")}>
        Login to continue
      </Button>
      If you have already logged in.
      <Button onClick={() => (window.location.href = "/")}>
        Click here to continue
      </Button>
    </>
  );
}
