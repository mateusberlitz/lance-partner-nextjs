import {
  Checkbox,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { Input } from "../../../components/Forms/Inputs/Input";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api, serverApi } from "../../../services/api";
import { useRouter } from "next/router";
import { ProfileProvider, useProfile } from "../../../contexts/useProfile";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { showErrors } from "../../../contexts/useErrors";
import { createSlug } from "../../../utils/createSlug";
import { useState } from "react";

interface ResetFormData {
  email: string;
  password: string;
  password_confirmation: string;
}

const resetFormData = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido."),
  password: yup.string().required("Senha Obrigatória"),
  password_confirmation: yup.string().required("Senha Obrigatória"),
});

export default function ResetPage() {
  const toast = useToast();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { control, watch, handleSubmit, formState } = useForm<ResetFormData>({
    resolver: yupResolver(resetFormData),
  });

  const registerProfileForm = async (resetData: ResetFormData) => {
    try {
      const response = await serverApi.post("password/reset", {
        ...resetData,
        token: router.query.token,
      });

      const data = response.data;

      toast({
        title: "Sucesso.",
        description: "Já poderá realizar login com a sua nova senha...",
        status: "success",
        variant: "left-accent",
        duration: 9000,
        isClosable: true,
      });

      router.push("/admin/login");
      setIsRedirecting(true);
    } catch (error: any) {
      showErrors(error, toast);
    }
  };

  return (
    <Flex
      flexDirection="column"
      px="6"
      w="100vw"
      h="100vh"
      bg="gray.200"
      alignItems="center"
      justifyContent="center"
    >
      <Stack alignItems="center" justifyContent="center" spacing="6" mb="8">
        <Heading fontSize="3xl" color="color.800">
          Redefinição de senha
        </Heading>
        <Text fontSize="2xl" color="color.800">
          Informe sua nova senha
        </Text>
      </Stack>

      <Stack
        as="form"
        onSubmit={handleSubmit(registerProfileForm)}
        spacing="7"
        bg="white"
        p="8"
        w="100%"
        maxW="420px"
        borderRadius="5"
        boxShadow="lg"
        mb="8"
      >
        <ControlledInput
          control={control}
          name="email"
          type="email"
          label="E-mail"
          error={formState.errors.email}
        />

        <ControlledInput
          control={control}
          name="password"
          type="password"
          label="Senha"
          error={formState.errors.password}
        />

        <ControlledInput
          control={control}
          name="password_confirmation"
          type="password"
          label="Senha"
          error={formState.errors.password_confirmation}
        />
        {/* <Checkbox color="gray.600" colorScheme="red">Lembrar acesso</Checkbox> */}

        <SolidButton
          isLoading={formState.isSubmitting}
          type="submit"
          colorScheme="red"
          w="100%"
          h="50"
        >
          Redefinir
        </SolidButton>

        {isRedirecting && (
          <Flex
            pos={"absolute"}
            bg="rgb(255,255,255,0.7)"
            top="0"
            bottom="0"
            left="0"
            right="0"
          >
            <Spinner />
          </Flex>
        )}
      </Stack>
    </Flex>
  );
}
