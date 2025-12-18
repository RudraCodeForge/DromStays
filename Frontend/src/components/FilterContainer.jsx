import Style from "../styles/Home.module.css";
const FilterContainer = () => {
  return (
    <div className={Style.FilterCon}>
      <input
        className={Style.Input}
        type="text"
        placeholder="Search by location..."
      />
      <select className={Style.RoomType}>
        <option value="">Room Type</option>
        <option value="single">Single</option>
        <option value="double">Double</option>
        <option value="suite">Suite</option>
      </select>
      <select className={Style.PriceRange}>
        <option value="">Range</option>
        <option value="100-500">100-500</option>
        <option value="500-1000">500 - 1000</option>
        <option value="1000+">1000+</option>
      </select>
      <button className={Style.Btn}> Search</button>
    </div>
  );
};
export default FilterContainer;
