import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer";
import Styles from "../../styles/ViewPayments.module.css";
import {
    getOwnerPayments,
    // markPaymentAsPaid,
} from "../../services/payment.service";
import { toast } from "react-toastify";

const GST_RATE = 0.18;

const ViewPayments = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.Role;

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState("all");

    /* 🔹 MODAL STATE */
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("CASH");

    useEffect(() => {
        if (role !== "owner") {
            toast.error("Unauthorized access");
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

    /* 🔹 MONTHS */
    const availableMonths = useMemo(
        () => [...new Set(payments.map((p) => p.month).filter(Boolean))],
        [payments]
    );

    const filteredPayments = useMemo(() => {
        if (selectedMonth === "all") return payments;
        return payments.filter((p) => p.month === selectedMonth);
    }, [payments, selectedMonth]);

    /* 🔹 TOTALS */
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

    /* 🔹 OPEN MODAL */
    const openMarkPaidModal = (paymentId) => {
        setSelectedPaymentId(paymentId);
        setPaymentMethod("CASH");
        setShowModal(true);
    };

    /* 🔹 CONFIRM PAID */
    const confirmMarkPaid = async () => {
        try {
            // await markPaymentAsPaid({
            //   paymentId: selectedPaymentId,
            //   paymentMethod,
            // });

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

                {/* 🔹 FILTER */}
                <div className={Styles.filterBar}>
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

                {/* 🔹 SUMMARY */}
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

                {/* 🔹 TABLE */}
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

            {/* 🔹 MODAL */}
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
