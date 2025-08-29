"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Save, LogOut, UserCircle2, Camera, Trash2, Lock } from "lucide-react"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard-layout"
import LoadingPage from "@/components/pages/loading"
import { useUser, useClerk } from "@clerk/nextjs"
import { useModal } from "@/lib/states"
import { DeleteUser } from "@/components/modal-user/delete"
import { NameSchema, PasswordSchema } from "@/lib/validations"

export default function SettingsPage(){
  // Signout and change route
  const { signOut } = useClerk();
  const router = useRouter();

  // Current user
  const { user, isLoaded: isLoaded } = useUser();

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

  // Loading states
  const [isUpdateImage, setIsUpdateImage] = useState(false);
  const [isUpdateUser, setIsUpdateUser] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);

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

  useEffect(() => {
    setDisableButtons(isUpdateImage || isUpdateUser || isChangePassword);
  }, [isUpdateImage, isUpdateUser, isChangePassword])

  // Logout current user
  function logoutUser(){
    signOut();
    router.push("/");
  }

  // Update user information
  async function updateProfile(fname: string, lname: string){
    // Check if there is signed in user
    if(!user){
      toast.error("No user signed in.");
      return;
    }

    // Validate input
    const result = NameSchema.safeParse({
      fname: fname,
      lname: lname
    });

    // Display error from validation
    if(!result.success){
      toast.error(result.error.issues[0].message);
      return;
    }

    // Update user info
    try{
      setIsUpdateUser(true);
      await user.update({ firstName: fname, lastName: lname });
      toast.success("Profile information updated.");
    } 
    catch{
      toast.error("Updating information error.");
    }
    setIsUpdateUser(false);
  }

  // Update user icon
  async function updateImage(e: React.ChangeEvent<HTMLInputElement>){
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

    // Update user image
    try{
      setIsUpdateImage(true);
      await user.setProfileImage({ file });
      toast.success("Profile image updated.");
    } 
    catch{
      toast.error("Updating image error.");
    }
    setIsUpdateImage(false);
  }

  // Change user password
  async function changePassword(newPass: string, confirmPass: string){
    // Check if there is signed in user
    if(!user){
      toast.error("No user signed in.");
      return;
    }

    // Check if field input matches
    if((newPass.trim()) !== (confirmPass.trim())){
      toast.error("New and confirmation passwords must match.");
      return;
    }

    // Validate input
    const result = PasswordSchema.safeParse({
      pword: newPass
    });

    // Display error from validation
    if(!result.success){
      toast.error(result.error.issues[0].message);
      return;
    }

    // Update user password
    try{
      setIsChangePassword(true);
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newPass })
      });
      if(res.ok){
        toast.success("Password changed.");
        setNewPass("");
        setConfirmPass("");
      }
      else{
        const data = await res.json();
        toast.error(data.error);
      }
    } 
    catch{
      toast.error("Changing password error.");
    }
    setIsChangePassword(false);
  };

  return(
    <DashboardLayout>
      {isOpen && modalType === "deleteUser" && user?.id && <DeleteUser userId={user.id}/>}
      {!isLoaded? <LoadingPage/> : (
        <div className="bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl p-2 mx-auto lg:p-8">
            <div className="flex flex-col items-center mb-8 space-y-4">
              <div className="relative w-32 h-32">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <UserCircle2 className="w-16 h-16"/>
                  </div>
                )}
                <button
                  type="button"
                  disabled={disableButtons}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute p-1 text-white rounded-full bottom-2 right-2 bg-black/60"
                >
                  <Camera className="w-4 h-4"/>
                </button>
              </div>
              <input
                type="file"
                disabled={disableButtons}
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => updateImage(e)}
              />
            </div>
            <div className="flex justify-center mb-6 space-x-4 border-b border-gray-300 dark:border-gray-700">
              <button
                type="button"
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
                type="button"
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
                  <Lock className="absolute left-3 top-[2.3rem] text-gray-400 pointer-events-none"/>
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
                    disabled={disableButtons}
                    onClick={() => updateProfile(fname, lname)}
                    className="flex items-center justify-center px-4 py-3 space-x-2 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                  >
                    <Save className="w-5 h-5"/>
                    <span>{isUpdateUser? "Saving Changes..." : "Save Changes"}</span>
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
                    disabled={disableButtons}
                    onClick={() => changePassword(newPass, confirmPass)}
                    className="flex items-center justify-center px-4 py-3 space-x-2 font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                  >
                    <Lock className="w-5 h-5"/>
                    <span>{isChangePassword? "Changing Password..." : "Change Password"}</span>
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6 space-x-4">
              <button
                type="button"
                onClick={logoutUser}
                className="flex items-center justify-center px-4 py-3 space-x-2 font-medium text-white transition-colors bg-gray-600 hover:bg-gray-700 rounded-xl"
              >
                <LogOut className="w-5 h-5"/>
                <span>Logout</span>
              </button>
              <button
                type="button"
                onClick={() => openModal("deleteUser")}
                className="flex items-center justify-center px-4 py-3 space-x-2 font-medium text-white transition-colors bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5"/>
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}