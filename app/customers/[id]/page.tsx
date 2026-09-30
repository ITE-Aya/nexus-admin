const customerData = {
  1: {
    name: "Sarah Connor",
    email: "sarah@example.com",
    phone: "+1 555 123 4567",
    status: "Active",
    country: "United States",
    orders: 12,
    spend: "$8,240",
    joined: "Sep 14, 2025",
  },
  2: {
    name: "John Smith",
    email: "john@example.com",
    phone: "+44 7700 900123",
    status: "Active",
    country: "United Kingdom",
    orders: 5,
    spend: "$2,910",
    joined: "Jan 11, 2026",
  },
  3: {
    name: "Alex Morgan",
    email: "alex@example.com",
    phone: "+1 416 555 9012",
    status: "Inactive",
    country: "Canada",
    orders: 2,
    spend: "$840",
    joined: "Mar 08, 2026",
  },
};

export default async function CustomerDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer =
    customerData[Number(id) as keyof typeof customerData] || customerData[1];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-8 py-6">
        <a href="/customers" className="text-blue-400 text-sm">
          ← Back to Customers
        </a>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-gray-400 mt-1">{customer.email}</p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
            Edit Customer
          </button>
        </div>
      </header>

      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Customer Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="mt-1">{customer.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1">{customer.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="mt-1">{customer.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="mt-1">{customer.country}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="inline-block mt-2 bg-green-950 text-green-400 px-3 py-1 rounded-full text-sm">
                    {customer.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Customer Since</p>
                  <p className="mt-1">{customer.joined}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Recent Orders</h2>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between border-b border-gray-800 pb-4">
                  <div>
                    <p className="font-medium">Order #1052</p>
                    <p className="text-sm text-gray-500">Sep 28, 2026</p>
                  </div>

                  <div className="text-right">
                    <p>$540</p>
                    <p className="text-green-400 text-sm">Completed</p>
                  </div>
                </div>

                <div className="flex justify-between border-b border-gray-800 pb-4">
                  <div>
                    <p className="font-medium">Order #1038</p>
                    <p className="text-sm text-gray-500">Sep 14, 2026</p>
                  </div>

                  <div className="text-right">
                    <p>$910</p>
                    <p className="text-green-400 text-sm">Completed</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Order #1011</p>
                    <p className="text-sm text-gray-500">Aug 30, 2026</p>
                  </div>

                  <div className="text-right">
                    <p>$320</p>
                    <p className="text-red-400 text-sm">Refunded</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Overview</h2>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold mt-1">{customer.orders}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Lifetime Value</p>
                  <p className="text-2xl font-bold mt-1">{customer.spend}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold">Activity Timeline</h2>

              <div className="mt-6 space-y-6">
                <div className="border-l border-blue-500 pl-4">
                  <p className="font-medium">Profile updated</p>
                  <p className="text-sm text-gray-500">Sep 29, 2026 · 14:25</p>
                </div>

                <div className="border-l border-green-500 pl-4">
                  <p className="font-medium">Order #1052 completed</p>
                  <p className="text-sm text-gray-500">Sep 28, 2026 · 10:15</p>
                </div>

                <div className="border-l border-gray-600 pl-4">
                  <p className="font-medium">Customer created</p>
                  <p className="text-sm text-gray-500">{customer.joined}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}