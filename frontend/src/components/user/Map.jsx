import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet"
import { toast } from "react-toastify";
import { api } from "../../utils/api";
import { useParams } from "react-router";
import { Oval } from "react-loader-spinner";

function Map() {
    const [sourceCords, setSourceCords] = useState(null)
    const [destinationCords, setDestinationCords] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        const fetchCords = async () => {
            try {
                const res = await api.get(`/carts/getOrderCords/${id}`)
                setSourceCords([res.data.data.sourceCords.lat, res.data.data.sourceCords.lng])
                setDestinationCords([res.data.data.destinationCords.lat, res.data.data.destinationCords.lng])
            } catch (error) {
                const msg = error.response?.data?.message || 'fetching cords failed. Please try again.'
                toast.error(msg, {
                    theme: 'dark',
                    autoClose: 3000,
                })
            }
        }
        fetchCords()
    }, [id])
    if (!sourceCords || !destinationCords) {
        return (
            <div className='flex m-auto'>
                <Oval
                    height={100}
                    width={100}
                    color="#6a6ff2"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#6a6ff2"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
            </div>
        )
    }
    const INDIA_BOUNDS = {
        minLat: 8.4,   // South (Kanyakumari)
        maxLat: 37.6,  // North (Jammu & Kashmir)
        minLng: 68.7,  // West (Gujarat)
        maxLng: 97.25  // East (Arunachal Pradesh)
    };
    const generateMidpoints = (count = 3) => {
        const { minLat, maxLat, minLng, maxLng } = INDIA_BOUNDS;

        return Array.from({ length: count }, () => {
            const lat = Math.random() * (maxLat - minLat) + minLat;
            const lng = Math.random() * (maxLng - minLng) + minLng;
            return [lat, lng];
        });
    };
    const midPoints = generateMidpoints(2);
    const routes = [
        sourceCords, // source
        ...midPoints,
        destinationCords  // destination
    ];
    return (
        <MapContainer center={routes[0]} zoom={13} style={{ height: "800px", width: "100%" }}>
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline positions={routes} />
            {
                routes.map((r, index) => (
                    <Marker position={r} key={index}></Marker>

                ))
            }

        </MapContainer>
    )
}

export default Map