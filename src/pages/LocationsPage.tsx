import React, { useState } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    SimpleGrid,
    useDisclosure,
    Flex
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import LocationCard from '../components/locations/LocationCard';
import AddLocationModal from '../components/locations/AddLocationModal';

// Tipo para las sucursales
export interface Location {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    isPrimary?: boolean;
}

const LocationsPage: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [locations, setLocations] = useState<Location[]>([
        {
            id: '1',
            name: 'BLACK BULL Central',
            address: 'Av. Reforma 234, Zona 10',
            latitude: 14.6030,
            longitude: -90.5147,
            isPrimary: true
        },
        {
            id: '2',
            name: 'BLACK BULL Norte',
            address: 'C.C. Plaza Norte, Local 45',
            latitude: 14.6377,
            longitude: -90.5133
        }
    ]);

    const handleAddLocation = (newLocation: Omit<Location, 'id'>) => {
        const id = Date.now().toString();
        setLocations([...locations, { ...newLocation, id }]);
        onClose();
    };

    return (
        <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2}>Sucursales</Heading>
                    <Text color="gray.400">Administra las ubicaciones de BLACK BULL</Text>
                </Box>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme="red"
                    onClick={onOpen}
                    bg="accent.500"
                    _hover={{ bg: 'accent.600' }}
                >
                    Agregar Sucursal
                </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={6}>
                {locations.map(location => (
                    <LocationCard key={location.id} location={location} />
                ))}
            </SimpleGrid>

            <AddLocationModal
                isOpen={isOpen}
                onClose={onClose}
                onAddLocation={handleAddLocation}
            />
        </Box>
    );
};

export default LocationsPage;