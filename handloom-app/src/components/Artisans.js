import Navbar from "./Navbar";

function Artisans() {
  const artisans = [
    { name: "Ravi Kumar", skill: "Handloom Sarees" },
    { name: "Anita Devi", skill: "Silk Weaving" },
    { name: "Suresh Patel", skill: "Cotton Fabrics" }
  ];

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center" }}>Our Artisans</h2>

      {artisans.map((a, index) => (
        <div key={index} style={{ textAlign: "center", margin: "20px" }}>
          <h3>{a.name}</h3>
          <p>{a.skill}</p>
        </div>
      ))}
    </div>
  );
}

export default Artisans;