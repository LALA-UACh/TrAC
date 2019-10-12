import App from "@Components/Dashboard";
import Auth from "@Context/Auth";

export default () => {
  return (
    <Auth>
      <App />
    </Auth>
  );
};
