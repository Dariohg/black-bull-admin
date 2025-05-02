import React, { useState } from 'react';
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
    Select,
    VStack,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    IconButton,
    useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Employee, Role, roleMapping } from '../../pages/EmployeesPage';
import { Location } from '../../pages/LocationsPage';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
    locations: Location[];
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               onAddEmployee,
                                                               locations
                                                           }) => {
    const toast = useToast();

    // Estados para los campos del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [locationId, setLocationId] = useState('');
    const [roleId, setRoleId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Estados para validación
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        locationId: '',
        roleId: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            email: '',
            password: '',
            locationId: '',
            roleId: ''
        };

        // Validar nombre
        if (!name.trim()) {
            newErrors.name = 'El nombre es requerido';
            isValid = false;
        }

        // Validar email
        if (!email.trim()) {
            newErrors.email = 'El email es requerido';
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = 'El email no es válido';
            isValid = false;
        }

        // Validar contraseña
        if (!password) {
            newErrors.password = 'La contraseña es requerida';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }

        // Validar sucursal
        if (!locationId) {
            newErrors.locationId = 'Debe seleccionar una sucursal';
            isValid = false;
        }

        // Validar rol
        if (!roleId) {
            newErrors.roleId = 'Debe seleccionar un rol';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // En una aplicación real, aquí se enviaría una solicitud al backend
            onAddEmployee({
                name,
                email,
                locationId,
                roleId: parseInt(roleId) as Role
            });

            // Limpiar el formulario
            resetForm();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Ocurrió un error al agregar el empleado',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setLocationId('');
        setRoleId('');
        setErrors({
            name: '',
            email: '',
            password: '',
            locationId: '',
            roleId: ''
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <ModalOverlay />
            <ModalContent bg="brand.800">
                <ModalHeader color="white">Agregar Nuevo Empleado</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired isInvalid={!!errors.name}>
                            <FormLabel>Nombre Completo</FormLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nombre completo del empleado"
                                bg="brand.700"
                                border="none"
                                _focus={{
                                    boxShadow: "0 0 0 1px #ff0000",
                                    borderColor: "accent.500"
                                }}
                            />
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.email}>
                            <FormLabel>Correo Electrónico</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@blackbull.com"
                                bg="brand.700"
                                border="none"
                                _focus={{
                                    boxShadow: "0 0 0 1px #ff0000",
                                    borderColor: "accent.500"
                                }}
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.password}>
                            <FormLabel>Contraseña</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Contraseña"
                                    bg="brand.700"
                                    border="none"
                                    _focus={{
                                        boxShadow: "0 0 0 1px #ff0000",
                                        borderColor: "accent.500"
                                    }}
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                        size="sm"
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.locationId}>
                            <FormLabel>Sucursal</FormLabel>
                            <Select
                                placeholder="Seleccionar sucursal"
                                value={locationId}
                                onChange={(e) => setLocationId(e.target.value)}
                                bg="brand.700"
                                border="none"
                                _focus={{
                                    boxShadow: "0 0 0 1px #ff0000",
                                    borderColor: "accent.500"
                                }}
                            >
                                {locations.map(location => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.locationId}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.roleId}>
                            <FormLabel>Rol</FormLabel>
                            <Select
                                placeholder="Seleccionar rol"
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                                bg="brand.700"
                                border="none"
                                _focus={{
                                    boxShadow: "0 0 0 1px #ff0000",
                                    borderColor: "accent.500"
                                }}
                            >
                                {/* Solo mostrar roles de barbero y recepcionista */}
                                <option value={Role.BARBER.toString()}>{roleMapping[Role.BARBER].name}</option>
                                <option value={Role.RECEPTIONIST.toString()}>{roleMapping[Role.RECEPTIONIST].name}</option>
                            </Select>
                            <FormErrorMessage>{errors.roleId}</FormErrorMessage>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        onClick={handleClose}
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
                        Guardar Empleado
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddEmployeeModal;