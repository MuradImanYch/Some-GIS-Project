import './Meta.css';

function Meta({ properties }) {
  return (
    <div className="meta">
      <div className="header">
        <p>Meta data</p>
        <ul>
            <li>Id: {properties?.id}</li>
            <li>Geometry Type: {properties?.geometry?.getType()}</li>
            <li>Name: {properties?.name}</li>
        </ul>
      </div>
    </div>
  );
}

export default Meta;