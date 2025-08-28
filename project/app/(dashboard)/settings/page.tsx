"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, LogOut, UserCircle2, Camera, Trash2, Lock } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";
import LoadingPage from "@/components/pages/loading";
import { useUser, useClerk } from "@clerk/nextjs";
import { useModal } from "@/lib/states";
import { DeleteUser } from "@/components/modal-user/delete";

export default function UserPage(){
  // Redirecting user
  const router = useRouter();

  // Current user
  const { user, isLoaded: isLoaded } = useUser();

  // Logout user
  const { signOut } = useClerk();

  // Switching tabs
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Modal state
  const { isOpen, modalType, openModal } = useModal();

  // Profile fields
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Password fields
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Image handling
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
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>){
    // Check if there is signed in user
    if(!user){
      toast.error("No user signed in.");
      return;
    }

    // Get file
    const file = e.target.files?.[0];

    // Check if there is selected file
    if(!file){
      toast.error("No file selected.");
      return;
    }

    // Try to update profile image
    try{
      await user.setProfileImage({ file });
      setImageUrl(user.imageUrl);
      toast.success("Profile image updated.");
    } 
    catch(err: any){
      const message = err?.errors?.[0]?.longMessage || err?.message || "Failed to update password";
      toast.error(message);
    }
  }

  // Handle update profile information
  async function saveProfile(){
    // Check if there is signed in user
    if(!user){
      toast.error("No user signed in.");
      return;
    }

    // Update user info
    try{
      await user.update({ firstName: fname, lastName: lname });
      toast.success("Profile info updated.");
    } 
    catch(err: any){
      const message = err?.errors?.[0]?.longMessage || err?.message || "Failed to update password";
      toast.error(message);
    }
  }

  async function changePassword(){
    // Check if there is signed in user
    if(!user){
      toast.error("No user signed in.");
      return;
    }

    // Check if there is input password
    if((newPass.trim()).length === 0 || (confirmPass.trim()).length === 0){
      toast.error("Complete password fields");
      return;
    }

    try{
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newPass }),
      });
      if(res.ok){
        toast.success("Password updated.");
      }
      else{
        toast.error("Error in updating.")
      }
    } 
    catch(err: any){
      toast.error(err);
    }
  };
  

  return(
    <DashboardLayout>
      {isOpen && modalType === "deleteUser" && user?.id && <DeleteUser userId={user.id}/>}
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
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
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
              onClick={() => openModal("deleteUser")}
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