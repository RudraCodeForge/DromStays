import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Styles from "../../styles/ManageServices.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";

const ManageServices = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.Role;

  const [services, setServices] = useState([]);

  useEffect(() => {
    // 🔹 Dummy Data (later API se aayega)
    const allServices = [
      {
        id: 1,
        name: "Room Cleaning",
        type: "Cleaning",
        ownerId: "69578aba2fd82cdab3a087c4",
        tenantId: "T1",
        tenantName: "Rahul Sharma",
        propertyId: "P1",
        propertyName: "Shiv PG",
        roomId: "R101",
        roomNo: "101",
        status: "active",
      },
      {
        id: 2,
        name: "Monthly Tiffin",
        type: "Food",
        ownerId: "69578aba2fd82cdab3a087c4",
        tenantId: "T2",
        tenantName: "Amit Verma",
        propertyId: "P1",
        propertyName: "Shiv PG",
        roomId: "R102",
        roomNo: "102",
        status: "paused",
      },
      {
        id: 3,
        name: "Water Supply",
        type: "Utility",
        ownerId: "69578aba2fd82cdab3a087c4",
        tenantId: null, // Owner ki khud ki service
        tenantName: null,
        propertyId: "P1",
        propertyName: "Shiv PG",
        roomId: null,
        roomNo: null,
        status: "active",
      },
    ];

    // 🔐 ROLE BASED FILTER
    if (role === "tenant") {
      setServices(allServices.filter((s) => s.tenantId === user.id));
    } else if (role === "owner") {
      setServices(allServices.filter((s) => s.ownerId === user.id));
    }
  }, [role, user]);

  // 🔹 ACTION HANDLERS
  const pauseService = (id) => console.log("Pause", id);
  const resumeService = (id) => console.log("Resume", id);
  const cancelService = (id) => console.log("Cancel", id);
  const raiseComplaint = (id) => console.log("Complaint Raised", id);

  return (
    <>
      <Navbar />
      <div className={Styles.container}>
        <h1>Manage Services</h1>

        {services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          <div className={Styles.list}>
            {services.map((service) => (
              <div key={service.id} className={Styles.card}>
                <h3>{service.name}</h3>

                <p>
                  <strong>Type:</strong> {service.type}
                </p>

                <p>
                  <strong>Property:</strong> {service.propertyName}
                </p>

                {service.roomNo && (
                  <p>
                    <strong>Room No:</strong> {service.roomNo}
                  </p>
                )}

                {service.tenantName && (
                  <p>
                    <strong>Tenant:</strong> {service.tenantName}
                  </p>
                )}

                <p>
                  <strong>Status:</strong> {service.status}
                </p>

                <div className={Styles.actions}>
                  {/* 🧑‍💼 OWNER ACTIONS */}
                  {role === "owner" && service.tenantId && (
                    <button
                      className={Styles.complaint}
                      onClick={() => raiseComplaint(service.id)}
                    >
                      Raise Complaint
                    </button>
                  )}

                  {/* 👑 OWNER – OWN SERVICE CONTROL */}
                  {role === "owner" && !service.tenantId && (
                    <>
                      <button onClick={() => pauseService(service.id)}>
                        Pause
                      </button>
                      <button onClick={() => resumeService(service.id)}>
                        Resume
                      </button>
                      <button onClick={() => cancelService(service.id)}>
                        Cancel
                      </button>
                    </>
                  )}

                  {/* 👤 TENANT ACTIONS */}
                  {role === "tenant" && (
                    <>
                      <button onClick={() => pauseService(service.id)}>
                        Pause
                      </button>
                      <button onClick={() => resumeService(service.id)}>
                        Resume
                      </button>
                      <button onClick={() => cancelService(service.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ManageServices;
