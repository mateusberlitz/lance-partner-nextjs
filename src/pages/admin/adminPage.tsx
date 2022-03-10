import { Box, Divider, Flex, Heading, HStack, Icon, Img, Input, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Router, { useRouter } from "next/router";
import { Edit, LogOut } from "react-feather";
import { OutlineButton } from "../../components/Buttons/OutlineButton";
import { ControlledInput } from "../../components/Forms/Inputs/ControlledInput";
import { TextTag } from "../../components/TextTag";
import { useProfile } from "../../contexts/useProfile";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SolidButton } from "../../components/Buttons/SolidButton";
import { useEffect, useRef, useState } from "react";
import { serverApi, storageApi } from "../../services/api";
import { showErrors } from "../../contexts/useErrors";
import { ColorPicker } from "../../components/Forms/ColorPicker";

interface ProfileFormData{
    name: string;
    name_display?: string;
    email: string;
    email_display?: string;
    address: string;
    phone: string;
    logo?: File;
    color?: string;
    second_color?: string;
}

const profileFormSchema = yup.object().shape({
    name: yup.string().required('É preciso inserir um nome'),
    name_display: yup.string().nullable(),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido.'),
    email_display: yup.string().email('E-mail inválido.').nullable(),
    address: yup.string().required('Endereço é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório'),
    color: yup.string().required('Defina uma cor principal para sua página'),
    second_color: yup.string().required('Defina uma cor secundária para sua página'),
});

