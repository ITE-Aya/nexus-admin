import { NextRequest, NextResponse } from "next/server";

let customers = [
  {
    id: 1,
    name: "Sarah Connor",
    email: "sarah@example.com",
    status: "Active",
    country: "United States",
    orders: 12,
    spend: 8240,
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    status: "Active",
    country: "United Kingdom",
    orders: 5,
    spend: 2910,
  },
  {
    id: 3,
    name: "Alex Morgan",
    email: "alex@example.com",
    status: "Inactive",
    country: "Canada",
    orders: 2,
    spend: 840,
  },
  {
    id: 4,
    name: "Emily Stone",
    email: "emily@example.com",
    status: "Active",
    country: "Australia",
    orders: 9,
    spend: 5120,
  },
  {
    id: 5,
    name: "Daniel Lee",
    email: "daniel@example.com",
    status: "Inactive",
    country: "Germany",
    orders: 3,
    spend: 1430,
  },
  {
    id: 6,
    name: "Sophia Brown",
    email: "sophia@example.com",
    status: "Active",
    country: "United States",
    orders: 7,
    spend: 3640,
  },
  {
    id: 7,
    name: "Michael Scott",
    email: "michael@example.com",
    status: "Active",
    country: "Canada",
    orders: 10,
    spend: 6890,
  },
  {
    id: 8,
    name: "Olivia Davis",
    email: "olivia@example.com",
    status: "Inactive",
    country: "Australia",
    orders: 1,
    spend: 320,
  },
  {
    id: 9,
    name: "James Wilson",
    email: "james@example.com",
    status: "Active",
    country: "Germany",
    orders: 8,
    spend: 4410,
  },
  {
    id: 10,
    name: "Emma Taylor",
    email: "emma@example.com",
    status: "Active",
    country: "United Kingdom",
    orders: 6,
    spend: 2980,
  },
  {
    id: 11,
    name: "Noah Clark",
    email: "noah@example.com",
    status: "Inactive",
    country: "United States",
    orders: 2,
    spend: 720,
  },
  {
    id: 12,
    name: "Mia Anderson",
    email: "mia@example.com",
    status: "Active",
    country: "Canada",
    orders: 11,
    spend: 7520,
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "5");
  const search = (searchParams.get("search") || "").toLowerCase();
  const status = searchParams.get("status") || "All";

  let filtered = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search);

    const matchesStatus =
      status === "All" || customer.status === status;

    return matchesSearch && matchesStatus;
  });

  const total = filtered.length;

  const start = (page - 1) * limit;
  const end = start + limit;

  filtered = filtered.slice(start, end);

  return NextResponse.json({
    data: filtered,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const ids = body.ids as number[];

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "No customer IDs provided" },
        { status: 400 }
      );
    }

    const beforeCount = customers.length;

    customers = customers.filter(
      (customer) => !ids.includes(customer.id)
    );

    const deletedCount = beforeCount - customers.length;

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `${deletedCount} customer(s) deleted`,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete customers" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, status } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: "First name, last name and email are required" },
        { status: 400 }
      );
    }

    const newCustomer = {
      id:
        customers.length > 0
          ? Math.max(...customers.map((customer) => customer.id)) + 1
          : 1,
      name: `${firstName} ${lastName}`,
      email,
      status: status || "Active",
      country: "Not specified",
      orders: 0,
      spend: 0,
    };

    customers.push(newCustomer);

    return NextResponse.json(
      {
        success: true,
        data: newCustomer,
        message: "Customer created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/customers error:", error);

    return NextResponse.json(
      { message: "Failed to create customer" },
      { status: 500 }
    );
  }
}