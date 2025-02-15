import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { setDefaultResultOrder } from "dns";
import { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { api, serverApi } from "../../services/api";


interface ProfileProviderProps{
    children: ReactNode;
}

interface SimplePermission{
    name: string;
}

interface ProfileContextData{
    profile?: Profile;
    isAuthenticated: Boolean;
    loading: Boolean;
    signIn: (signInData: SignInFormData) => Promise<void>;
    signOut: () => void;
}

interface SignInFormData{
    email: string;
    password: string;
    remember?: string;
}

export interface Profile{
    id: number;
    slug: string;
    name: string;
    name_display: string;
    email: string;
    email_display: string;
    address: string;
    phone: string;
    master: boolean;
    logo: string;
    color: string;
    second_color: string;
    created_at?: string;
    email_verified_at?: string;
}

const ProfileContext = createContext<ProfileContextData>({} as ProfileContextData);

export function ProfileProvider({ children } : ProfileProviderProps){
    const toast = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [profile, setProfile] = useState<Profile>();
    const [token, setToken] = useState<string>(() => {

        const { 'partner.token' : token } = parseCookies();

        return token;

    });
    const isAuthenticated = !!profile;
    const router = useRouter();

    async function signIn(signInData : SignInFormData){
        try{
            const response = await api.post('/authenticate', signInData);

            const data = response.data

            setCookie(undefined, 'partner.token', data.access_token, {
                maxAge: data.expires_in,
                path: '/'
            });

            setToken(data.access_token);

            router.push('/admin');
        }catch(error:any) {
            let errorMessage = '';

            if(error.response){
                errorMessage = error.response.data.error;
            }else{
                errorMessage = error.message;
            }

            toast({
                title: 'Erro.',
                description: errorMessage,
                status: 'error',
                variant: 'left-accent',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    async function signOut(){
        destroyCookie(undefined, 'partner.token');

        router.push('/admin/login')
    }

    useEffect(() => {
        loadProfile();
    }, []);

    //LOADERS
    const loadProfile = async () => {
        setLoading(true);
        if(token){
            await serverApi.get('/me')
            .then((response) => {
                // const data: Profile = {
                //     name: response.data.name,
                //     name_display: response.data.name_display,
                //     address: response.data.address,
                //     email: response.data.email,
                //     email_display: response.data.email_display,
                //     phone: response.data.phone,
                //     logo: response.data.logo,
                //     color: response.data.color,
                //     second_color: response.data.second_color,
                // };
                // console.log(data);

                setProfile(response.data);
                setLoading(false);
            })
            .catch((error: AxiosError) => {
                signOut();
                setLoading(false);
            });
        }else{
            if(router.asPath !== '/admin/login'){
                signOut();
                setLoading(false);
            }
        }
    }

    return(
        <ProfileContext.Provider value={{profile, loading, signIn, signOut, isAuthenticated}}>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfile = () => useContext(ProfileContext);