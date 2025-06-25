import { Header } from "components";

const Dashboard = () => {
    const user = {
        name: "Prashrijan",
        email: "shresthaprashrijan@gmail.com",
        imageUrl: "/assets/images/david.webp",
    };
    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${user?.name ?? "Guest"} 👋`}
                description="Track activity, trends and popular destinations in real time."
            />
            dashboard page contents
        </main>
    );
};

export default Dashboard;
