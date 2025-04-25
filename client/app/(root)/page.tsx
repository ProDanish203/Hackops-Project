import { PageTitle } from "@/components/helpers";

export default function Home() {
  return (
    <section className="section">
      <PageTitle
        title="Dashboard"
        desc="Explore the insights of your store from this dashboard"
      />
      <div className="flex items-center overflow-x-auto gap-x-5 my-5 w-full">
        <DashboardCard title="Total Sales" number={100} />
        <DashboardCard title="Total Orders" number={50} />
        <DashboardCard title="Total Customers" number={20} />
        <DashboardCard title="Total Products" number={10} />
      </div>
    </section>
  );
}

const DashboardCard = ({
  title,
  number,
}: {
  title: string;
  number: number;
}) => {
  return (
    <div className="min-w-56 bg-neutral-100 dark:bg-neutral-900 rounded-lg py-5 px-5 w-full">
      <p className="text-text dark:text-darkText text-4xl font-bold">
        {number}
      </p>
      <h3 className="text-text dark:text-darkText sm:text-lg">{title}</h3>
    </div>
  );
};
