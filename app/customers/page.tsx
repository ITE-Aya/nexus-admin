"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Customer = {
  id: number;
  name: string;
  email: string;
  status: string;
  country: string;
  orders: number;
  spend: number;
};

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState("");

  const page = Number(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "All";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

useEffect(() => {
  const user = localStorage.getItem("nexus-user");

  if (!user) {
    window.location.href = "/login";
    return;
  }

  const parsedUser = JSON.parse(user);

  setRole(parsedUser.role);
  setAuthorized(true);
}, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/customers?page=${page}&limit=5&search=${encodeURIComponent(
            search
          )}&status=${status}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch customers");
        }

        const result = await res.json();

        setCustomers(result.data);
        setTotalPages(result.pagination.totalPages);
      } catch (error) {
        console.error("Failed to load customers", error);
        setError("Unable to load customers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (authorized) {
      fetchCustomers();
    }
  }, [page, search, status, authorized]);

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`/customers?${params.toString()}`);
  };

  const confirmDelete = async () => {
    const idsToDelete = [...selected];
    const previousCustomers = customers;

    setCustomers((prev) =>
      prev.filter((customer) => !idsToDelete.includes(customer.id))
    );

    setSelected([]);
    setShowDeleteModal(false);

    try {
      const response = await fetch("/api/customers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: idsToDelete,
        }),
      });

      if (!response.ok) {
        throw new Error("Delete request failed");
      }
    } catch (error) {
      console.error(error);

      setCustomers(previousCustomers);

      alert("Delete failed. The customer list was restored.");
    }
  };

  const toggleCustomer = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((customerId) => customerId !== id)
        : [...prev, id]
    );
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <aside className="hidden md:flex w-64 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Nexus Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Management Portal</p>
        </div>

        <nav className="p-4 space-y-2">
          <a
            href="/"
            className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800"
          >
            Dashboard
          </a>

          <a
            href="/customers"
            className="block px-4 py-3 rounded-lg bg-blue-600 text-white"
          >
            Customers
          </a>
          <button
  onClick={() => {
    localStorage.removeItem("nexus-user");
    window.location.href = "/login";
  }}
  className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800"
>
  Logout
</button>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="border-b border-gray-800 px-6 lg:px-10 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Customers</h2>
              <p className="text-sm text-gray-400 mt-1">
                Manage your customer records
              </p>
            </div>

        {role === "admin" && (
  <a
    href="/customers/new"
    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium"
  >
    + Add Customer
  </a>
)}
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex flex-col lg:flex-row gap-4">
              <input
                type="text"
                placeholder="Search customers..."
                defaultValue={search}
                onChange={(e) => updateUrl("search", e.target.value)}
                className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3"
              />

              <select
                value={status}
                onChange={(e) => updateUrl("status", e.target.value)}
                className="bg-gray-950 border border-gray-700 rounded-lg px-4 py-3"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

{role === "admin" && selected.length > 0 && (
                <div className="mt-4 bg-blue-950 border border-blue-800 rounded-xl px-5 py-4 flex justify-between">
              <p>{selected.length} customer(s) selected</p>

             <button
  onClick={() => setShowDeleteModal(true)}
  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
>
  Delete
</button>
            </div>
          )}

          <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
           {loading ? (
  <div className="p-5 space-y-4">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="grid grid-cols-7 gap-4 items-center animate-pulse"
      >
        <div className="h-4 w-4 bg-gray-800 rounded" />

        <div>
          <div className="h-4 bg-gray-800 rounded w-28 mb-2" />
          <div className="h-3 bg-gray-800 rounded w-36" />
        </div>

        <div className="h-4 bg-gray-800 rounded w-16" />
        <div className="h-4 bg-gray-800 rounded w-20" />
        <div className="h-4 bg-gray-800 rounded w-8" />
        <div className="h-4 bg-gray-800 rounded w-16" />
        <div className="h-4 bg-gray-800 rounded w-10" />
      </div>
    ))}
  </div>
) : error ? (
  <div className="p-10 text-center">
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-red-400">
        Failed to load customers
      </h3>

      <p className="text-gray-400 mt-2">
        {error}
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-5 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
      >
        Try Again
      </button>
    </div>
  </div>
) : customers.length === 0 ? (
  <div className="p-10 text-center">
    <h3 className="text-lg font-semibold">
      No customers found
    </h3>

    <p className="text-gray-400 mt-2">
      Try changing your search or filters.
    </p>
  </div>
) : (
  <table className="w-full">
    <thead className="bg-gray-950 text-gray-400 text-sm">
      <tr>
        <th className="px-5 py-4"></th>
        <th className="text-left px-5 py-4">Customer</th>
        <th className="text-left px-5 py-4">Status</th>
        <th className="text-left px-5 py-4">Country</th>
        <th className="text-left px-5 py-4">Orders</th>
        <th className="text-left px-5 py-4">Spend</th>
        <th className="text-left px-5 py-4">Actions</th>
      </tr>
    </thead>

    <tbody>
      {customers.map((customer) => (
        <tr
          key={customer.id}
          className="border-t border-gray-800"
        >
          <td className="px-5 py-4">
            <input
              type="checkbox"
              checked={selected.includes(customer.id)}
              onChange={() => toggleCustomer(customer.id)}
            />
          </td>

          <td className="px-5 py-4">
            <p>{customer.name}</p>
            <p className="text-sm text-gray-500">
              {customer.email}
            </p>
          </td>

          <td className="px-5 py-4">
            {customer.status}
          </td>

          <td className="px-5 py-4">
            {customer.country}
          </td>

          <td className="px-5 py-4">
            {customer.orders}
          </td>

          <td className="px-5 py-4">
            ${customer.spend.toLocaleString()}
          </td>

          <td className="px-5 py-4">
            <a
              href={`/customers/${customer.id}`}
              className="text-blue-400"
            >
              View
            </a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

            <div className="border-t border-gray-800 px-5 py-4 flex justify-between">
              <p className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() =>
                    updateUrl("page", String(page - 1))
                  }
                  className="border border-gray-700 px-3 py-2 rounded-lg disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  disabled={page >= totalPages}
                  onClick={() =>
                    updateUrl("page", String(page + 1))
                  }
                  className="border border-gray-700 px-3 py-2 rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showDeleteModal && (
  <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl"
    >
      <h2 id="delete-title" className="text-xl font-semibold">
        Delete customers?
      </h2>

      <p className="text-gray-400 mt-3">
        You are about to delete {selected.length} customer(s). This action cannot
        be undone.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
  onClick={confirmDelete}
  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
>
  Confirm Delete
</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}