export default function AdminPage(){
    const toast = useToast();
    const router = useRouter();
    const { profile, signOut } = useProfile();

    const { control, watch, handleSubmit, formState} = useForm<ProfileFormData>({
        resolver: yupResolver(profileFormSchema),
    });

    const editLogoRef = useRef<HTMLInputElement>(null);

    const handleChangeLogo = () => {
        if(editLogoRef.current){
            editLogoRef.current.click();
        }
    }

    const [profileImage, setProfileImage] = useState("");

    const [profileFileName, setProfileFileName] = useState("");
    const [toFormFile, setToFormFile] = useState<File>();


    function handleChangeFile(event: any){
        if(event.target.files.length){
            setProfileImage(URL.createObjectURL(event.target.files[0]));
            setProfileFileName(event.target.files[0].name);

            setToFormFile(event.target.files[0]);
        }else{
            setProfileImage("");
            setProfileFileName("");

            setToFormFile(event.target);
        }
    }

    const handleSaveProfile = async (selfData : ProfileFormData) => {
        try{
            const userFormedData = new FormData();
            if(toFormFile !== undefined){
                userFormedData.append('logo', toFormFile);
            }

            userFormedData.append('name', selfData.name);
            userFormedData.append('name_display', selfData.name_display ? selfData.name_display : '');
            userFormedData.append('email', selfData.email);
            userFormedData.append('email_display', selfData.email_display ? selfData.email_display : '');
            userFormedData.append('phone', selfData.phone);
            userFormedData.append('address', selfData.address);
            userFormedData.append('color', selfData.color ? selfData.color : '');
            userFormedData.append('second_color', selfData.second_color ? selfData.second_color : '');

            if(profile){
                await serverApi.post('/users/self', userFormedData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });

                toast({
                    title: "Sucesso",
                    description: `Seus dados foram salvos.`,
                    status: "success",
                    variant: 'left-accent',
                    duration: 12000,
                    isClosable: true,
                });
            }

        }catch(error: any) {
            showErrors(error, toast);

            if(error.response && error.response.data.access){
                router.push('/');
            }
        }
    }

    const [color, setColor] = useState("");
    const [secondColor, setSecondColor] = useState("");

    useEffect(() => {
        if(profile){
            setProfileImage(`${storageApi}${profile.logo}`);
            setColor(profile.color);
            setSecondColor(profile.second_color);
        }
    }, [profile])

    return profile ? (
        <Box bg="gray.100">
            <Flex flexDir="column" w="100%" bg="white" boxShadow="sm" mb="10" px="6">
                <HStack w="100%" maxW="1000px" m="0 auto" py="8" justifyContent="space-between">
                    <HStack spacing={["6","12"]}>
                        <a href="https://lanceconsorcio.com.br">
                            <Img w="100%" maxW={["100px", "100px", "100px" ]} src={`/lance.svg`} alt="Lance Consórcio - O plano para conquistar seus sonhos" flexWrap="wrap"/>
                        </a>
                        <Divider orientation="vertical" borderColor="red.500" h="30px" />
                        <Heading fontSize={["lg", "xl", "2xl" ]} fontWeight="normal" color="gray.900">Plataforma de contempladas</Heading>
                    </HStack>

                    <OutlineButton onClick={() => signOut()} px="4" size="sm" leftIcon={<Icon as={LogOut} />} borderColor="gray.300" _hover={{borderColor: 'gray.900'}}>
                        Sair
                    </OutlineButton>
                </HStack>
            </Flex>

            <Flex flexDir="column" w="100%" px="6">
                <Stack w="100%" maxW="1000px" m="0 auto" py="5" spacing="20" mb="32">
                    <Stack flexDirection={['column', 'row']} spacing="8" justifyContent="space-between">
                        <Stack>
                            <TextTag>Gerencie suas informações</TextTag>
                            <Heading color="gray.900">{profile.name}</Heading>
                        </Stack>

                        <Stack alignItems="center" spacing="6">
                            <Flex onClick={() => handleChangeLogo()} borderRadius="3" bg="gray.500" maxW={["200px", "200px", "300px" ]} p="6" border="1px dashed" borderColor="gray.600" cursor="pointer" _hover={{border: '1px solid', borderColor: 'gray.800'}}>
                                {
                                    profile.logo ? <Img w="100%" src={profileImage} alt="Lance Consórcio - O plano para conquistar seus sonhos" flexWrap="wrap"/>
                                    : <Text>Insira sua logo</Text>
                                }
                            </Flex>

                            <Input ref={editLogoRef} name="image" type="file" accept="image/png, image/jpeg" display="none" onChange={handleChangeFile}/> 

                            <OutlineButton onClick={() => handleChangeLogo()} px="4" size="sm" leftIcon={<Icon as={Edit} />} borderColor="gray.300" _hover={{borderColor: 'gray.900'}}>
                                Editar
                            </OutlineButton>
                        </Stack>
                    </Stack>

                    <Divider />

                    <Stack as="form" spacing="8" onSubmit={handleSubmit(handleSaveProfile)}>
                        <Stack  direction={["column", "row"]} spacing="6">
                            <ControlledInput control={control} type="text" name="name" value={profile.name} label="Nome da empresa" error={formState.errors.name} isDisabled/>
                            <ControlledInput control={control} type="text" name="name_display" value={profile.name_display} label="Nome da empresa" error={formState.errors.name_display}/>
                        </Stack>

                        <Stack direction={["column", "row"]} spacing="6">
                            <ControlledInput control={control} type="text" name="email" value={profile.email} label="E-mail principal" error={formState.errors.email} isDisabled/>
                            <ControlledInput control={control} type="text" name="email_display" value={profile.email_display} label="E-mail secundário" error={formState.errors.email_display}/>
                        </Stack>

                        <Stack direction={["column", "row"]} spacing="6">
                            <ControlledInput control={control} type="tel" mask="phone" name="phone" value={profile.phone} label="Telefone" error={formState.errors.phone}/>
                            <ControlledInput control={control} type="text" name="address" value={profile.address} label="Endereço" error={formState.errors.address}/>
                        </Stack>

                        <Stack direction={["column", "row"]} spacing="6">
                            <ControlledInput pt="5" pb="1" control={control} type="color" name="color" value={profile.color} label="Cor primária" error={formState.errors.color}/>
                            <ControlledInput pt="5" pb="1" control={control} type="color" name="second_color" value={profile.second_color} label="Cor secundária" error={formState.errors.second_color}/>
                        </Stack>

                        {/* <Stack direction={["column", "row"]} spacing="6">
                            <ColorPicker color={color} setNewColor={setColor}/>
                            <ColorPicker color={secondColor} setNewColor={setSecondColor}/>
                        </Stack> */}

                        <Flex px="6" w="100%" pos="fixed" bottom="0" left="0" right="0" bg="white" zIndex={1} boxShadow="sm">
                            <Flex m="0 auto" py="4" w="100%" maxW="1000px" justifyContent="right">
                                <SolidButton isLoading={formState.isSubmitting} type="submit" colorScheme="red" h="50">Salvar</SolidButton>
                            </Flex>
                        </Flex>
                    </Stack>
                </Stack>
            </Flex>
        </Box>
    ) : (
        <Flex flexDirection="column" w="100vw" h="100vh" bg="gray.200" alignItems="center" justifyContent="center">
            <Spinner/>
        </Flex>
    )
}