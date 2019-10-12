import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

import Loader from "@Components/Loader";
import { AuthContext } from "@Context/Auth";

export default () => {
  const { logout } = useContext(AuthContext);
  const { replace } = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await logout();
      } catch {}
      replace("/");
    })();
  }, []);

  return <Loader active />;
};
