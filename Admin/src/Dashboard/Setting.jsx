import { useState, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useOwner } from "../Context/OwnerContext"; // Import useOwner
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

export default function Settings() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { signOut, updateProfilePicture, updatePassword ,fetchOwnerData} = useOwner(); // Use additional functions from OwnerContext
  const user = session?.user;
  const storedOwner = localStorage.getItem("user");
  const Owner = storedOwner ? JSON.parse(storedOwner) : null;

  const [name, setName] = useState("");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [currentPassword, setCurrentPassword] = useState(""); // State for current password
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Toggle visibility for current password
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle visibility for new password

  // Load user display name
  useEffect(() => {
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name);
    }
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, [user]);

  // Update display name
  const updateProfile = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { name },
    });
    if (error) {
      alert("Failed to update profile");
    } else {
      alert("Profile updated successfully!");
    }
    setLoading(false);
  };

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(); 
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  // Update Profile Picture
  const handleProfilePictureUpdate = async () => {
    try {
      if (!profilePicture) {
        alert("Please select a profile picture to upload.");
        return;
      }
      setLoading(true);
      const updatedPicture = await updateProfilePicture(profilePicture);
      alert("Profile picture updated successfully!");
      console.log("Updated Profile Picture:", updatedPicture);
      await fetchOwnerData();
    } catch (error) {
      alert("Failed to update profile picture.");
    } finally {
      setLoading(false);
    }
  };

  // Update Password
  const handlePasswordUpdate = async () => {
    try {
      if (!currentPassword || !newPassword) {
        alert("Please fill in both fields.");
        return;
      }
      setLoading(true);
      const message = await updatePassword(currentPassword, newPassword);
      alert(message);
    } catch (error) {
      alert("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="w-full h-full ps-2 py-2 mb-4  bg-white dark:bg-gray-800 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Settings</h2>

      {/* Display User Info */}
      <div>
        <p className="text-gray-600 dark:text-gray-300">
          Email: <strong>{user?.email || Owner?.email}</strong>
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          User ID: <strong>{user?.id || Owner?._id}</strong>
        </p>
      </div>

      {/* Update Display Name */}
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Display Name</label>
        <input
          type="text"
          value={name || Owner?.name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          onClick={updateProfile}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {Owner?.provider === "local" && (
  <div>
    <label className="block text-gray-700 dark:text-gray-200 mb-1">Profile Picture</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setProfilePicture(e.target.files[0])}
      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
    <button
      onClick={handleProfilePictureUpdate}
      disabled={loading}
      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Uploading..." : "Update Profile Picture"}
    </button>
  </div>
)}

{/* Update Password */}
{Owner?.provider === "local" && (
  <div>
    <label className="block text-gray-700 dark:text-gray-200 mb-1">Current Password</label>
    <div className="relative">
      <input
        type={showCurrentPassword ? "text" : "password"}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <button
        type="button"
        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
        className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
      >
        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    <label className="block text-gray-700 dark:text-gray-200 mb-1 mt-4">New Password</label>
    <div className="relative">
      <input
        type={showNewPassword ? "text" : "password"}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <button
        type="button"
        onClick={() => setShowNewPassword(!showNewPassword)}
        className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
      >
        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    <button
      onClick={handlePasswordUpdate}
      disabled={loading}
      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Updating..." : "Update Password"}
    </button>
  </div>
)}

      {/* Theme Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700 dark:text-gray-200">Theme</span>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg text-sm"
        >
          Switch to {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>

      {/* Logout */}
      <div className="text-right p-6 ">
        <button
          onClick={handleLogout}
          className="text-red-600 cursor-pointer hover:text-red-900 font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}