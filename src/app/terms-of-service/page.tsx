"use client";

export default function TermsOfServicePage() {
  const sections = [
    {
      number: 1,
      title: "Acceptance of Terms",
      content:
        "By accessing our platform or placing an order, you agree to these Terms of Service. If you disagree with any part, please refrain from using our services.",
    },
    {
      number: 2,
      title: "Our Services",
      content:
        "MealWheel is a food delivery platform connecting customers with restaurants in NUST, H-13, and nearby areas. We facilitate ordering and delivery but do not cook or prepare food ourselves.",
    },
    {
      number: 3,
      title: "User Responsibilities",
      items: [
        "You must provide accurate and complete delivery details.",
        "You must ensure you are available to receive your order.",
        "You agree not to misuse the website, spam, or disrupt operations.",
        "You must be at least 16 years old to use our services.",
      ],
    },
    {
      number: 4,
      title: "Orders and Payments",
      items: [
        "All prices are listed in PKR and may include applicable taxes.",
        "Payments can be made through Cash on Delivery, JazzCash, EasyPaisa, or other available options.",
        "Once placed, orders cannot be canceled after restaurant confirmation.",
        "In rare cases, if an order cannot be fulfilled, a refund or replacement will be arranged.",
      ],
    },
    {
      number: 5,
      title: "Delivery Policy",
      items: [
        "Delivery times are estimates and may vary due to restaurant preparation or traffic.",
        "If the user is unreachable or provides incorrect details, MealWheel will not be responsible for missed deliveries.",
      ],
    },
    {
      number: 6,
      title: "Restaurant Liability",
      content:
        "MealWheel acts as an intermediary and is not responsible for food quality, freshness, or hygiene, as well as menu changes or unavailability. However, we monitor our partner restaurants and ensure compliance with quality standards.",
    },
    {
      number: 7,
      title: "Limitation of Liability",
      content:
        "MealWheel will not be liable for any indirect, incidental, or consequential damages arising from the use of our services.",
    },
    {
      number: 8,
      title: "Account Suspension",
      content:
        "MealWheel reserves the right to suspend or block users found engaging in fraudulent activity, misconduct, or policy violations.",
    },
    {
      number: 9,
      title: "Intellectual Property",
      content:
        "All logos, trademarks, and content on this website belong to MealWheel. Any unauthorized use is prohibited.",
    },
    {
      number: 10,
      title: "Governing Law",
      content:
        "These Terms are governed by the laws of Islamabad Capital Territory, Pakistan.",
    },
    {
      number: 11,
      title: "Contact Us",
      items: ["Email: support@mealwheel.pk", "Phone: 03283688688"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-base text-gray-500">
              Last updated: October 2025
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 leading-relaxed text-lg">
              Welcome to MealWheel! By using our website (mealwheel.pk) or
              services, you agree to the following terms and conditions. Please
              read them carefully.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.number} className="scroll-mt-20">
                <div className="flex gap-4 md:gap-6">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500 text-white font-bold text-lg md:text-xl">
                      {section.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>

                    {section.content && (
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {section.content}
                      </p>
                    )}

                    {section.items && (
                      <ul className="space-y-3">
                        {section.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex gap-3 text-gray-700 leading-relaxed"
                          >
                            <span className="text-orange-500 font-bold flex-shrink-0 mt-1">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="bg-gradient-to-r from-orange-50 to-transparent p-8 rounded-lg border border-orange-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Questions About Our Terms?
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <a
                    href="mailto:support@mealwheel.pk"
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                  >
                    support@mealwheel.pk
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <a
                    href="tel:03283688688"
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                  >
                    03283688688
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-12" />
    </div>
  );
}
