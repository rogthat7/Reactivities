
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
    position: [number, number]; // Latitude and Longitude
    venue ?: string; // Venue name
}
export default function MapComponent( {position, venue}: Props) {
    return (
        <div>
            <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '300px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        {venue}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

