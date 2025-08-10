import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { useNavigate } from "react-router";

const PendingApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Awaiting Approval</CardTitle>
            <CardDescription>
              Your supervisor account is pending admin approval. You will gain
              full access once approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => navigate("/login")}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default PendingApprovalPage;
