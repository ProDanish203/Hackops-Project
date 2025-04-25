"use client";
import { getAllUsers } from "@/API/user.api";
import { PageTitle } from "@/components/helpers";
import { DataTable } from "@/components/shared";
import { usersTableHeaders } from "@/lib/data";
import { useQuery } from "@tanstack/react-query";

interface SearchParams {
  search: string;
  filter: string;
  limit: number;
  page: number;
}

const UserPage = ({ searchParams }: { searchParams: SearchParams }) => {
  const { filter, limit, page, search } = searchParams;
  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search, filter, limit],
    queryFn: () =>
      getAllUsers({
        limit,
        page,
        search,
        filter,
      }),
  });

  return (
    <section className="section">
      <PageTitle title="Users" desc="View all signed up users." />

      <div className="mt-8">
        <DataTable
          headers={usersTableHeaders}
          isUsers
          data={data?.response.data}
          pagination={data?.response.pagination}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

export default UserPage;
