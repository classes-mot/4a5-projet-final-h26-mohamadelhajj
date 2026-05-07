import { useEffect, useState } from "react";
import UserList from "../components/userList/UserList";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("users");
        const reponse = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + "users/allUsers",
        );
        console.log(reponse);
        setLoadedUsers(reponse.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => clearError()} />
      </div>
      <UserList items={loadedUsers} />
    </>
  );
};

export default Users;
