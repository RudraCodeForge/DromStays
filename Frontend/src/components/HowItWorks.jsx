import Style from "../styles/Home.module.css";

const HowItWorks = ({ steps }) => {
  return (
    <div className={Style.HowWorks_Con}>
      <h2>How It Works</h2>
      <p>Getting started is as easy as one, two, three.</p>

      <div className={Style.Steps_Con}>
        {steps.map((item, index) => (
          <div key={index} className={Style.Step}>
            <h3 className={Style.Step_Number}>{item.number}</h3>

            <div className={Style.Step_Content}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
