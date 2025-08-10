/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useImageUpload } from "@/hooks/useImageUpload";
import {
  useGetMeQuery,
  useUpdateMeMutation,
} from "@/redux/services/assessmentApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UploadCloud } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(6, "Phone too short")
    .max(20, "Phone too long")
    .optional()
    .or(z.literal("")),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

type ProfileValues = z.infer<typeof schema>;

const ProfilePage: React.FC = () => {
  const auth = useAppSelector((s) => s.auth);
  const { data, isFetching, refetch } = useGetMeQuery(undefined, {
    skip: !auth.accessToken,
  });
  const [updateMe, { isLoading: updating }] = useUpdateMeMutation();
  const {
    isUploading,
    uploadImage,
    uploadedUrl,
    error: uploadError,
  } = useImageUpload();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (data?.user) {
      reset({
        name: data.user.profile?.name || "",
        phone: data.user.profile?.phone || "",
        avatarUrl: data.user.profile?.avatarUrl || "",
      });
      setPreview(data.user.profile?.avatarUrl || null);
    }
  }, [data, reset]);

  useEffect(() => {
    if (uploadedUrl) {
      setValue("avatarUrl", uploadedUrl);
      setPreview(uploadedUrl);
    }
  }, [uploadedUrl, setValue]);

  const onSubmit = async (values: ProfileValues) => {
    try {
      await updateMe({
        name: values.name,
        phone: values.phone || undefined,
        avatarUrl: values.avatarUrl || undefined,
      }).unwrap();
      toast.success("Profile updated");
      refetch();
    } catch (e: any) {
      toast.error(
        e?.data?.error || e?.data?.message || "Failed to update profile"
      );
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be <= 2MB");
      return;
    }
    const url = await uploadImage(file);
    if (url) toast.success("Image uploaded");
    else if (uploadError) toast.error(uploadError);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            {isFetching ? "Loading profile..." : "Update your account details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-xl font-medium">
                    {data?.user?.profile?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div>
                <Label
                  htmlFor="avatarInput"
                  className="cursor-pointer text-sm font-medium flex items-center gap-2"
                >
                  <UploadCloud className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Change Avatar"}
                </Label>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                  disabled={isUploading}
                />
                {errors.avatarUrl && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.avatarUrl.message}
                  </p>
                )}
                {uploadError && (
                  <p className="text-xs text-destructive mt-1">{uploadError}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
              <Input
                id="avatarUrl"
                {...register("avatarUrl")}
                placeholder="https://..."
              />
              {errors.avatarUrl && (
                <p className="text-xs text-destructive">
                  {errors.avatarUrl.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={updating || isUploading}
              className="min-w-[140px]"
            >
              {updating || isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
