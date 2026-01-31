import { useState, useEffect } from "react";
import Styles from "../../styles/Invoices.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import { fetchInvoices } from "../../services/Invoices.service";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
    const { isAuthenticated, role, } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [monthFilter, setMonthFilter] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        if (role !== "owner") {
            navigate("/unauthorized");
        }
    }, [isAuthenticated, role, navigate]);

    useEffect(() => {
        const getInvoices = async () => {
            try {
                const data = await fetchInvoices();
                console.log("Fetched Invoices:", data);
                setInvoices(data?.invoices || []);

                const currentMonth = new Date().toISOString().slice(0, 7);
                setMonthFilter(currentMonth);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };

        getInvoices();
    }, []);


    // ✅ Month + Status Filter
    const filteredInvoices = invoices.filter((invoice) => {
        const statusMatch =
            statusFilter === "All" ||
            invoice.paymentStatus === statusFilter;

        const monthMatch =
            !monthFilter ||
            invoice.invoiceDate?.slice(0, 7) === monthFilter;

        return statusMatch && monthMatch;
    });

    return (
        <>
            <Navbar />

            <div className={Styles.container}>
                <h1 className={Styles.heading}>Invoices</h1>

                {/* 🔍 Filters */}
                <div className={Styles.filters}>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                    </select>

                    {/* 🔁 Month Picker */}
                    <input
                        type="month"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                    />
                </div>

                {/* 📄 Table */}
                {filteredInvoices.length === 0 ? (
                    <p className={Styles.empty}>No invoices found.</p>
                ) : (
                    <div className={Styles.tableWrapper}>
                        <table className={Styles.table}>
                            <thead>
                                <tr>
                                    <th>Invoice No</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id}>
                                        <td>{invoice.invoiceNumber}</td>

                                        <td>
                                            {new Date(
                                                invoice.invoiceDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>₹ {invoice.totalAmount}</td>

                                        <td>
                                            <span
                                                className={`${Styles.status} ${invoice.paymentStatus === "Paid"
                                                    ? Styles.paid
                                                    : Styles.pending
                                                    }`}
                                            >
                                                {invoice.paymentStatus}
                                            </span>
                                        </td>

                                        <td>
                                            <a
                                                href={`${import.meta.env.VITE_API_URL}${invoice.pdfUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={Styles.downloadBtn}
                                            >
                                                Download
                                            </a>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Invoices;
