import { Link } from "react-router-dom";
import Styles from "../../styles/Support/HelpPages.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer.jsx";
import BackButton from "./BackButton.jsx";

const StayIssues = () => {
  return (
    <>
      <Navbar />
      <div className={Styles.Container}>
        <BackButton />
        <h1>🏠 Stay Issues</h1>

        <div className={Styles.FAQ}>
          <h3>❓ Room me problem hai (fan, light, water, etc.)?</h3>
          <p>
            Pehle property owner ko inform karein. Agar issue resolve nahi hota,
            to support ticket raise kar sakte hain.
          </p>

          <h3>❓ Cleanliness ya hygiene issue?</h3>
          <p>
            Common areas aur room cleanliness ke liye owner zimmedar hota hai.
            Regular cleaning na hone par complaint raise karein.
          </p>

          <h3>❓ Facilities promised but not available?</h3>
          <p>
            Agar listing me mentioned facilities provide nahi ki ja rahi hain,
            to aap iske liye support ticket create kar sakte hain.
          </p>

          <h3>❓ Room ya bed change chahiye?</h3>
          <p>
            Availability ke basis par room/bed change possible hota hai. Owner
            se baat karein ya ticket raise karein.
          </p>

          <h3>❓ Safety ya security concern?</h3>
          <p>
            Kisi bhi serious safety issue ke liye turant owner ko notify karein
            aur support team ko inform karein.
          </p>
        </div>

        <div className={Styles.Bottom}>
          <p>Still facing stay-related issues?</p>
          <Link to="/create_ticket?category=stay" className={Styles.SupportBtn}>
            Raise Stay Issue Ticket →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StayIssues;
