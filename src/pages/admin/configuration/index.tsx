
import { ProfileProvider } from "../../../contexts/useProfile";
import AdminPage from "..";
import ConfigurationPage from "./configurationPage";

export default function Admin(){
    return(
        <ProfileProvider>
            <ConfigurationPage />
        </ProfileProvider>
    )
}