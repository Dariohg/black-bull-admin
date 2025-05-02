import React, { useState } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    IconButton,
    Flex,
    useDisclosure,
    HStack,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import EditEmployeeModal from '../components/employees/EditEmployeeModal';
import { Location } from './LocationsPage';

// Definición de roles
export enum Role {
    OWNER = 1,
    BARBER = 2,
    RECEPTIONIST = 3
}

// Interfaz para empleados
export interface Employee {
    id: string;
    name: string;
    email: string;
    locationId: string;
    roleId: Role;
}

// Mapeo de roles para mostrar en la interfaz
export const roleMapping = {
    [Role.OWNER]: { name: 'Propietario', color: 'purple' },
    [Role.BARBER]: { name: 'Barbero', color: 'blue' },
    [Role.RECEPTIONIST]: { name: 'Recepcionista', color: 'green' }
};

const EmployeesPage: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose
    } = useDisclosure();
    const {
        isOpen: isDeleteAlertOpen,
        onOpen: onDeleteAlertOpen,
        onClose: onDeleteAlertClose
    } = useDisclosure();

    const cancelRef = React.useRef<HTMLButtonElement>(null);

    const toast = useToast();
    const [employees, setEmployees] = useState<Employee[]>([
        {
            id: '1',
            name: 'Carlos Rodríguez',
            email: 'carlos@blackbull.com',
            locationId: '1',
            roleId: Role.BARBER
        },
        {
            id: '2',
            name: 'María López',
            email: 'maria@blackbull.com',
            locationId: '1',
            roleId: Role.RECEPTIONIST
        },
        {
            id: '3',
            name: 'Juan Pérez',
            email: 'juan@blackbull.com',
            locationId: '2',
            roleId: Role.BARBER
        }
    ]);

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

    // Datos de ejemplo para las sucursales (en una implementación real, esto vendría de una API o contexto)
    const [locations] = useState<Location[]>([
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

    const handleAddEmployee = (newEmployee: Omit<Employee, 'id'>) => {
        const id = Date.now().toString();
        setEmployees([...employees, { ...newEmployee, id }]);
        toast({
            title: 'Empleado agregado',
            description: `Se ha agregado a ${newEmployee.name} exitosamente.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onClose();
    };

    const handleEditEmployee = (id: string) => {
        const employeeToEdit = employees.find(emp => emp.id === id);
        if (employeeToEdit) {
            setSelectedEmployee(employeeToEdit);
            onEditOpen();
        }
    };

    const handleUpdateEmployee = (id: string, updatedData: Partial<Employee>) => {
        setEmployees(employees.map(emp =>
            emp.id === id ? { ...emp, ...updatedData } : emp
        ));
        onEditClose();
    };

    const handleDeleteClick = (id: string) => {
        setEmployeeToDelete(id);
        onDeleteAlertOpen();
    };

    const confirmDelete = () => {
        if (employeeToDelete) {
            setEmployees(employees.filter(employee => employee.id !== employeeToDelete));
            toast({
                title: 'Empleado eliminado',
                description: 'El empleado ha sido eliminado exitosamente.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            setEmployeeToDelete(null);
            onDeleteAlertClose();
        }
    };

    // Función para obtener el nombre de la sucursal por ID
    const getLocationName = (locationId: string) => {
        const location = locations.find(loc => loc.id === locationId);
        return location ? location.name : 'Desconocida';
    };

    return (
        <Box>
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
                <Box>
                    <Heading size="lg" mb={2}>Empleados</Heading>
                    <Text color="gray.400">Administra a los empleados de BLACK BULL</Text>
                </Box>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme="red"
                    onClick={onOpen}
                    bg="accent.500"
                    _hover={{ bg: 'accent.600' }}
                >
                    Agregar Empleado
                </Button>
            </Flex>

            <Box bg="brand.800" rounded="md" overflow="hidden" shadow="sm">
                <Box overflowX="auto">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th borderColor="brand.700">Nombre</Th>
                                <Th borderColor="brand.700">Email</Th>
                                <Th borderColor="brand.700">Sucursal</Th>
                                <Th borderColor="brand.700">Rol</Th>
                                <Th borderColor="brand.700" isNumeric>Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {employees.map(employee => (
                                <Tr key={employee.id}>
                                    <Td borderColor="brand.700">{employee.name}</Td>
                                    <Td borderColor="brand.700">{employee.email}</Td>
                                    <Td borderColor="brand.700">{getLocationName(employee.locationId)}</Td>
                                    <Td borderColor="brand.700">
                                        <Badge colorScheme={roleMapping[employee.roleId].color}>
                                            {roleMapping[employee.roleId].name}
                                        </Badge>
                                    </Td>
                                    <Td borderColor="brand.700" isNumeric>
                                        <HStack spacing={2} justifyContent="flex-end">
                                            <IconButton
                                                aria-label="Editar empleado"
                                                icon={<FiEdit />}
                                                size="sm"
                                                colorScheme="blue"
                                                variant="ghost"
                                                onClick={() => handleEditEmployee(employee.id)}
                                            />
                                            <IconButton
                                                aria-label="Eliminar empleado"
                                                icon={<FiTrash2 />}
                                                size="sm"
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => handleDeleteClick(employee.id)}
                                            />
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Box>

            <AddEmployeeModal
                isOpen={isOpen}
                onClose={onClose}
                onAddEmployee={handleAddEmployee}
                locations={locations}
            />

            <EditEmployeeModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                onUpdateEmployee={handleUpdateEmployee}
                employee={selectedEmployee}
                locations={locations}
            />

            {/* Alerta de confirmación para eliminar */}
            <AlertDialog
                isOpen={isDeleteAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="brand.800">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Empleado
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro? Esta acción no se puede deshacer.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                                Cancelar
                            </Button>
                            <Button
                                bg="accent.500"
                                color="white"
                                _hover={{ bg: 'accent.600' }}
                                onClick={confirmDelete}
                                ml={3}
                            >
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default EmployeesPage;