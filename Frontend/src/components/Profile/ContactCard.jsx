const ContactCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h3 className="font-bold text-lg mb-4">Contact Information</h3>

      <p className="text-sm">
        <b>Email:</b> {user.Email}
      </p>
      <p className="text-sm mt-2">
        <b>Phone:</b> {user.Phone}
      </p>
      <p className="text-sm mt-2">
        <b>Location:</b> {user.Location}
      </p>
    </div>
  );
};

export default ContactCard;
