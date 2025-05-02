import React from 'react';
import {
    Box,
    Heading,
    Text,
    Flex,
    Icon,
    Badge,
    IconButton,
    HStack,
    Tooltip
} from '@chakra-ui/react';
import { FiMapPin, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Location } from '../../pages/LocationsPage';

interface LocationCardProps {
    location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
    return (
        <Box
            bg="brand.800"
            borderRadius="lg"
            overflow="hidden"
            position="relative"
            p={5}
            borderLeft={location.isPrimary ? "4px solid" : "none"}
            borderColor={location.isPrimary ? "accent.500" : "transparent"}
            transition="transform 0.3s"
            _hover={{ transform: 'translateY(-5px)' }}
        >
            <Flex justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Heading size="md" mb={2}>
                    {location.name}
                    {location.isPrimary && (
                        <Badge ml={2} colorScheme="red" fontSize="xs">
                            Principal
                        </Badge>
                    )}
                </Heading>
                <HStack>
                    <Tooltip label="Editar sucursal">
                        <IconButton
                            aria-label="Editar sucursal"
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                        />
                    </Tooltip>
                    <Tooltip label="Eliminar sucursal">
                        <IconButton
                            aria-label="Eliminar sucursal"
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                        />
                    </Tooltip>
                </HStack>
            </Flex>

            <Flex align="center" mb={3}>
                <Icon as={FiMapPin} color="accent.500" mr={2} />
                <Text>{location.address}</Text>
            </Flex>

            <Text color="gray.400" fontSize="sm">
                Ubicación: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>

            {/* Miniatura del mapa (opcional) */}
            <Box
                mt={4}
                height="100px"
                borderRadius="md"
                overflow="hidden"
                bg="gray.700"
                position="relative"
            >
                <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=15&size=400x100&markers=color:red%7C${location.latitude},${location.longitude}&key=YOUR_API_KEY`}
                    alt={`Mapa de ${location.name}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Box>
        </Box>
    );
};

export default LocationCard;