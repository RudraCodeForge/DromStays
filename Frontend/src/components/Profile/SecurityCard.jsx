const SecurityCard = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow space-y-3">
      <h3 className="font-bold text-lg">Security</h3>

      <button className="w-full p-3 rounded-lg bg-gray-100">
        Change Password
      </button>

      <button className="w-full p-3 rounded-lg bg-red-50 text-red-600 font-bold">
        Logout
      </button>
    </div>
  );
};

export default SecurityCard;
