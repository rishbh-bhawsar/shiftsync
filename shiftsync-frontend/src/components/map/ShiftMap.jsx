import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const ShiftMap = ({ shifts = [], center = { lat: 40.7128, lng: -74.006 } }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
          {shifts.map((shift) => (
            <MarkerF
              key={shift.id}
              position={{ lat: shift.facilityLocationLat, lng: shift.facilityLocationLng }}
              title={shift.title}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default ShiftMap;
