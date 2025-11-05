"use client";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      number: 1,
      title: "Information We Collect",
      items: [
        "Personal Information: Name, phone number, email address, and delivery address when placing an order.",
        "Order Information: Details of food items ordered, restaurants selected, and payment method.",
      ],
    },
    {
      number: 2,
      title: "How We Use Your Information",
      items: [
        "Process and deliver your food orders",
        "Communicate updates, order confirmations, or service changes",
        "Improve website performance and user experience",
        "Send promotional offers (only if you opt in)",
      ],
    },
    {
      number: 3,
      title: "Data Security",
      content:
        "We use SSL encryption and other industry-standard measures to protect your information. However, please note that no method of data transmission over the internet is 100% secure.",
    },
    {
      number: 4,
      title: "Sharing of Information",
      items: [
        "Partner restaurants and delivery riders (for fulfilling orders)",
        "Payment gateways (for transaction processing)",
        "Law enforcement (only when legally required)",
      ],
      footer: "We never sell or rent your personal data to third parties.",
    },
    {
      number: 5,
      title: "Your Rights",
      items: [
        "Request access, correction, or deletion of your personal data",
        "Opt out of promotional messages at any time",
        "Contact us via support@mealwheel.pk for privacy concerns",
      ],
    },
    {
      number: 6,
      title: "Cookies",
      content:
        "We use cookies to enhance user experience, store preferences, and analyze traffic. You can disable cookies in your browser settings.",
    },
    {
      number: 7,
      title: "Changes to Policy",
      content:
        "MealWheel may update this Privacy Policy periodically. Any major changes will be notified on the website.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
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
              At MealWheel, your privacy is our top priority. This Privacy
              Policy explains how we collect, use, and protect your personal
              information when you visit our website (mealwheel.pk) or use our
              services.
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
                      <ul className="space-y-3 mb-4">
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

                    {section.footer && (
                      <p className="text-gray-700 leading-relaxed italic">
                        {section.footer}
                      </p>
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
                Privacy Concerns?
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
