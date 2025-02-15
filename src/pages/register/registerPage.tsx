import { Checkbox, Flex, Heading, Link, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { Input } from "../../components/Forms/Inputs/Input";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api, serverApi } from "../../services/api";
import { useRouter } from "next/router";
import { ProfileProvider, useProfile } from "../../contexts/useProfile";
import { ControlledInput } from "../../components/Forms/Inputs/ControlledInput";
import { showErrors } from "../../contexts/useErrors";
import { createSlug } from "../../utils/createSlug";
import { useState } from "react";

interface SignInFormData{
    name: string;
    //slug: string;
    name_display: string;
    phone: string;
    address: string;
    email: string;
    cnpj: string;
    password: string;
    confirmPassword: string;
    remember?: string;
}

const signInFormSchema = yup.object().shape({
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido.'),
    name: yup.string().required('Informe o nome fantasia'),
    name_display: yup.string().required('Informe o nome cadastral da sua empresa'),
    cnpj: yup.string().required('CNPJ Obrigatório'),
    password: yup.string().required('Senha Obrigatória'),
    confirmPassword: yup.string().required('Senha Obrigatória'),
    phone: yup.string().required('Telefone de contato da empresa'),
    address: yup.string().required('Informe o endereço da sua empresa.'),
    remember: yup.string()
});

export default function RegisterPage(){
    const toast = useToast();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { control, watch, handleSubmit, formState} = useForm<SignInFormData>({
        resolver: yupResolver(signInFormSchema),
    });

    const registerProfileForm = async (registerData: SignInFormData) => {
        try{
            const response = await serverApi.post('/auth/register', {
                ...registerData,
                slug: createSlug(registerData.name_display),
                email_display: registerData.email,
                color: "#444",
                second_color: "#efefef",
            });

            const data = response.data

            toast({
                title: 'Sucesso.',
                description: "Já poderá realizar login com os seus dados...",
                status: 'success',
                variant: 'left-accent',
                duration: 9000,
                isClosable: true,
            })

            router.push('/admin/login');
            setIsRedirecting(true);
        }catch(error:any) {
            showErrors(error, toast);
        }
    }

    return(
        <Flex flexDirection="column" px="6" w="100vw" h="100vh" bg="gray.200" alignItems="center" justifyContent="center">
            <Stack alignItems="center" justifyContent="center" spacing="6" mb="8">
                <Heading fontSize="3xl" color="color.800" >Cadastro</Heading>
                <Text fontSize="2xl" color="color.800" >Área de parceiro Lance Consórcio</Text>
            </Stack>

            <Stack pos={"relative"} as="form" onSubmit={handleSubmit(registerProfileForm)} spacing="7" bg="white" p="8" w="100%" maxW="580px" borderRadius="5" boxShadow="lg" mb="8">
                <Stack>
                    <Text fontSize="xl" color="gray.700">Se registre para fazer negócios!</Text>
                    {/* <Text color="gray.700">Ao se cadastrar será preciso confirmar o e-mail e a conta será aprovada pela nossa equipe.</Text> */}
                </Stack>

                <ControlledInput control={control} name="name" type="text" label="Nome fantasia" error={formState.errors.name}/>
                <ControlledInput control={control} name="name_display" type="text" label="Nome da Empresa" error={formState.errors.name}/>
                <Stack direction={["column","column","row","row"]}>
                    <ControlledInput control={control} name="email" type="email" label="E-mail" error={formState.errors.email}/>
                    <ControlledInput control={control} name="phone" type="phone" label="Celular" mask="phone" error={formState.errors.email}/>
                </Stack>
                <ControlledInput control={control} name="cnpj" type="text" mask="cnpj" label="CNPJ" error={formState.errors.cnpj}/>
                <ControlledInput control={control} name="address" type="text" label="Endereço físico" error={formState.errors.email}/>
                <Stack direction={["column","column","row","row"]}>
                    <ControlledInput control={control} name="password" type="password" label="Senha" error={formState.errors.password}/>
                    <ControlledInput control={control} name="confirmPassword" type="password" label="Senha" error={formState.errors.confirmPassword}/>
                </Stack>
                {/* <Checkbox color="gray.600" colorScheme="red">Lembrar acesso</Checkbox> */}

                <SolidButton isLoading={formState.isSubmitting} type="submit" colorScheme="red" w="100%" h="50">Cadastrar</SolidButton>

                {
                    isRedirecting && (
                        <Flex pos={"absolute"} bg="rgb(255,255,255,0.9)" top="0" bottom="0" left="0" right="0" zIndex={2}>
                            <Spinner />
                        </Flex>
                    )
                }
            </Stack>
        </Flex>
    )
}