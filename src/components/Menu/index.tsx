import {
  Button,
  Divider,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Icon,
  Img,
  Stack,
  Text,
  useBreakpointValue,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BarChart, List, LogOut, Settings } from "react-feather";
import { useProfile } from "../../contexts/useProfile";
import { OutlineButton } from "../Buttons/OutlineButton";
import { SolidButton } from "../Buttons/SolidButton";
import { HeaderLink } from "../Header/HeaderLink";

export function Menu() {
  const { profile, signOut } = useProfile();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCopy, value, hasCopied } = useClipboard(
    profile && profile.slug
      ? `https://centraldecontempladas.com.br/${profile.slug}`
      : ""
  );

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex flexDir="column" w="100%" bg="white" boxShadow="sm" mb="10" px="6">
      <HStack
        w="100%"
        maxW="1200px"
        m="0 auto"
        py="8"
        justifyContent="space-between"
      >
        <HStack spacing={["6", "6"]}>
          <Link href="/admin/" passHref>
            <Img
              w="100%"
              maxW={["100px", "100px", "130px"]}
              src={`/lance-logo-preto.png`}
              alt="Lance Consórcio - O plano para conquistar seus sonhos"
              flexWrap="wrap"
            />
          </Link>
          <Divider orientation="vertical" borderColor="red.500" h="30px" />
          <Heading
            fontSize={["md", "xl", "xl"]}
            fontWeight="normal"
            color="gray.900"
          >
            Plataforma de contempladas
          </Heading>
        </HStack>

        {isWideVersion ? (
          <Stack>
            <HStack>
              <Link href="/admin/" passHref>
                {router.asPath === "/admin" ? (
                  <SolidButton
                    px="4"
                    size="sm"
                    leftIcon={<Icon as={List} />}
                    borderColor="gray.300"
                    bgColor="black"
                    color="white"
                    _hover={{ borderColor: "gray.900" }}
                  >
                    Cartas
                  </SolidButton>
                ) : (
                  <OutlineButton
                    px="4"
                    size="sm"
                    leftIcon={<Icon as={List} />}
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.900" }}
                  >
                    Cartas
                  </OutlineButton>
                )}
              </Link>
              <Link href="/admin/dashboard" passHref>
                {router.asPath === "/admin/dashboard" ? (
                  <SolidButton
                    px="4"
                    size="sm"
                    leftIcon={<Icon as={BarChart} />}
                    borderColor="gray.300"
                    bgColor="black"
                    color="white"
                    _hover={{ borderColor: "gray.900" }}
                  >
                    Dashboard
                  </SolidButton>
                ) : (
                  <OutlineButton
                    px="4"
                    size="sm"
                    leftIcon={<Icon as={BarChart} />}
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.900" }}
                  >
                    Dashboard
                  </OutlineButton>
                )}
              </Link>
              <Link href="/admin/configuration" passHref>
                {router.asPath === "/admin/configuration" ? (
                  <SolidButton
                    px="4"
                    size="sm"
                    leftIcon={<Icon as={Settings} />}
                    borderColor="gray.300"
                    bgColor="black"
                    color="white"
                    _hover={{ borderColor: "gray.900" }}
                  >
                    Configurações
                  </SolidButton>
                ) : (
                  <OutlineButton
                    px="4"
                    size="sm"
                    leftIcon={<Icon as={Settings} />}
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.900" }}
                  >
                    Configurações
                  </OutlineButton>
                )}
              </Link>
              <OutlineButton
                onClick={() => signOut()}
                px="4"
                size="sm"
                leftIcon={<Icon as={LogOut} />}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.900" }}
              >
                Sair
              </OutlineButton>
            </HStack>

            {profile && profile.slug && (
              <HStack>
                <Text>Página:</Text>
                <Text
                  fontSize={"11px"}
                  backgroundColor={"gray.100"}
                  color="gray.600"
                >
                  https://centraldecontempladas.com.br/{profile.slug}
                </Text>
                <Button onClick={onCopy} size="sm" padding={"4px 4px"} h="25px">
                  <Text fontSize={"10px"}>
                    {hasCopied ? "Copied!" : "Copy"}
                  </Text>
                </Button>
              </HStack>
            )}
          </Stack>
        ) : (
          <>
            <Button
              onClick={onOpen}
              bg="transparent"
              px="2"
              leftIcon={<Icon as={List} w={6} h={6} />}
            >
              Menu
            </Button>

            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              //finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent
                px="7"
                pr="16"
                bg="rgba(0,0,0,0.4);"
                backdropFilter="blur(20px)"
                color="white"
              >
                <DrawerCloseButton fontSize="16px" top="3" right="4" />
                <Stack direction={isWideVersion ? "row" : "column"} spacing="8">
                  <HeaderLink href={"/admin"}>Cartas</HeaderLink>
                  <HeaderLink href={"/admin/dashboard"}>Dashboard</HeaderLink>
                  <HeaderLink href={"/admin/configuration"}>
                    Configuração
                  </HeaderLink>
                  <OutlineButton
                    onClick={() => signOut()}
                    px="4"
                    size="sm"
                    leftIcon={<Icon as={LogOut} />}
                    borderColor="gray.300"
                    _hover={{ borderColor: "gray.900" }}
                  >
                    Sair
                  </OutlineButton>
                </Stack>
              </DrawerContent>
            </Drawer>
          </>
        )}
      </HStack>
    </Flex>
  );
}
