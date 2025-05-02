import React, { useState, useCallback, useMemo } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Box,
    Text,
    VStack,
    HStack,
    Switch,
    FormHelperText,
    useToast
} from '@chakra-ui/react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Location } from '../../pages/LocationsPage';

// Reemplaza esto con tu API key de Google Maps
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

interface AddLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddLocation: (location: Omit<Location, 'id'>) => void;
}

interface MapPosition {
    lat: number;
    lng: number;
}

// Ubicación predeterminada centrada en la Ciudad de Guatemala
const defaultCenter = {
    lat: 14.6349,
    lng: -90.5069
};

const AddLocationModal: React.FC<AddLocationModalProps> = ({ isOpen, onClose, onAddLocation }) => {
    const toast = useToast();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [isPrimary, setIsPrimary] = useState(false);
    const [markerPosition, setMarkerPosition] = useState<MapPosition | null>(null);
    const [mapCenter, setMapCenter] = useState<MapPosition>(defaultCenter);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar la API de Google Maps
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"]
    });

    const mapOptions = useMemo(() => ({
        disableDefaultUI: false,
        clickableIcons: true,
        scrollwheel: true
    }), []);

    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const position = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            setMarkerPosition(position);

            // También puedes intentar obtener la dirección basada en las coordenadas (geocoding inverso)
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    setAddress(results[0].formatted_address);
                }
            });
        }
    }, []);

    const handleSubmit = () => {
        setIsLoading(true);

        // Validación básica
        if (!name.trim()) {
            toast({
                title: "Error",
                description: "El nombre de la sucursal es obligatorio",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        if (!address.trim()) {
            toast({
                title: "Error",
                description: "La dirección es obligatoria",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        if (!markerPosition) {
            toast({
                title: "Error",
                description: "Por favor selecciona una ubicación en el mapa",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        // Todo está bien, podemos agregar la ubicación
        onAddLocation({
            name,
            address,
            latitude: markerPosition.lat,
            longitude: markerPosition.lng,
            isPrimary
        });

        // Limpiamos el formulario
        setName('');
        setAddress('');
        setIsPrimary(false);
        setMarkerPosition(null);
        setMapCenter(defaultCenter);
        setIsLoading(false);
    };

    const handleSearchAddress = () => {
        if (!address.trim()) return;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results && results[0] && results[0].geometry && results[0].geometry.location) {
                const position = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                };
                setMarkerPosition(position);
                setMapCenter(position);
            } else {
                toast({
                    title: "Error en la búsqueda",
                    description: "No se pudo encontrar la dirección. Intenta con una dirección más específica.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        });
    };

    const renderMap = () => {
        return (
            <Box height="300px" width="100%" my={4}>
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={14}
                    onClick={handleMapClick}
                    options={mapOptions}
                >
                    {markerPosition && (
                        <Marker
                            position={markerPosition}
                        />
                    )}
                </GoogleMap>
            </Box>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent bg="brand.800">
                <ModalHeader color="white">Agregar Nueva Sucursal</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl id="name" isRequired>
                            <FormLabel>Nombre de la Sucursal</FormLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej. BLACK BULL Sur"
                                bg="brand.700"
                                border="none"
                                _focus={{
                                    boxShadow: "0 0 0 1px #ff0000",
                                    borderColor: "accent.500"
                                }}
                            />
                        </FormControl>

                        <FormControl id="address" isRequired>
                            <FormLabel>Dirección</FormLabel>
                            <HStack>
                                <Input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Ingresa la dirección completa"
                                    bg="brand.700"
                                    border="none"
                                    _focus={{
                                        boxShadow: "0 0 0 1px #ff0000",
                                        borderColor: "accent.500"
                                    }}
                                />
                                <Button
                                    onClick={handleSearchAddress}
                                    colorScheme="blue"
                                    size="md"
                                >
                                    Buscar
                                </Button>
                            </HStack>
                            <FormHelperText>
                                Puedes buscar la dirección o hacer clic en el mapa para seleccionar la ubicación
                            </FormHelperText>
                        </FormControl>

                        {loadError && (
                            <Text color="red.500">Error al cargar el mapa. Por favor, verifica tu conexión a internet.</Text>
                        )}

                        {isLoaded ? renderMap() : <Box height="300px" width="100%" bg="gray.700" />}

                        {markerPosition && (
                            <Text fontSize="sm" color="gray.400">
                                Ubicación seleccionada: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                            </Text>
                        )}

                        <FormControl display='flex' alignItems='center'>
                            <FormLabel htmlFor='is-primary' mb='0'>
                                ¿Es la sucursal principal?
                            </FormLabel>
                            <Switch
                                id='is-primary'
                                colorScheme='red'
                                isChecked={isPrimary}
                                onChange={(e) => setIsPrimary(e.target.checked)}
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        bg="accent.500"
                        color="white"
                        _hover={{ bg: 'accent.600' }}
                        onClick={handleSubmit}
                        isLoading={isLoading}
                    >
                        Guardar Sucursal
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddLocationModal;