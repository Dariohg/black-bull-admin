import React, { useState } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    Flex,
    SimpleGrid,
    InputGroup,
    Input,
    InputLeftElement,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import HaircutCard from '../components/haircuts/HaircutCard';
import AddHaircutModal from '../components/haircuts/AddHaircutModal';
import EditHaircutModal from '../components/haircuts/EditHaircutModal';

// Interfaz para cortes de cabello
export interface Haircut {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

const HaircutsPage: React.FC = () => {
    // Modales
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const toast = useToast();

    // Estados
    const [haircuts, setHaircuts] = useState<Haircut[]>([
        {
            id: '1',
            name: 'Fade Clásico',
            price: 120,
            imageUrl: '/haircuts/fade-clasico.jpg'
        },
        {
            id: '2',
            name: 'Corte Ejecutivo',
            price: 100,
            imageUrl: '/haircuts/corte-ejecutivo.jpg'
        },
        {
            id: '3',
            name: 'Degradado con Diseño',
            price: 150,
            imageUrl: '/haircuts/degradado-diseno.jpg'
        },
        {
            id: '4',
            name: 'Mohawk Moderno',
            price: 130,
            imageUrl: '/haircuts/mohawk-moderno.jpg'
        }
    ]);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedHaircut, setSelectedHaircut] = useState<Haircut | null>(null);

    // Filtrar cortes basados en la búsqueda
    const filteredHaircuts = haircuts.filter(haircut => {
        return haircut.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Funciones de manipulación de cortes de cabello
    const handleAddHaircut = (newHaircut: Omit<Haircut, 'id'>) => {
        const id = Date.now().toString();
        setHaircuts([...haircuts, { ...newHaircut, id }]);
        toast({
            title: 'Corte agregado',
            description: `Se ha agregado "${newHaircut.name}" exitosamente.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onAddClose();
    };

    const handleEditHaircut = (haircut: Haircut) => {
        setSelectedHaircut(haircut);
        onEditOpen();
    };

    const handleUpdateHaircut = (id: string, updatedData: Partial<Haircut>) => {
        setHaircuts(haircuts.map(haircut =>
            haircut.id === id ? { ...haircut, ...updatedData } : haircut
        ));
        toast({
            title: 'Corte actualizado',
            description: 'El corte ha sido actualizado exitosamente.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onEditClose();
    };

    const handleDeleteHaircut = (id: string) => {
        setHaircuts(haircuts.filter(haircut => haircut.id !== id));
        toast({
            title: 'Corte eliminado',
            description: 'El corte ha sido eliminado exitosamente.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2}>Cortes de Cabello</Heading>
                    <Text color="gray.400">Administra los cortes de cabello ofrecidos en BLACK BULL</Text>
                </Box>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme="red"
                    onClick={onAddOpen}
                    bg="accent.500"
                    _hover={{ bg: 'accent.600' }}
                >
                    Agregar Corte
                </Button>
            </Flex>

            {/* Filtros y búsqueda */}
            <Box mb={6}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <FiSearch color="gray.300" />
                    </InputLeftElement>
                    <Input
                        placeholder="Buscar cortes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        bg="brand.800"
                        border="none"
                        _focus={{
                            boxShadow: "0 0 0 1px #ff0000",
                            borderColor: "accent.500"
                        }}
                    />
                </InputGroup>
            </Box>

            {/* Listado de cortes */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                {filteredHaircuts.map(haircut => (
                    <HaircutCard
                        key={haircut.id}
                        haircut={haircut}
                        onEdit={() => handleEditHaircut(haircut)}
                        onDelete={() => handleDeleteHaircut(haircut.id)}
                    />
                ))}
            </SimpleGrid>
            {filteredHaircuts.length === 0 && (
                <Box textAlign="center" py={10}>
                    <Text color="gray.400">No hay cortes de cabello que coincidan con tu búsqueda.</Text>
                </Box>
            )}

            {/* Modales */}
            <AddHaircutModal
                isOpen={isAddOpen}
                onClose={onAddClose}
                onAddHaircut={handleAddHaircut}
            />

            <EditHaircutModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                onUpdateHaircut={handleUpdateHaircut}
                haircut={selectedHaircut}
            />
        </Box>
    );
};

export default HaircutsPage;