import Styles from "../../styles/AboutUs.module.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
const AboutUs = () => {
  return (
    <>
      {" "}
      <Navbar />
      <div className={Styles.wrapper}>
        {/* HERO */}
        <section className={Styles.hero}>
          <h1>
            Finding a room <span>shouldn’t feel like a battle.</span>
          </h1>
          <p>
            We’ve been there. Confused owners, shady brokers, no tiffin, no
            peace.
            <br />
            So yeah… we built <strong>Dormstays</strong>.
          </p>
        </section>

        {/* STORY */}
        <section className={Styles.story}>
          <h2>💭 Real Talk</h2>
          <p>
            Room dhoondhne jao to lagta hai interview de rahe ho.
            <br />
            “Late night aate ho?”, “Friends allowed?”, “Tiffin ka kya scene?”
          </p>
          <p className={Styles.bold}>
            Humne ye sab face kiya hai. Isliye Dormstays sirf ek app nahi —
            <br />
            ye frustration se nikla hua idea hai.
          </p>
        </section>

        {/* WHAT WE FIX */}
        <section className={Styles.fix}>
          <h2>🛠️ What Dormstays Fixes</h2>

          <div className={Styles.grid}>
            <div className={Styles.box}>🏠 Verified rooms (no drama)</div>
            <div className={Styles.box}>🍱 Tiffin & daily services nearby</div>
            <div className={Styles.box}>🧹 Safai & maintenance sorted</div>
            <div className={Styles.box}>
              🤝 Owners, tenants & partners — all win
            </div>
          </div>
        </section>

        {/* WHY DIFFERENT */}
        <section className={Styles.diff}>
          <h2>🚀 Why Dormstays is Different</h2>
          <p>
            Kyunki hum sirf listings nahi dikhate —
            <br />
            hum real-life problems solve karte hain.
          </p>

          <div className={Styles.diffGrid}>
            <div>❌ Broker ka scene</div>
            <div>❌ Fake photos</div>
            <div>❌ Confusing rules</div>
            <div>❌ Endless calls</div>
          </div>

          <p className={Styles.bold}>
            Dormstays = Clear rules + Zero bakchodi + Full transparency.
          </p>
        </section>

        {/* PEOPLE */}
        <section className={Styles.people}>
          <h2>👥 Built for Real People</h2>

          <div className={Styles.cards}>
            <div className={Styles.card}>
              <h3>Owners</h3>
              <p>
                Rooms list karo, genuine tenants pao,
                <br />
                bina 50 calls ke.
              </p>
            </div>

            <div className={Styles.card}>
              <h3>Tenants</h3>
              <p>
                Safe rooms, clear rules,
                <br />
                aur thoda sa sukoon.
              </p>
            </div>

            <div className={Styles.card}>
              <h3>Service Partners</h3>
              <p>
                Tiffin, safai, electrician —
                <br />
                local kaam, real respect.
              </p>
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section className={Styles.impact}>
          <h2>🧑‍🔧 Real Impact, Real People</h2>
          <p>
            Dormstays ka ek silent mission bhi hai —
            <br />
            local service partners ko steady kaam aur dignity dena.
          </p>
          <p className={Styles.highlight}>
            Ye log “extra feature” nahi,
            <br />
            ye system ka core part hain.
          </p>
        </section>

        {/* FUTURE */}
        <section className={Styles.future}>
          <h2>🔮 What We’re Building Next</h2>
          <ul>
            <li>📍 Smart location-based discovery</li>
            <li>💬 Direct owner–tenant chat</li>
            <li>🧾 Transparent rent & service history</li>
            <li>🧑‍🤝‍🧑 Strong trust-based community</li>
          </ul>
          <p>
            Ye sirf beginning hai.
            <br />
            Dormstays ko hum ek complete
            <strong> shared living ecosystem</strong> bana rahe hain.
          </p>
        </section>

        {/* VIBE */}
        <section className={Styles.vibe}>
          <h2>✨ The Dormstays Vibe</h2>
          <ul>
            <li>Less rules, more clarity</li>
            <li>No hidden charges, no bakchodi</li>
            <li>Tech + trust + thoda desi touch</li>
          </ul>
        </section>

        {/* END */}
        <section className={Styles.end}>
          <p>
            Dormstays is not about rooms.
            <br />
            It’s about <span>feeling at home, away from home.</span>
          </p>
          <small>
            Made by people who hate broker calls as much as you do 😌
          </small>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
