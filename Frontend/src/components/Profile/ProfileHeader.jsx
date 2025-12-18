const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-white rounded-xl p-6 text-center shadow">
      <img
        src="/profile.webp"
        alt="profile"
        className="w-32 h-32 rounded-full mx-auto border-4 border-white"
      />

      <h2 className="text-2xl font-bold mt-3">{user.name}</h2>

      <div className="flex justify-center gap-2 mt-2">
        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 uppercase font-bold">
          {user.role}
        </span>
        <span className="text-sm text-gray-500">
          Member since {user.joined}
        </span>
      </div>

      <button className="mt-5 w-full h-11 rounded-full bg-primary font-bold">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileHeader;
