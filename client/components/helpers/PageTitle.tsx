export const PageTitle = ({
  title,
  desc,
}: {
  title: string;
  desc?: string;
}) => {
  return (
    <div className="">
      <h2 className="text-text dark:text-darkText md:text-5xl text-3xl font-semibold ">
        {title}
      </h2>
      {desc && (
        <p className="mt-2 max-sm:text-sm tracking-wide text-neutral-500 dark:text-white/40 max-w-[500px]">
          {desc}
        </p>
      )}
    </div>
  );
};
