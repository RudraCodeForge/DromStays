import Styles from '../../styles/BankDetails.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer';

const BankDetails = () => {
    return (
        <>
            <Navbar />

            <div className={Styles.container}>
                <div className={Styles.card}>
                    <h2>Online Payments</h2>
                    <p className={Styles.comingSoon}>🚧 Coming Soon</p>
                    <p className={Styles.subText}>
                        We are working hard to enable secure online payments.
                        Please check back again soon.
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default BankDetails;
