"use client";

import { useEffect, useState } from "react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: "Individual" | "Business";
  companyName: string;
  vatNumber: string;
  status: "Active" | "Inactive";
};

const initialData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  type: "Individual",
  companyName: "",
  vatNumber: "",
  status: "Active",
};

export default function NewCustomerPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const savedDraft = localStorage.getItem("customer-draft");

    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("customer-draft", JSON.stringify(formData));
      setSaved(true);

      setTimeout(() => setSaved(false), 1500);
    }, 700);

    return () => clearTimeout(timer);
  }, [formData]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Enter a valid email";
      }
    }

    if (step === 2 && formData.type === "Business") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const previousStep = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

const handleSubmit = async () => {
  setSubmitting(true);
  setSubmitError("");

  try {
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    let result: any = {};

    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      throw new Error(result.message || "Failed to create customer");
    }

    localStorage.removeItem("customer-draft");

    window.location.href = "/customers";
  } catch (error) {
    setSubmitError(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 lg:px-10 py-6">
        <a href="/customers" className="text-blue-400 text-sm">
          ← Back to Customers
        </a>

        <div className="mt-4">
          <h1 className="text-3xl font-bold">Add Customer</h1>
          <p className="text-gray-400 mt-1">
            Create a new customer record
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 lg:p-10">
        <div className="mb-8">
            {submitError && (
  <div className="mt-6 bg-red-950 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
    {submitError}
  </div>
)}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= item
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {item}
                </div>

                {item < 3 && (
                  <div
                    className={`h-1 flex-1 mx-3 rounded ${
                      step > item ? "bg-blue-600" : "bg-gray-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 mt-3 text-sm text-gray-400">
            <span>Personal</span>
            <span className="text-center">Account</span>
            <span className="text-right">Review</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                <div>
                  <label className="text-sm text-gray-400">
                    First Name
                  </label>

                  <input
                    value={formData.firstName}
                    onChange={(e) =>
                      updateField("firstName", e.target.value)
                    }
                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />

                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400">
                    Last Name
                  </label>

                  <input
                    value={formData.lastName}
                    onChange={(e) =>
                      updateField("lastName", e.target.value)
                    }
                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />

                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400">
                    Email
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />

                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400">
                    Phone
                  </label>

                  <input
                    value={formData.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold">
                Account Information
              </h2>

              <div className="space-y-5 mt-6">
                <div>
                  <label className="text-sm text-gray-400">
                    Customer Type
                  </label>

                  <select
                    value={formData.type}
                    onChange={(e) =>
                      updateField("type", e.target.value)
                    }
                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3"
                  >
                    <option>Individual</option>
                    <option>Business</option>
                  </select>
                </div>

                {formData.type === "Business" && (
                  <>
                    <div>
                      <label className="text-sm text-gray-400">
                        Company Name
                      </label>

                      <input
                        value={formData.companyName}
                        onChange={(e) =>
                          updateField("companyName", e.target.value)
                        }
                        className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3"
                      />

                      {errors.companyName && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.companyName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">
                        VAT Number
                      </label>

                      <input
                        value={formData.vatNumber}
                        onChange={(e) =>
                          updateField("vatNumber", e.target.value)
                        }
                        className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm text-gray-400">
                    Status
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) =>
                      updateField("status", e.target.value)
                    }
                    className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold">Review</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span className="text-gray-500">Name</span>
                  <span>
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span className="text-gray-500">Email</span>
                  <span>{formData.email}</span>
                </div>

                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span className="text-gray-500">Phone</span>
                  <span>{formData.phone || "Not provided"}</span>
                </div>

                <div className="flex justify-between border-b border-gray-800 pb-3">
                  <span className="text-gray-500">
                    Customer Type
                  </span>
                  <span>{formData.type}</span>
                </div>

                {formData.type === "Business" && (
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-500">
                      Company
                    </span>
                    <span>{formData.companyName}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span>{formData.status}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <div className="text-sm text-gray-500">
              {saved ? "Draft saved automatically" : "Autosave enabled"}
            </div>

            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={previousStep}
                  className="border border-gray-700 px-4 py-2 rounded-lg"
                >
                  Previous
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
                >
                  Continue
                </button>
              ) : (
               <button
  onClick={handleSubmit}
  disabled={submitting}
  className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg"
>
  {submitting ? "Creating..." : "Create Customer"}
</button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}