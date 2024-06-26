import useNameStore from "./store";

const HomePage = () => {
  const { name } = useNameStore();
  return <div>Welcome to {name} app.</div>;
};

export default HomePage;
