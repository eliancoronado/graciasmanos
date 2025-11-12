import { useEffect, useState } from "react";

function CatalogoPulseras() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/ElianDev/sizae-data/main/pulseras.json")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{data.categoria}</h1>
      <p>{data.descripcion_categoria}</p>
      <div className="grid grid-cols-2 gap-4">
        {data.productos.map(p => (
          <div key={p.id} className="border p-2 rounded-lg shadow">
            <img src={p.imagenes.principal} alt={p.nombre} />
            <h2>{p.nombre}</h2>
            <p>{p.descripcion}</p>
            <p>
              <strong>${(p.precio * (1 - p.descuento)).toFixed(2)}</strong>{" "}
              <span className="line-through">${p.precio}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogoPulseras;
