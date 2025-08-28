"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, LogOut, UserCircle2, Camera, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";
import LoadingPage from "@/components/pages/loading";
import { useUser, useClerk } from "@clerk/nextjs";

export default function UserPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Profile fields
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Password fields
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Add data to fields
  useEffect(() => {
    if(isLoaded && user){
      setFname(user.firstName ?? "");
      setLname(user.lastName ?? "");
      setEmail(user.primaryEmailAddress?.emailAddress ?? "");
      setImageUrl(user.imageUrl ?? null);
    }
  }, [isLoaded, user]);

  // Handle change of profile image
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    try{
      await user.setProfileImage({ file });
      setImageUrl(user.imageUrl);
      toast.success("Profile image updated.");
    } 
    catch(err: any){
      const message =
        err?.errors?.[0]?.longMessage || 
        err?.message ||                  
        "Failed to update password";
      toast.error(message);
    }
  }

  async function saveProfile() {
    if (!user?.id) return;
    try{
      await user.update({ firstName: fname, lastName: lname });
      toast.success("Profile info updated.");
    } 
    catch(err: any){
      const message =
        err?.errors?.[0]?.longMessage || 
        err?.message ||                  
        "Failed to update password";
      toast.error(message);
    }
  }

  async function changePassword(){
    if (!newPass) return;
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newPass }),
      });
      if (res.ok) console.log(res.ok);
       console.log(res);
       
    } 
    catch (err: any) {
      console.log(err)
    }
  };
  
  async function deleteAccount() {
    if (!user) return;

    const confirmed = confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmed) return;


    try {
      const res = await fetch("/api/clerk/webhook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      toast.success(data.message);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete account.");
    } finally {

    }
  }

  return(
    <DashboardLayout>
      {!isLoaded? <LoadingPage/> : (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl p-4 mx-auto lg:p-8">
            <div className="flex flex-col items-center mb-8 space-y-4">
                <div className="relative w-32 h-32">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`${fname} ${lname}`}
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <UserCircle2 className="w-16 h-16"/>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute p-1 text-white rounded-full bottom-2 right-2 bg-black/60"
                    title="Change Avatar"
                  >
                    <Camera className="w-4 h-4"/>
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
          <div className="flex justify-center mb-6 space-x-4 border-b border-gray-300 dark:border-gray-700">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "password"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Password
            </button>
          </div>
          {activeTab === "profile" && (
            <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
              <div className="relative w-full">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  disabled={true}
                  contentEditable={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-10 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <Lock className="absolute left-3 top-[2.3rem] text-gray-400 pointer-events-none" />
              </div>
              <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="flex items-center justify-center px-4 py-3 space-x-2 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}
          {activeTab === "password" && (
            <div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-2xl dark:border-gray-700">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={(e) => changePassword()}
                  className="flex items-center justify-center px-4 py-3 space-x-2 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                >
                  <Lock className="w-5 h-5" />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={() => signOut(() => router.push("/"))}
              className="flex items-center justify-center px-4 py-3 space-x-2 font-medium text-white transition-colors bg-gray-600 hover:bg-gray-700 rounded-xl"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
            <button
              type="button"
              onClick={deleteAccount}
              className="flex items-center justify-center px-4 py-3 space-x-2 font-medium text-white transition-colors bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
      )}
    </DashboardLayout>
  );
}