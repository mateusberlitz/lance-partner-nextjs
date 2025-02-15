import { Checkbox, Flex, HStack, Link, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { Input } from "../../../components/Forms/Inputs/Input";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api, serverApi } from "../../../services/api";
import { useRouter } from "next/router";
import { ProfileProvider, useProfile } from "../../../contexts/useProfile";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { showErrors } from "../../../contexts/useErrors";
import { useState } from "react";
import { Check } from "react-feather";

interface SignInFormData{
    email: string;
}

const signInFormSchema = yup.object().shape({
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido.'),
});

export default function RecoveryPage(){
    const toast = useToast();
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);

    const { control, watch, handleSubmit, formState} = useForm<SignInFormData>({
        resolver: yupResolver(signInFormSchema),
    });

    const sendRecoveryEmail = async (recoveryData: SignInFormData) => {
        try{
            const response = await serverApi.post('/password/email', {
                ...recoveryData,
            });

            setIsSuccess(true);

            // toast({
            //     title: 'Sucesso.',
            //     description: "Já poderá realizar login com os seus dados...",
            //     status: 'success',
            //     variant: 'left-accent',
            //     duration: 9000,
            //     isClosable: true,
            // })
        }catch(error:any) {
            showErrors(error, toast);
        }
    }

    return(
        <Flex flexDirection="column" px="6" w="100vw" h="100vh" bg="gray.200" alignItems="center" justifyContent="center">
            <Text fontSize="2xl" color="color.800" mb="8">Recuperar senha</Text>

            <Stack pos={"relative"} as="form" onSubmit={handleSubmit(sendRecoveryEmail)} spacing="7" bg="white" p="8" w="100%" maxW="380px" borderRadius="5" boxShadow="lg" mb="8">
                <Text fontSize="2xl" fontWeight="bold">Enviar e-mail</Text>

                <ControlledInput control={control} name="email" type="email" label="E-mail" error={formState.errors.email}/>

                {/* <Checkbox color="gray.600" colorScheme="red">Lembrar acesso</Checkbox> */}

                <SolidButton isLoading={formState.isSubmitting} type="submit" colorScheme="red" w="100%" h="50">Entrar</SolidButton>
                {/* <HStack textAlign={"center"} w="100%" justifyContent={"center"}>
                    <Link href="/admin/register">Criar uma conta de parceiro.</Link>
                </HStack> */}
                <Link href="/admin/login"><Text color="gray.700">Voltar para o login</Text></Link>

                {
                    isSuccess && (
                        <Flex pos={"absolute"} bg="rgb(255,255,255,1)" top="0" bottom="0" left="0" right="0" padding={10} zIndex={2}>
                            <HStack spacing="6">
                                <Check />
                                <Stack>
                                    <Text fontSize={"xl"}>E-mail enviado</Text>
                                    <Text>Confira o link de recuperação no seu e-mail cadastrado</Text>
                                </Stack>
                            </HStack>
                        </Flex>
                    )
                }
            </Stack>
        </Flex>
    )
}