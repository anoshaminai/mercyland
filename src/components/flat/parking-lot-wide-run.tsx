import img from '../../assets/images/band/parking lot wide run.jpg';

export const ParkingLotWideRun = () => (
  <section className="relative w-full h-[60vh] overflow-hidden">
    <img
      src={img}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover"
    />
  </section>
);
