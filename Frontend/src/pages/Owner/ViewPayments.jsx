import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import Styles from "../../styles/ViewPayments.module.css";
import {
    getOwnerPayments,
    markPaymentAsPaid,
} from "../../services/payment.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GST_RATE = 0.18; // 18% GST

const ViewPayments = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.Role;
    const Navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("all");

    /* 🔹 Modal state */
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("CASH");

    /* 🔹 Fetch payments */
    useEffect(() => {
        if (role !== "owner") {
            toast.error("Unauthorized access");
            Navigate('/unauthorized')
            return;
        }

        const fetchPayments = async () => {
            try {
                const res = await getOwnerPayments();
                setPayments(res.data || res || []);
            } catch {
                toast.error("Failed to load payments");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [role]);

    /* 🔹 Available months */
    const availableMonths = useMemo(
        () => [...new Set(payments.map((p) => p.month).filter(Boolean))],
        [payments]
    );

    /* 🔹 Month filter */
    const filteredPayments = useMemo(() => {
        if (selectedMonth === "all") return payments;
        return payments.filter((p) => p.month === selectedMonth);
    }, [payments, selectedMonth]);

    /* 🔹 Totals */
    const totalPaidAmount = useMemo(
        () =>
            filteredPayments
                .filter((p) => p.status === "PAID" && p.type === "RENT")
                .reduce((sum, p) => sum + (p.amount || 0), 0),
        [filteredPayments]
    );

    const totalAdvanceAmount = useMemo(
        () =>
            filteredPayments
                .filter((p) => p.type === "ADVANCE")
                .reduce((sum, p) => sum + (p.amount || 0), 0),
        [filteredPayments]
    );

    const totalPendingAmount = useMemo(
        () =>
            filteredPayments
                .filter((p) => p.status === "PENDING")
                .reduce((sum, p) => sum + (p.amount || 0), 0),
        [filteredPayments]
    );

    const totalGST = useMemo(
        () =>
            filteredPayments
                .filter((p) => p.type === "RENT")
                .reduce(
                    (sum, p) => sum + Math.round((p.amount || 0) * GST_RATE),
                    0
                ),
        [filteredPayments]
    );

    /* 🔹 CSV DOWNLOAD */
    const downloadCSV = () => {
        if (filteredPayments.length === 0) {
            toast.warning("No data to export");
            return;
        }

        const headers = [
            "Date",
            "Tenant",
            "Property",
            "Room",
            "Type",
            "Status",
            "Method",
            "Amount",
            "GST",
        ];

        const rows = filteredPayments.map((p) => [
            new Date(p.createdAt).toLocaleDateString(),
            p.tenant?.fullName || "",
            p.property?.name || "",
            p.room?.roomNumber || "",
            p.type,
            p.status,
            p.paymentMethod,
            p.amount,
            p.type === "RENT" ? Math.round(p.amount * GST_RATE) : 0,
        ]);

        rows.push([]);
        rows.push(["TOTAL RENT PAID", "", "", "", "", "", "", totalPaidAmount, ""]);
        rows.push(["TOTAL ADVANCE", "", "", "", "", "", "", totalAdvanceAmount, ""]);
        rows.push(["TOTAL PENDING", "", "", "", "", "", "", totalPendingAmount, ""]);
        rows.push(["TOTAL GST", "", "", "", "", "", "", "", totalGST]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((r) => r.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = `payments_${selectedMonth}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /* 🔹 Open modal */
    const openMarkPaidModal = (paymentId) => {
        setSelectedPaymentId(paymentId);
        setPaymentMethod("CASH");
        setShowModal(true);
    };

    /* 🔹 Confirm mark as paid */
    const confirmMarkPaid = async () => {
        try {
            const payload = {
                paymentId: selectedPaymentId,
                paymentMethod,
            };
            await markPaymentAsPaid(payload);

            toast.success("Payment marked as PAID");

            setPayments((prev) =>
                prev.map((p) =>
                    p._id === selectedPaymentId
                        ? { ...p, status: "PAID", paymentMethod }
                        : p
                )
            );

            setShowModal(false);
            setSelectedPaymentId(null);
        } catch {
            toast.error("Failed to update payment");
        }
    };

    return (
        <>
            <Navbar />

            <div className={Styles.container}>
                <h1>Received Payments</h1>

                {/* 🔹 Filter Bar */}
                <div className={Styles.filterBar}>
                    <div className={Styles.filterLeft}>
                        <label>Month:</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="all">All</option>
                            {availableMonths.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className={Styles.csvButton} onClick={downloadCSV}>
                        ⬇ Download CSV
                    </button>
                </div>

                {/* 🔹 Summary */}
                {!loading && (
                    <div className={Styles.summaryGrid}>
                        <div className={Styles.summaryCard}>
                            <p>Total Rent Paid</p>
                            <h3>₹{totalPaidAmount}</h3>
                        </div>
                        <div className={Styles.summaryCard}>
                            <p>Total Advance</p>
                            <h3>₹{totalAdvanceAmount}</h3>
                        </div>
                        <div className={Styles.summaryCard}>
                            <p>Total Pending</p>
                            <h3>₹{totalPendingAmount}</h3>
                        </div>
                        <div className={Styles.summaryCard}>
                            <p>Total GST</p>
                            <h3>₹{totalGST}</h3>
                        </div>
                    </div>
                )}

                {/* 🔹 Table */}
                {loading ? (
                    <p>Loading payments...</p>
                ) : filteredPayments.length === 0 ? (
                    <p className={Styles.empty}>No payments found.</p>
                ) : (
                    <div className={Styles.tableWrapper}>
                        <table className={Styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tenant</th>
                                    <th>Property</th>
                                    <th>Room</th>
                                    <th>Amount</th>
                                    <th>GST</th>
                                    <th>Type</th>
                                    <th>Method</th>
                                    <th>Status / Action</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((pay, i) => (
                                    <tr key={pay._id}>
                                        <td>{i + 1}</td>
                                        <td>{pay.tenant?.fullName || "-"}</td>
                                        <td>{pay.property?.name || "-"}</td>
                                        <td>{pay.room?.roomNumber || "-"}</td>
                                        <td>₹{pay.amount}</td>
                                        <td>
                                            {pay.type === "RENT"
                                                ? `₹${Math.round(pay.amount * GST_RATE)}`
                                                : "-"}
                                        </td>
                                        <td>{pay.type}</td>
                                        <td>{pay.paymentMethod}</td>
                                        <td>
                                            {pay.status === "PENDING" ? (
                                                <button
                                                    className={Styles.markPaidBtn}
                                                    onClick={() => openMarkPaidModal(pay._id)}
                                                >
                                                    Mark as Paid
                                                </button>
                                            ) : (
                                                <span
                                                    className={`${Styles.status} ${Styles[pay.status]}`}
                                                >
                                                    {pay.status}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {new Date(pay.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 🔹 Modal */}
            {showModal && (
                <div className={Styles.modalOverlay}>
                    <div className={Styles.modal}>
                        <h3>Confirm Payment</h3>
                        <p>Select payment method</p>

                        <div className={Styles.methodGroup}>
                            {["CASH", "UPI", "MANUAL"].map((m) => (
                                <label key={m}>
                                    <input
                                        type="radio"
                                        checked={paymentMethod === m}
                                        onChange={() => setPaymentMethod(m)}
                                    />
                                    {m}
                                </label>
                            ))}
                        </div>

                        <div className={Styles.modalActions}>
                            <button
                                className={Styles.cancelBtn}
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={Styles.confirmBtn}
                                onClick={confirmMarkPaid}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default ViewPayments;
